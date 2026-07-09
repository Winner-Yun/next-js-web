import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; userId: string }> },
) {
  try {
    const resolvedParams = await params;
    const workspaceId = resolvedParams?.id;
    const userId = resolvedParams?.userId;

    // Validate path parameters
    if (!workspaceId || !userId) {
      return NextResponse.json(
        { detail: "Workspace ID and User ID are required." },
        { status: 400 },
      );
    }

    // Capture and forward the bearer authorization token
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization token is required." },
        { status: 401 },
      );
    }

    const cleanUrl = BACKEND_URL.replace(/\/$/, "");

    const targetUrl = `${cleanUrl}/workspace/${workspaceId}/members/${userId}`;

    // Request deletion from the core backend ecosystem
    const backendResponse = await fetch(targetUrl, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    // Verify response content-type
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
    console.error("Proxy member deletion error:", error);
    return NextResponse.json(
      { detail: "Internal server error handling member deletion request." },
      { status: 500 },
    );
  }
}
