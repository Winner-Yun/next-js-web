import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const workspaceId = resolvedParams?.id;

    if (!workspaceId) {
      return NextResponse.json(
        { detail: "Workspace ID is required." },
        { status: 400 },
      );
    }

    // Capture the Authorization header from the incoming request
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization token is required." },
        { status: 401 },
      );
    }

    // Safely extract the incoming policy configuration payload body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { detail: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    // Format target microservice URL
    const cleanUrl = BACKEND_URL.replace(/\/$/, "");
    const targetUrl = `${cleanUrl}/workspace/${workspaceId}/policy`;

    // Proxy the POST execution down to the backend server engine
    const backendResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Guard statement for non-JSON responses
    const contentType = backendResponse.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const errorText = await backendResponse.text();
      console.error(
        "Backend returned non-JSON response for policy creation:",
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
    console.error("Proxy policy creation error:", error);
    return NextResponse.json(
      { detail: "Internal server error handling policy creation request." },
      { status: 500 },
    );
  }
}
