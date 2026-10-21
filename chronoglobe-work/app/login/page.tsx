import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";

export default function Page() {
  return (
    <main className="grid min-h-screen place-items-center gap-4 p-6">
      <AuthForm mode="login" />
      <Link className="text-sm underline" href="/signup">Need an account? Sign up</Link>
    </main>
  );
}
