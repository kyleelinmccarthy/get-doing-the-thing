import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <Card className="text-center">
      <h1
        className="text-2xl font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        Something went wrong
      </h1>
      <p
        className="mt-2 text-sm"
        style={{ color: "var(--text-muted)" }}
      >
        The sign-in link may have expired. Try again.
      </p>
      <Link href="/signin" className="mt-6 block">
        <Button variant="neutral" fullWidth>
          Back to sign in
        </Button>
      </Link>
    </Card>
  );
}
