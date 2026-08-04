// Proxy /notification/me/telegram-notification to backend
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function PATCH(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { detail: "Authorization token is required." },
      { status: 401 },
    );
  }

  try {
    const body = await request.text();

    const backendResponse = await fetch(
      `${BACKEND_URL.replace(/\/$/, "")}/notification/me/telegram-notification`,
      {
        method: "PATCH",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body,
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
      { detail: "Unable to connect to the notification service." },
      { status: 502 },
    );
  }
}
