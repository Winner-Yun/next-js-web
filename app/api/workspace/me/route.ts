/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/workspace/me/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization token is required." },
        { status: 401 },
      );
    }

    const cleanUrl = BACKEND_URL.replace(/\/$/, "");

    const { searchParams } = new URL(request.url);

    const searchValue = searchParams.get("search");
    const forwardParams = new URLSearchParams();
    if (searchValue !== null) {
      forwardParams.set("q", searchValue);
    }

    searchParams.forEach((value, key) => {
      if (key !== "search") {
        forwardParams.set(key, value);
      }
    });

    const query = forwardParams.toString();
    const targetUrl = `${cleanUrl}/workspace/me${query ? `?${query}` : ""}`;

    const backendResponse = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
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
      { detail: "Unable to reach workspace backend service." },
      { status: 500 },
    );
  }
}
