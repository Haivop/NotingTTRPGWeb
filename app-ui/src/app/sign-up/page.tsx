"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await login();

    router.push("/hub");
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
              Unseal Your First Codex
            </h1>
            <p className="text-sm">
              Begin your journey as an Archivist. Start scribing legends,
              sculpting realms, and charting luminous adventures for your table.
            </p>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_15%,rgba(255,255,255,0.25),transparent_50%)] opacity-35"
          />
        </div>

        <div className="flex flex-col gap-8 p-8 md:p-10">
          <header className="space-y-2">
            <p className="font-display text-m text-purple-200 text-center">
              SIGN UP
            </p>
            <h2 className="text-2xl font-semibold text-white text-center">
              Unlock your Codex
            </h2>
          </header>

          <form className="space-y-4" onSubmit={handleSignUp}>
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Username
              </label>
              <Input type="text" placeholder="Creator" className="mt-2" />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@realmkeeper.gg"
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Password
              </label>
              <Input type="password" placeholder="••••••••" className="mt-2" />
            </div>

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
            <button
              type="button"
              className="w-full rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Sign up with Google
            </button>
            <p className="text-sm text-white/60 text-center">
              Already an Archivist?{" "}
              <Link
                href="/sign-in"
                className="font-semibold uppercase tracking-[0.2em] text-purple-200"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
