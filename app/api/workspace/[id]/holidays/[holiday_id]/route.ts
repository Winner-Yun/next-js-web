import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; holiday_id: string }> },
) {
  try {
    const resolvedParams = await params;
    const workspaceId = resolvedParams?.id;
    const holidayId = resolvedParams?.holiday_id;

    if (!workspaceId || !holidayId) {
      return NextResponse.json(
        { detail: "Workspace ID and Holiday ID are required." },
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

    const cleanUrl = BACKEND_URL.replace(/\/$/, "");
    const targetUrl = `${cleanUrl}/workspace/${workspaceId}/holiday/${holidayId}`;

    const backendResponse = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    const contentType = backendResponse.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const errorText = await backendResponse.text();
      console.error("Backend returned non-JSON response:", errorText);
      return NextResponse.json(
        { detail: "Backend service returned an invalid response format." },
        { status: 502 },
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Proxy GET single holiday error:", error);
    return NextResponse.json(
      { detail: "Internal server error handling request." },
      { status: 500 },
    );
  }
}
