import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

async function proxyRequest(
  method: "PATCH" | "DELETE",
  request: Request,
  params: Promise<{ id: string; policy_id: string }>,
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
        { detail: "Authorization token is required." },
        { status: 401 },
      );
    }

    let body = null;
    if (method === "PATCH") {
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { detail: "Invalid JSON request body." },
          { status: 400 },
        );
      }
    }

    const cleanUrl = BACKEND_URL.replace(/\/$/, "");
    const targetUrl = `${cleanUrl}/workspace/${workspaceId}/policy/${policyId}`;

    const backendResponse = await fetch(targetUrl, {
      method,
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
        `Backend returned non-JSON response for policy ${method}:`,
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
    console.error(`Proxy policy ${method} process error:`, error);
    return NextResponse.json(
      {
        detail: `Internal server error handling policy ${method.toLowerCase()} request.`,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; policy_id: string }> },
) {
  return proxyRequest("PATCH", request, params);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; policy_id: string }> },
) {
  return proxyRequest("DELETE", request, params);
}
