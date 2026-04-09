import { Card } from "@/components/ui/card";

export default function VerifyRequestPage() {
  return (
    <Card className="text-center">
      <h1
        className="text-2xl font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        Check your email
      </h1>
      <p
        className="mt-2 text-sm"
        style={{ color: "var(--text-muted)" }}
      >
        A sign-in link has been sent to your email address.
      </p>
    </Card>
  );
}
