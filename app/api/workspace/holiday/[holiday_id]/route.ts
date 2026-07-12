import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

async function proxyHoliday(
  request: Request,
  params: Promise<{ holiday_id: string }>,
  method: "PATCH" | "DELETE",
) {
  try {
    const { holiday_id } = await params;

    if (!holiday_id) {
      return NextResponse.json(
        { detail: "Holiday ID is required." },
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

    const targetUrl = `${BACKEND_URL.replace(/\/$/, "")}/workspace/holiday/${holiday_id}`;

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
    console.error(`Proxy ${method} holiday error:`, error);

    return NextResponse.json(
      { detail: "Internal server error handling request." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ holiday_id: string }> },
) {
  return proxyHoliday(request, params, "PATCH");
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ holiday_id: string }> },
) {
  return proxyHoliday(request, params, "DELETE");
}
