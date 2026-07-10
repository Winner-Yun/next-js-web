import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; geofence_id: string }> },
) {
  try {
    const resolvedParams = await params;
    const workspaceId = resolvedParams?.id;
    const geofenceId = resolvedParams?.geofence_id;

    if (!workspaceId || !geofenceId) {
      return NextResponse.json(
        { detail: "Workspace ID and Geofence ID are required." },
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

    // Attempt to parse a body if one was sent, but don't fail if the request is empty
    // (Activation endpoints often don't require a payload body)
    let body = null;
    try {
      body = await request.json();
    } catch {
      // Body is empty or invalid JSON; proceed without it
    }

    const cleanUrl = BACKEND_URL.replace(/\/$/, "");
    const targetUrl = `${cleanUrl}/workspace/${workspaceId}/geofence/${geofenceId}/activate`;

    const backendResponse = await fetch(targetUrl, {
      method: "POST", // Note: Change to PATCH if your backend framework requires it
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    const contentType = backendResponse.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const errorText = await backendResponse.text();
      console.error(
        "Backend returned non-JSON response for geofence activation:",
        errorText,
      );
      return NextResponse.json(
        { detail: "Backend service returned an invalid response format." },
        { status: 502 },
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Proxy geofence activation process error:", error);
    return NextResponse.json(
      { detail: "Internal server error handling geofence activation request." },
      { status: 500 },
    );
  }
}
