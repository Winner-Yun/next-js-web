import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, //  Changed to a Promise type
) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization token is required." },
        { status: 401 },
      );
    }

    // 1. Unwrap the dynamic route parameters safely using await
    const { id: workspaceId } = await params;

    // 2. Parse request body JSON payload
    const { workspace_name, description } = await request.json();

    if (!workspaceId) {
      return NextResponse.json(
        { detail: "Workspace ID is required." },
        { status: 400 },
      );
    }

    if (!workspace_name && !description) {
      return NextResponse.json(
        {
          detail:
            "At least one of workspace_name or description is required for update.",
        },
        { status: 400 },
      );
    }

    const cleanUrl = BACKEND_URL.replace(/\/$/, "");

    const targetUrl = `${cleanUrl}/workspace/${workspaceId}`;

    const payload: { workspace_name?: string; description?: string } = {};
    if (workspace_name) payload.workspace_name = workspace_name;
    if (description) payload.description = description;

    const backendResponse = await fetch(targetUrl, {
      method: "PATCH",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = backendResponse.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      const errorText = await backendResponse.text();

      console.error("Backend returned non-JSON response:", errorText);

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
    console.error("Workspace update proxy fetch error:", error);

    return NextResponse.json(
      { detail: "Unable to reach workspace backend service." },
      { status: 500 },
    );
  }
}
