// Proxy /auth/me/profile-image to backend
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const runtime = "nodejs";

async function proxyProfileImage(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { detail: "Authorization token is required." },
      { status: 401 },
    );
  }

  try {
    // Parse the incoming multipart/form-data. Reading with `request.text()`
    // would corrupt the binary image bytes, which is why the backend was
    // returning 422.
    const incomingForm = await request.formData();

    // Re-build a clean FormData for the backend request. We clone the entries
    // so the File objects are re-serialized correctly across the fetch call.
    const outboundForm = new FormData();
    for (const [key, value] of incomingForm.entries()) {
      outboundForm.append(key, value);
    }

    const backendResponse = await fetch(
      `${BACKEND_URL.replace(/\/$/, "")}/auth/me/profile-image`,
      {
        method: "PATCH",
        headers: {
          Authorization: authHeader,
          // IMPORTANT: do NOT set Content-Type here. Passing a FormData body
          // makes `fetch` automatically set `multipart/form-data; boundary=…`.
          // Setting it manually would either override the boundary (breaking
          // the upload) or be missing the boundary, both causing 422.
        },
        body: outboundForm,
      },
    );

    const text = await backendResponse.text();
    return new NextResponse(text, {
      status: backendResponse.status,
      headers: {
        "Content-Type":
          backendResponse.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error(`Proxy auth/me/profile-image PATCH fetch error:`, error);
    return NextResponse.json(
      { detail: "Unable to connect to the authentication service." },
      { status: 502 },
    );
  }
}

export async function PATCH(request: Request) {
  return proxyProfileImage(request);
}
