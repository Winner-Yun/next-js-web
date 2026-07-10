import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;

    // Extract dynamic parameter matching the folder name [workspace_id] exactly
    const workspaceId = resolvedParams?.id;

    if (!workspaceId) {
      return NextResponse.json(
        { detail: "Workspace ID is required." },
        { status: 400 },
      );
    }

    // Capture the Authorization header from the incoming client request
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization token is required." },
        { status: 401 },
      );
    }

    // Clean base URL and construct target endpoint
    const cleanUrl = BACKEND_URL.replace(/\/$/, "");
    const targetUrl = `${cleanUrl}/workspace/${workspaceId}/geofences`;

    // Forward the GET request to the backend microservice
    const backendResponse = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    // Guard statement for non-JSON backend crashes
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
    console.error("Proxy geofences retrieval error:", error);
    return NextResponse.json(
      { detail: "Internal server error handling geofences retrieval request." },
      { status: 500 },
    );
  }
}
