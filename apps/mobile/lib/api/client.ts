import { getToken, clearToken } from "@/lib/auth/storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3003";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    await clearToken();
    throw new ApiError(401, "Unauthorized");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      (errorBody as { error?: string }).error ?? "Request failed"
    );
  }

  return response.json() as Promise<T>;
}
