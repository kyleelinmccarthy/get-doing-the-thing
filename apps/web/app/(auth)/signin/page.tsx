"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    await signIn("email", { email, callbackUrl: "/dashboard" });
  }

  return (
    <Card>
      <h1
        className="text-2xl font-medium text-center"
        style={{ color: "var(--text-primary)" }}
      >
        Sign in
      </h1>
      <p
        className="mt-2 text-center text-sm"
        style={{ color: "var(--text-muted)" }}
      >
        Enter your email to receive a magic link.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <Button
          type="submit"
          variant="neutral"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? "Sending link..." : "Send magic link"}
        </Button>
      </form>
    </Card>
  );
}
