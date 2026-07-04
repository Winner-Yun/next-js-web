import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(request: Request) {
  let body: { token?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { detail: "Invalid authentication payload." },
      { status: 400 },
    );
  }

  if (!body.token) {
    return NextResponse.json(
      { detail: "Google token is required." },
      { status: 400 },
    );
  }

  try {
    const backendResponse = await fetch(
      `${BACKEND_URL.replace(/\/$/, "")}/auth/google/callback`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: body.token }),
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
  } catch {
    return NextResponse.json(
      { detail: "Unable to connect to the authentication service." },
      { status: 502 },
    );
  }
}
