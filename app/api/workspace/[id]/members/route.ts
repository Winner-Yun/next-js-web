// app/api/workspace/[id]/members/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function GET(request: Request, { params }: { params: unknown }) {
  try {
    // 1. Safely resolve params inside the try-catch block
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

    const cleanUrl = BACKEND_URL.replace(/\/$/, "");
    const backendResponse = await fetch(
      `${cleanUrl}/workspace/workspaces/${workspaceId}/members`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      },
    );

    // 2. Validate content type response format
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
    console.error("Proxy members fetch error:", error);
    return NextResponse.json(
      { detail: "Internal server error handling members proxy request." },
      { status: 500 },
    );
  }
}
