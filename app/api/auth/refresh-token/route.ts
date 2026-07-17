/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function POST(request: Request) {
  try {
    const targetUrl = `${BACKEND_URL.replace(/\/$/, "")}/auth/refresh-token`;
    const requestHeaders = new Headers();
    const body = await request.text();
    let forwardedBody = body;
    let refreshToken = "";

    if (body) {
      try {
        const parsedBody = JSON.parse(body) as {
          refresh_token?: string;
          refreshToken?: string;
          token?: string;
        };

        refreshToken =
          parsedBody.refresh_token ??
          parsedBody.refreshToken ??
          parsedBody.token ??
          "";

        if (refreshToken) {
          forwardedBody = JSON.stringify({ refresh_token: refreshToken });
        }
      } catch {
        forwardedBody = body;
      }
    }

    const requestContentType = request.headers.get("content-type");

    if (requestContentType) {
      requestHeaders.set("Content-Type", requestContentType);
    }

    if (refreshToken) {
      requestHeaders.set("Authorization", `Bearer ${refreshToken}`);
    }

    const backendResponse = await fetch(targetUrl, {
      method: "POST",
      headers: requestHeaders,
      ...(forwardedBody && { body: forwardedBody }),
    });

    const responseContentType =
      backendResponse.headers.get("content-type") ?? "";

    if (!responseContentType.includes("application/json")) {
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
