import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; alert_id: string }> },
) {
  try {
    const { id: workspaceId, alert_id: alertId } = await params;
    const authHeader = request.headers.get("authorization");

    const targetUrl = `${BACKEND_URL}/workspaces/${workspaceId}/alerts/${alertId}/read`;

    const response = await fetch(targetUrl, {
      method: "PATCH",
      headers: { ...(authHeader && { Authorization: authHeader }) },
    });

    const data = await response.json().catch(() => null);
    return NextResponse.json(data || { detail: "Success" }, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 },
    );
  }
}
