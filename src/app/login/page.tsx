"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { siteConfig } from "@/content/site";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        // Fetch session to determine user role for redirect
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const role = session?.user?.role;

        if (role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/client");
        }
      }
    } catch {
      setError("Network error: synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B10] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex p-3 rounded-2xl bg-accent/10 text-accent mb-4"
          >
            <Lock size={24} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-white tracking-tight"
          >
            {t("login.title") || "Client Portal"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-sm"
          >
            {t("login.desc") || `Secure access to your project dashboard with ${siteConfig.brand}`}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-10 rounded-3xl border-white/5 space-y-6"
        >
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-shake">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                {t("login.email") || "Email Address"}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:border-accent outline-none transition-all placeholder:text-gray-700"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                {t("login.password") || "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:border-accent outline-none transition-all placeholder:text-gray-700"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pr-2">
              <Link href="/forgot-password" title="Recovery" className="text-[9px] font-black text-white/20 hover:text-accent transition-colors uppercase tracking-widest">
                Forgot Token? (Recovery)
              </Link>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl py-4 font-bold"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (t("login.signing_in") || "Signing in...") : (t("login.cta") || "Secure Login")}
                  {!loading && <ArrowRight size={18} />}
                </span>
              </Button>
            </div>
          </form>
        </motion.div>

        <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest">
            {siteConfig.brand} • {t("login.footer") || "Secure Infrastructure"}
        </p>
      </div>
    </div>
  );
}
