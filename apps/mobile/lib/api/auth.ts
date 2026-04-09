const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3003";

interface MagicLinkResponse {
  success: boolean;
}

interface AuthCallbackResponse {
  token: string;
  expiresAt: string;
  user: { id: string; email: string };
}

export async function requestMagicLink(
  email: string
): Promise<MagicLinkResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/magic-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error ?? "Failed to send magic link"
    );
  }

  return response.json();
}

export async function verifyCallback(
  token: string,
  email: string
): Promise<AuthCallbackResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/callback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, email }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error ?? "Authentication failed"
    );
  }

  return response.json();
}
