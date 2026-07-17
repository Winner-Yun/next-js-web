import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

async function proxyRequest(
  request: Request,
  workspaceId: string,
  method: "GET" | "POST",
) {
  const authHeader = request.headers.get("authorization");

  const url = new URL(request.url);
  const targetUrl = `${BACKEND_URL}/workspaces/${workspaceId}/alerts${
    method === "GET" && url.search ? `?${url.searchParams.toString()}` : ""
  }`;

  const options: RequestInit = {
    method,
    headers: {
      ...(authHeader && { Authorization: authHeader }),
    },
  };

  if (method === "POST") {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };

    options.body = JSON.stringify(await request.json());
  }

  const response = await fetch(targetUrl, options);
  const data = await response.json().catch(() => null);

  return NextResponse.json(data || { detail: "Success" }, {
    status: response.status,
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: workspaceId } = await params;
    if (!workspaceId) {
      return NextResponse.json(
        { detail: "Workspace ID is required." },
        { status: 400 },
      );
    }

    return proxyRequest(request, workspaceId, "GET");
  } catch {
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: workspaceId } = await params;
    if (!workspaceId) {
      return NextResponse.json(
        { detail: "Workspace ID is required." },
        { status: 400 },
      );
    }

    return proxyRequest(request, workspaceId, "POST");
  } catch {
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 },
    );
  }
}
