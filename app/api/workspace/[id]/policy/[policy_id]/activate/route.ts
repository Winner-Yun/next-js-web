import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; policy_id: string }> },
) {
  try {
    const resolvedParams = await params;
    const workspaceId = resolvedParams?.id;
    const policyId = resolvedParams?.policy_id;

    if (!workspaceId || !policyId) {
      return NextResponse.json(
        { detail: "Workspace ID and Policy ID are required." },
        { status: 400 },
      );
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization required." },
        { status: 401 },
      );
    }

    // Format target microservice URL
    const cleanUrl = BACKEND_URL.replace(/\/$/, "");
    const targetUrl = `${cleanUrl}/workspace/${workspaceId}/policy/${policyId}/activate`;

    // Proxy the PATCH execution to the backend server engine
    const backendResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    // Handle empty responses (like 204 No Content) gracefully
    if (backendResponse.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Proxy policy activation error:", error);
    return NextResponse.json(
      { detail: "Internal server error handling policy activation." },
      { status: 500 },
    );
  }
}
