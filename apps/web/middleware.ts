import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Auth protection is handled in the dashboard layout (server-side).
  // This middleware is a placeholder for future use (e.g., rate limiting).
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard(.*)"],
};
