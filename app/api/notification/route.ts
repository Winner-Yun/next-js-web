import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://smart-atd-backend.vercel.app";

async function proxyNotification(
  request: Request,
  method: "GET" | "POST",
) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization token is required." },
        { status: 401 },
      );
    }

    const workspaceId = request.headers.get("workspace-id");

    if (!workspaceId) {
      return NextResponse.json(
        { detail: "Workspace ID header is required." },
        { status: 400 },
      );
    }

    const cleanUrl = BACKEND_URL.replace(/\/$/, "");
    const { searchParams } = new URL(request.url);

    const targetUrl =
      method === "GET"
        ? `${cleanUrl}/notification/${searchParams.toString() ? `?${searchParams}` : ""}`
        : `${cleanUrl}/notification/`;

    let body: string | undefined;

    if (method === "POST") {
      const payload = await request.json();

      if (
        !payload ||
        !payload.title ||
        !payload.message ||
        !payload.type ||
        !payload.target
      ) {
        return NextResponse.json(
          {
            detail:
              "Missing required fields: title, message, type, or target.",
          },
          { status: 400 },
        );
      }

      body = JSON.stringify(payload);
    }

    const backendResponse = await fetch(targetUrl, {
      method,
      headers: {
        Authorization: authHeader,
        "workspace-id": workspaceId,
        "Content-Type": "application/json",
      },
      ...(body && { body }),
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
      {
        detail:
          "Internal server error handling notification proxy request.",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  return proxyNotification(request, "GET");
}

export async function POST(request: Request) {
  return proxyNotification(request, "POST");
}