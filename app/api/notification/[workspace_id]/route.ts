import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

async function proxyNotification(
  request: Request,
  params: Promise<{ workspace_id: string }>,
  method: "GET" | "POST",
) {
  try {
    const { workspace_id } = await params;

    if (!workspace_id) {
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

    const targetUrl = `${BACKEND_URL.replace(/\/$/, "")}/notification/${workspace_id}`;

    const backendResponse = await fetch(targetUrl, {
      method,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      // Only attach body if it's a POST request
      ...(method === "POST" && {
        body: await request.text(),
      }),
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
    console.error(`Proxy ${method} notification error:`, error);

    return NextResponse.json(
      { detail: "Internal server error handling request." },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ workspace_id: string }> },
) {
  return proxyNotification(request, params, "GET");
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workspace_id: string }> },
) {
  return proxyNotification(request, params, "POST");
}
