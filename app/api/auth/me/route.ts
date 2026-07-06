// app/api/auth/me/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function GET(request: Request) {
  // 1. Read the authorization token coming from your frontend client
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { detail: "Authorization token is required." },
      { status: 401 },
    );
  }

  try {
    // 2. Forward the GET request cleanly to your external backend with the token header
    const backendResponse = await fetch(
      `${BACKEND_URL.replace(/\/$/, "")}/auth/me`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      },
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
    console.error("Proxy auth/me fetch error:", error);
    return NextResponse.json(
      { detail: "Unable to connect to the authentication service." },
      { status: 502 },
    );
  }
}
