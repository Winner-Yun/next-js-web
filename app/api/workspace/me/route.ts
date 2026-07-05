// app/api/workspace/me/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function GET(request: Request) {
  // 1. Forward the Authorization token sent from the browser
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { detail: "Authorization token is required." },
      { status: 401 },
    );
  }

  try {
    // 2. Safely call your backend from the Next.js server side (bypassing browser CORS)
    const backendResponse = await fetch(
      `${BACKEND_URL.replace(/\/$/, "")}/workspace/me`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await backendResponse.json();

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("Workspace proxy fetch error:", error);
    return NextResponse.json(
      { detail: "Unable to reach workspace backend service." },
      { status: 500 },
    );
  }
}
