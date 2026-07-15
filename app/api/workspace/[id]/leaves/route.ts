/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/workspace/attendance/[id]/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function GET(request: Request, { params }: { params: unknown }) {
  try {
    const resolvedParams = await params;
    const workspaceId = resolvedParams?.id;

    if (!workspaceId) {
      return NextResponse.json(
        { detail: "Workspace ID is required." },
        { status: 400 },
      );
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization token is required." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const cleanUrl = BACKEND_URL.replace(/\/$/, "");

    const targetUrl = `${cleanUrl}/workspace/leaves/${workspaceId}${queryString ? `?${queryString}` : ""}`;

    const backendResponse = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    const contentType = backendResponse.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { detail: "Backend service returned an invalid response format." },
        { status: 502 },
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    return NextResponse.json(
      { detail: "Internal server error handling attendance proxy request." },
      { status: 500 },
    );
  }
}
