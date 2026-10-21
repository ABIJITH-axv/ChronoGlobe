"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Role } from "@/lib/types";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setBusy(false);
      setError("Authentication is not configured yet. Add your Supabase project URL and anon key to .env.local, then restart the app.");
      return;
    }
    try {
      const sb = supabase();
      const result = mode === "signup"
        ? await sb.auth.signUp({ email, password, options: { data: { role }, emailRedirectTo: `${location.origin}/auth/callback` } })
        : await sb.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (result.error) return setError(result.error.message);
      if (mode === "signup" && !result.data.session) {
        setError("Account created. Check your email to confirm the account before logging in.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setBusy(false);
      setError("Could not connect to Supabase. Check your configuration and try again.");
    }
  }

  const field = "w-full rounded bg-abyss border border-chalk/20 px-3 py-2 focus:border-brass outline-none";
  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-lg bg-tide p-6">
      <h1 className="font-display text-2xl">{mode === "signup" ? "Create your account" : "Log in"}</h1>
      <input className={field} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className={field} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
      {mode === "signup" && (
        <label className="block text-sm">I am a
          <select className={`${field} mt-1`} value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="researcher">Researcher</option>
          </select>
        </label>
      )}
      {error && <p role="alert" className="text-sm text-ember">{error}</p>}
      <button disabled={busy} className="w-full rounded bg-brass py-2 font-medium text-abyss disabled:opacity-60">
        {busy ? "Working…" : mode === "signup" ? "Sign up" : "Log in"}
      </button>
    </form>
  );
}
