import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-medium tracking-tight" style={{ color: "var(--text-primary)" }}>
          Doing The Thing.
        </h1>
        <p className="mt-3 text-base" style={{ color: "var(--text-muted)" }}>
          A nudge when you need it. Nothing more.
        </p>
        <Link
          href="/signin"
          className="mt-8 inline-flex w-full items-center justify-center rounded-btn px-6 py-4 text-base font-medium text-[var(--btn-text)] transition-colors duration-hover"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
