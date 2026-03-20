Here is the step-by-step guide to generating your Google Analytics API credentials and adding them to your `.env.local` file so the dashboard goes live.

### Step 1: Get your GA4 Property ID

1. Go to your [Google Analytics Dashboard](https://analytics.google.com).
2. Click the **Admin** gear icon in the bottom left.
3. Under the _Property_ column, click **Property Settings**.
4. Copy the **Property ID** (it's a string of numbers, e.g., `123456789`).
5. Open your `.env.local` file and add this line:
   ```env
   GA4_PROPERTY_ID="123456789"
   ```

### Step 2: Create a Service Account (Google Cloud)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. In the search bar, look for **Google Analytics Data API** and click **Enable**.
4. Navigate to **IAM & Admin > Service Accounts**.
5. Click **+ CREATE SERVICE ACCOUNT**.
6. Give it a name (like `portfolio-ga4-analytics`) and click **Create and Continue**, then **Done**.
7. In the list of service accounts, you will see an email address (e.g., `portfolio-ga4-analytics@your-project-id.iam.gserviceaccount.com`). **Copy this email address**.
8. Click on the 3 dots next to your new service account, select **Manage Keys**, then **Add Key > Create New Key**.
9. Choose **JSON** and hit create. This will download a file to your computer.

### Step 3: Add the Service Account to Google Analytics

1. Go back to your [Google Analytics Admin Dashboard](https://analytics.google.com).
2. Under the _Property_ column, click **Property Access Management**.
3. Click the blue **+** button and select **Add users**.
4. Paste the **Service Account Email** you copied in Step 2.
5. Set the role strictly to **Viewer** and click **Add**.

### Step 4: Add Keys to your `.env.local`

Open the JSON file that downloaded to your computer in Step 2. You will need two specific strings from it. Add them to your `.env.local` file like this:

```env
# Google Analytics 4 Telemetry
GA4_PROPERTY_ID="123456789"
GOOGLE_CLIENT_EMAIL="portfolio-ga4-analytics@your-project-id.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIB...[your entire private key block]...\n-----END PRIVATE KEY-----\n"
```

_(Make sure the `GOOGLE_PRIVATE_KEY` uses exact quotes and retains all the `\n` line breaks exactly as they appear in the JSON file)._

### Step 5: Test It

Once those three variables are in `.env.local`, restart your local Next.js server (`npm run dev`) and refresh your Admin Panel. The dashboard will instantly authenticate with Google and start rendering your actual 30-day traffic!
