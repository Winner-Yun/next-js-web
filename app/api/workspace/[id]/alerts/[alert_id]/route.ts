import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; alert_id: string }> },
) {
  try {
    const { id: workspaceId, alert_id: alertId } = await params;
    const authHeader = request.headers.get("authorization");

    const targetUrl = `${BACKEND_URL}/workspaces/${workspaceId}/alerts/${alertId}`;

    const response = await fetch(targetUrl, {
      method: "DELETE",
      headers: { ...(authHeader && { Authorization: authHeader }) },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => null);
    return NextResponse.json(data || { detail: "Deleted" }, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 },
    );
  }
}
