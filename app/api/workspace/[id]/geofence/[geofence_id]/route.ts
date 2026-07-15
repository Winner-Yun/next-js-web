/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

/**
 * Unified request processor to eliminate code replication across HTTP verbs
 */
async function processGeofenceProxy(
  method: "PATCH" | "DELETE",
  request: Request,
  params: Promise<{ id: string; geofence_id: string }>,
) {
  try {
    const resolvedParams = await params;
    const workspaceId = resolvedParams?.id;
    const geofenceId = resolvedParams?.geofence_id;

    if (!workspaceId || !geofenceId) {
      return NextResponse.json(
        { detail: "Workspace ID and Geofence ID are required." },
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
    const targetUrl = `${cleanUrl}/workspace/${workspaceId}/geofence/${geofenceId}`;

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
      return NextResponse.json(
        { detail: "Backend service returned an invalid response format." },
        { status: 502 },
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    return NextResponse.json(
      {
        detail: `Internal server error handling geofence ${method.toLowerCase()} request.`,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; geofence_id: string }> },
) {
  return processGeofenceProxy("PATCH", request, params);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; geofence_id: string }> },
) {
  return processGeofenceProxy("DELETE", request, params);
}
