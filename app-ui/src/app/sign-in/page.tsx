"use client";

import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/layout/AuthContext";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const identifier = (formData.get("identifier") as string) ?? "";
    const password = (formData.get("password") as string) ?? "";

    try {
      await login({ identifier, password });
      router.push("/hub");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer className="max-w-5xl">
      <div className="glass-panel grid gap-10 overflow-hidden p-0 md:grid-cols-[1.1fr_1fr]">
        <div className="relative hidden bg-[radial-gradient(circle_at_top,rgba(192,132,252,0.45),transparent_55%),radial-gradient(circle_at_20%_80%,rgba(244,114,182,0.25),transparent_60%),linear-gradient(160deg,#17112d,#1f1a38)] md:flex">
          <div className="relative z-10 flex flex-col justify-end gap-6 p-10 text-white/80">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-100/90">
              Worldcraftery
            </p>
            <h1 className="text-3xl font-semibold text-white">
              Re-enter the Archive
            </h1>
            <p className="text-sm">
              Continue scribing legends, sculpting realms, and guiding your table through luminous adventures.
            </p>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_15%,rgba(255,255,255,0.25),transparent_50%)] opacity-35"
          />
        </div>

        <div className="flex flex-col gap-8 p-8 md:p-10">
          <header className="space-y-2">
            <p className="font-display text-m text-purple-200 text-center">SIGN IN</p>
            <h2 className="text-2xl font-semibold text-white text-center">Unlock your Codex</h2>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">Email or Username</label>
              <Input type="text" placeholder="you@realmkeeper.gg" className="mt-2" name="identifier" required />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">Password</label>
                <Link href="#" className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
                  Forgot?
                </Link>
              </div>
              <Input type="password" placeholder="••••••••" className="mt-2" name="password" required />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
            <button
              type="button"
              className="w-full rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Sign in with Google
            </button>
          </form>

          <p className="text-sm text-white/60">
            New to Worldcraftery?{" "}
            <Link href="/sign-up" className="font-semibold uppercase tracking-[0.2em] text-purple-200">
              Begin your first world
            </Link>
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
