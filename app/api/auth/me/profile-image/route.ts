/* eslint-disable @typescript-eslint/no-unused-vars */
// Proxy /auth/me/profile-image to backend
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const runtime = "nodejs";

async function proxyProfileImage(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { detail: "Authorization token is required." },
      { status: 401 },
    );
  }

  try {
    const incomingForm = await request.formData();

    const outboundForm = new FormData();
    for (const [key, value] of incomingForm.entries()) {
      outboundForm.append(key, value);
    }

    const backendResponse = await fetch(
      `${BACKEND_URL.replace(/\/$/, "")}/auth/me/profile-image`,
      {
        method: "PATCH",
        headers: {
          Authorization: authHeader,
        },
        body: outboundForm,
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
    return NextResponse.json(
      { detail: "Unable to connect to the authentication service." },
      { status: 502 },
    );
  }
}

export async function PATCH(request: Request) {
  return proxyProfileImage(request);
}
