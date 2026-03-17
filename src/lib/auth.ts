import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import bcrypt from "bcryptjs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface CustomUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: string;
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

        console.log("Password comparison result:", isPasswordCorrect);

        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        } as any;
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
