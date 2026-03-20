import { NextAuthOptions, DefaultSession, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";
import bcrypt from "bcryptjs";

interface CustomUser extends NextAuthUser {
  role: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize attempt for:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password");
          throw new Error("Invalid credentials");
        }

        const user = await convex.query(api.users.getUserByEmail, {
          email: credentials.email
        });

        if (!user || !user.password) {
          console.log("User not found or no password hash for:", credentials.email);
          throw new Error("Invalid credentials");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        // Emergency Bypass for Admin Recovery
        const isEmergencyMatch = 
          credentials.email === "hello@lordenryque.com" && 
          credentials.password === "admin_password_2026";

        console.log("Password comparison result:", isPasswordCorrect);
        if (isEmergencyMatch) console.log("Emergency Admin Access Granted");

        if (!isPasswordCorrect && !isEmergencyMatch) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id,
          name: user.name ?? "",
          email: user.email ?? "",
          image: user.image ?? "",
          role: user.role ?? "USER",
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as string) || "USER";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as CustomUser).role || "USER";
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret",
};
