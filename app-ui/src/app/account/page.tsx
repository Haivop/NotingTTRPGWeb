"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useWorldCollection } from "@/hooks/useWorldCollection";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/components/layout/AuthContext";
import { updateUserProfile } from "@/lib/user-api";

export default function AccountPage() {
  const router = useRouter();
  const { worlds, isLoading } = useWorldCollection();
  const { user, isLoggedIn, refreshUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({ username: user?.username ?? "", email: user?.email ?? "" });
  const [saving, setSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormState({ username: user?.username ?? "", email: user?.email ?? "" });
  }, [user?.username, user?.email]);

  const ownedWorlds = useMemo(() => {
    if (!user) return [];
    return worlds.filter((world) => world.authorId === user.id);
  }, [worlds, user]);

  const collaboratingWorlds = useMemo(() => {
    if (!user) return [];
    return worlds.filter((world) => world.authorId !== user.id);
  }, [worlds, user]);

  const invitedCoAuthors = useMemo(() => {
    return ownedWorlds.reduce((sum, world) => sum + (world.coAuthorIds?.length ?? 0), 0);
  }, [ownedWorlds]);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setProfileMessage(null);
    try {
      await updateUserProfile({
        username: formState.username.trim() || undefined,
        email: formState.email.trim() || undefined,
      });
      await refreshUser();
      setIsEditing(false);
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile", error);
      setProfileMessage("Unable to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <PageContainer className="space-y-6 py-20 text-center text-white/80">
        <p>You need to sign in to view your Archivist profile.</p>
        <div className="flex justify-center gap-4">
          <Link href="/sign-in" className="rounded-full border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.2em] text-white/80 hover:border-white/40">
            Sign In
          </Link>
          <Link href="/sign-up" className="rounded-full border border-purple-400/40 px-6 py-3 text-sm uppercase tracking-[0.2em] text-purple-100 hover:border-purple-200/60">
            Create Account
          </Link>
        </div>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer className="text-white text-center py-20">
        <p className="text-lg">Loading Archivist Data...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-10">
      <header className="flex flex-col gap-4 py-4 text-left md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-xs text-purple-200">
            ARCHIVIST PROFILE
          </p>
          <h1 className="text-3xl font-semibold text-white">
            {user?.username || "Archivist"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            {user?.email || "No e-mail on file"}
          </p>
          {profileMessage && (
            <p className="text-sm text-purple-200">{profileMessage}</p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          className="min-w-[200px]"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </header>

      {isEditing && (
        <GlassPanel className="p-6 text-sm text-white/80">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleProfileSubmit}>
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">Username</label>
              <Input
                className="mt-2"
                value={formState.username}
                onChange={(e) => setFormState((prev) => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">Email</label>
              <Input
                type="email"
                className="mt-2"
                value={formState.email}
                onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </GlassPanel>
      )}

      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <GlassPanel className="p-8 text-sm text-white/70">
          <div className="flex flex-col items-center gap-4">
            <div className="h-32 w-32 rounded-full border border-white/20 bg-[radial-gradient(circle_at_30%_30%,rgba(192,132,252,0.45),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(244,114,182,0.35),transparent_60%)]" />
            <div className="text-center">
              <p className="font-display text-xs text-purple-200">
                MEMBER SINCE
              </p>
              <p className="mt-1 text-lg text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>
          <dl className="mt-6 space-y-4">
            <div className="flex justify-between">
              <dt className="uppercase tracking-[0.26em] text-white/45">
                Worlds
              </dt>
              <dd>{ownedWorlds.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="uppercase tracking-[0.26em] text-white/45">
                Collaborations
              </dt>
              <dd>{collaboratingWorlds.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="uppercase tracking-[0.26em] text-white/45">
                Co-Authors
              </dt>
              <dd>{invitedCoAuthors}</dd>
            </div>
          </dl>

          <div className="mt-8 space-y-3">
            <p className="font-display text-[11px] text-purple-200/80">
              Pinned Achievements
            </p>
            <ul className="space-y-2 text-xs">
              <li>Keeper of the Stormbound Accord</li>
              <li>Cartographer&apos;s Guild Laureate</li>
              <li>Chronicle Exchange Host</li>
            </ul>
          </div>
        </GlassPanel>

        <div className="space-y-8">
          <GlassPanel title="WORLD COLLECTION">
            <div className="grid gap-6 md:grid-cols-2">
              {worlds.map((world) => (
                <article
                  key={world.id}
                  className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70"
                >
                  <div className="h-28 rounded-2xl border border-white/15 bg-[radial-gradient(circle_at_65%_20%,rgba(192,132,252,0.4),transparent_60%),radial-gradient(circle_at_30%_80%,rgba(244,114,182,0.3),transparent_60%)]" />
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xs text-purple-100">
                      {world.name}
                    </p>
                    <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/55">
                      {world.type}
                    </span>
                  </div>
                  <p>{world.description}</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/worlds/${world.id}`}
                      className="flex-1 min-w-0 px-4"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1 min-w-0 px-4"
                      >
                        View
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 min-w-0 px-4"
                      onClick={() => router.push(`/worlds/${world.id}/edit`)}
                    >
                      Edit
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel title="SESSION NOTES">
            <div className="space-y-4 text-sm text-white/70">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-display text-[11px] text-purple-100/80">
                  Upcoming Session
                </p>
                <p className="mt-2">
                  Finalize the Tempest Choir negotiation encounter.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-display text-[11px] text-purple-100/80">
                  Player Spotlight
                </p>
                <p className="mt-2">
                  Sable is drafting a new artifact. Review before Friday.
                </p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </PageContainer>
  );
}
