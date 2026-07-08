// Proxy /auth/me to backend
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

async function proxyAuthMe(
  request: Request,
  method: "GET" | "PATCH",
): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { detail: "Authorization token is required." },
      { status: 401 },
    );
  }

  try {
    const init: RequestInit = {
      method,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    };

    if (method === "PATCH") {
      const body = await request.text();
      if (body) init.body = body;
    }

    const backendResponse = await fetch(
      `${BACKEND_URL.replace(/\/$/, "")}/auth/me`,
      init,
    );

    const text = await backendResponse.text();
    return new NextResponse(text, {
      status: backendResponse.status,
      headers: {
        "Content-Type":
          backendResponse.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error(`Proxy auth/me ${method} fetch error:`, error);
    return NextResponse.json(
      { detail: "Unable to connect to the authentication service." },
      { status: 502 },
    );
  }
}

export async function GET(request: Request) {
  return proxyAuthMe(request, "GET");
}

export async function PATCH(request: Request) {
  return proxyAuthMe(request, "PATCH");
}
