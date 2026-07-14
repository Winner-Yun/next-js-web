import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://smart-atd-backend.vercel.app";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization token is required." },
        { status: 401 },
      );
    }

    // Extract the 'search' query parameter from the incoming request URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const cleanUrl = BACKEND_URL.replace(/\/$/, "");
    let targetUrl = `${cleanUrl}/auth/users`;

    // Forward the search query parameter if it exists
    if (search) {
      targetUrl += `?search=${encodeURIComponent(search)}`;
    }

    // Perform proxy GET request to the backend service
    const backendResponse = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    const contentType = backendResponse.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const errorText = await backendResponse.text();
      console.error("Backend returned non-JSON response:", errorText);
      return NextResponse.json(
        { detail: "Backend service returned an invalid response format." },
        { status: 502 },
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Proxy get users error:", error);
    return NextResponse.json(
      { detail: "Internal server error handling users proxy request." },
      { status: 500 },
    );
  }
}
