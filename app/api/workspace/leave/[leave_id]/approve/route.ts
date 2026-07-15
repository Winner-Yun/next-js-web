/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function PATCH(request: Request, { params }: { params: unknown }) {
  try {
    const resolvedParams = (await params) as { leave_id: string };
    const leaveId = resolvedParams?.leave_id;

    if (!leaveId) {
      return NextResponse.json(
        { detail: "Leave ID is required." },
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

    const body = await request.json();

    if (!body || !body.status) {
      return NextResponse.json(
        { detail: "Status field is required." },
        { status: 400 },
      );
    }

    const cleanUrl = BACKEND_URL.replace(/\/$/, "");

    const targetUrl = `${cleanUrl}/workspace/leave/${leaveId}/approve`;

    const backendResponse = await fetch(targetUrl, {
      method: "PATCH",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: body.status }),
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
      { detail: "Internal server error handling leave approve proxy request." },
      { status: 500 },
    );
  }
}
