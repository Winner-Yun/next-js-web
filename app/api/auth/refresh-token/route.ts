/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function POST(request: Request) {
  try {
    const targetUrl = `${BACKEND_URL.replace(/\/$/, "")}/auth/refresh-token`;
    const requestHeaders = new Headers(request.headers);

    requestHeaders.delete("host");

    const body = await request.text();

    const backendResponse = await fetch(targetUrl, {
      method: "POST",
      headers: requestHeaders,
      ...(body && { body }),
    });

    const contentType = backendResponse.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { detail: "Backend service returned an invalid response format." },
        { status: 502 },
      );
    }

    const data = await backendResponse.json();

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    return NextResponse.json(
      { detail: "Internal server error handling request." },
      { status: 500 },
    );
  }
}
