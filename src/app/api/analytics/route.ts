import { NextResponse } from "next/server";

// Using the REST API directly avoids needing @google-analytics/data
// Requires a Service Account credential JSON and a GA4 Property ID
export async function GET() {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  // Private key needs to have literal \n replaced if stored in env
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!propertyId || !clientEmail || !privateKey) {
    return NextResponse.json(
      { error: "Google Analytics 4 configuration missing." },
      { status: 501 }
    );
  }

  try {
    // 1. Generate a JWT token for Google Analytics API
    const token = await generateGoogleAuthToken(clientEmail, privateKey);

    if (!token) {
      throw new Error("Failed to generate Google API auth token");
    }

    // 2. Fetch 30-day report from Data API (v1beta)
    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        metrics: [
          { name: "totalUsers" },
          { name: "sessions" },
          { name: "engagementRate" },
        ],
        dimensions: [{ name: "date" }],
      }),
    });

    if (!response.ok) {
        return NextResponse.json({ error: "API Failure", details: await response.text() }, { status: 500 });
    }

    const data = await response.json();
    
    // Parse Google Data API response into a format for the frontend chart
    const metrics = {
      users: 0,
      sessions: 0,
      engagement: 0,
      timeline: [] as { date: string, users: number }[] // For a LineChart
    };

    if (data.rows && data.rows.length > 0) {
      data.rows.forEach((row: any) => {
        metrics.users += parseInt(row.metricValues[0].value);
        metrics.sessions += parseInt(row.metricValues[1].value);
        metrics.timeline.push({
           date: row.dimensionValues[0].value,
           users: parseInt(row.metricValues[0].value)
        });
      });
      
      // Average engagement rate
      const totalEng = data.rows.reduce((acc: number, row: any) => acc + parseFloat(row.metricValues[2].value), 0);
      metrics.engagement = totalEng / data.rows.length;
    }

    return NextResponse.json({ success: true, data: metrics });

  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// Minimal JWT Generator without bringing in googleapis
async function generateGoogleAuthToken(email: string, privateKey: string) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const claim = {
    iss: email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp,
    iat,
  };

  try {
     const crypto = require("crypto");
     
     const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
     const encodedClaim = Buffer.from(JSON.stringify(claim)).toString("base64url");
     
     const signatureInput = `${encodedHeader}.${encodedClaim}`;
     
     const sign = crypto.createSign("RSA-SHA256");
     sign.update(signatureInput);
     const signature = sign.sign(privateKey, "base64url");
     
     const jwt = `${signatureInput}.${signature}`;
     
     // Exchange JWT for an access token
     const authRes = await fetch("https://oauth2.googleapis.com/token", {
       method: "POST",
       headers: { "Content-Type": "application/x-www-form-urlencoded" },
       body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
     });
     
     if (!authRes.ok) {
        console.error("Token Exchange Failed:", await authRes.text());
        return null;
     }
     const authData = await authRes.json();
     return authData.access_token;
  } catch (e) {
      console.error("Crypto signing error", e);
      return null; 
  }
}
