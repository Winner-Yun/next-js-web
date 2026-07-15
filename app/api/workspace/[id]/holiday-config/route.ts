/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

async function proxyHolidayConfig(
  request: Request,
  params: Promise<{ id: string }>,
  method: "GET" | "PATCH",
) {
  try {
    const { id: workspace_id } = await params;

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

    const targetUrl = `${BACKEND_URL.replace(/\/$/, "")}/workspace/${workspace_id}/holiday-config`;

    const backendResponse = await fetch(targetUrl, {
      method,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      ...(method === "PATCH" && {
        body: await request.text(),
      }),
    });

    const contentType = backendResponse.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
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
    return NextResponse.json(
      { detail: "Internal server error handling request." },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return proxyHolidayConfig(request, params, "GET");
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return proxyHolidayConfig(request, params, "PATCH");
}
