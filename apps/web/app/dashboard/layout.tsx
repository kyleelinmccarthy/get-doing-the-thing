import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/features/theme-toggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b-2 border-[var(--header-border)] bg-[var(--header-bg)]">
        {/* Mobile: stacked */}
        <div className="sm:hidden">
          <div className="px-4 py-3">
            <h1
              className="text-2xl font-medium text-center"
              style={{ color: "var(--text-primary)" }}
            >
              Doing The Thing
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 px-4 pb-3">
            <ThemeToggle />
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="muted" className="text-sm px-4 py-2">
                Sign out
              </Button>
            </form>
          </div>
        </div>
        {/* Desktop: single row */}
        <div className="hidden sm:flex relative items-center justify-center px-6 py-3">
          <h1
            className="text-2xl font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Doing The Thing
          </h1>
          <div className="absolute right-6 flex items-center gap-2">
            <ThemeToggle />
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="muted" className="text-sm px-4 py-2">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
