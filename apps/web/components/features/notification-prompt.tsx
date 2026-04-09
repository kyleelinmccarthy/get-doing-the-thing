"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subscribeToPush, isPushSubscribed } from "@/lib/notifications/client";

export function NotificationPrompt() {
  const [show, setShow] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      if (typeof window === "undefined") return;

      const dismissed = localStorage.getItem("notification-prompt-dismissed");
      if (dismissed) return;

      if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

      if (Notification.permission === "granted") {
        const subscribed = await isPushSubscribed();
        if (subscribed) return;
      }

      if (Notification.permission === "denied") return;

      setShow(true);
    }

    checkSubscription();
  }, []);

  if (!show) return null;

  async function handleEnable() {
    setIsSubscribing(true);
    const success = await subscribeToPush();
    setIsSubscribing(false);

    if (success) {
      setShow(false);
    }
  }

  function handleDismiss() {
    localStorage.setItem("notification-prompt-dismissed", "true");
    setShow(false);
  }

  return (
    <Card className="mb-4">
      <div className="space-y-3">
        <p
          className="text-base font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Enable notifications
        </p>
        <p
          className="text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          The whole point is the nudge. Without notifications, this app is just a to-do list.
        </p>
        <div className="flex gap-2">
          <Button
            variant="neutral"
            onClick={handleEnable}
            disabled={isSubscribing}
            className="flex-1"
          >
            {isSubscribing ? "Enabling..." : "Enable"}
          </Button>
          <Button variant="ghost" onClick={handleDismiss} className="flex-1">
            Not now
          </Button>
        </div>
      </div>
    </Card>
  );
}
