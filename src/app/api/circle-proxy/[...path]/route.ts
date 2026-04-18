import { type NextRequest, NextResponse } from "next/server";

const CIRCLE_BASE = "https://api.circle.com";

/**
 * Proxies browser requests to api.circle.com/v1/stablecoinKits/* server-side,
 * bypassing the browser's CORS restriction on that endpoint.
 */
async function handler(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");
  const allowedPathPrefix = "v1/stablecoinKits/";

  if (!path.startsWith(allowedPathPrefix)) {
    return NextResponse.json(
      { error: "Proxy path not allowed" },
      { status: 403 }
    );
  }

  if (!["GET", "POST", "HEAD"].includes(request.method)) {
    return NextResponse.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();
  const targetUrl = `${CIRCLE_BASE}/${path}${qs ? `?${qs}` : ""}`;

  // Forward relevant headers (Authorization, Content-Type, kit key header, etc.)
  const forwardHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const authHeader = request.headers.get("authorization");
  if (authHeader) forwardHeaders["Authorization"] = authHeader;

  const xApiKey = request.headers.get("x-api-key");
  if (xApiKey) forwardHeaders["x-api-key"] = xApiKey;

  // Copy any x-* headers the SDK might send
  request.headers.forEach((value, key) => {
    if (key.startsWith("x-") && !["x-forwarded-for", "x-real-ip"].includes(key)) {
      forwardHeaders[key] = value;
    }
  });

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.text(),
    });

    const body = await upstream.text();

    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Proxy request failed", detail: String(err) },
      { status: 502 }
    );
  }
}

export const GET    = handler;
export const POST   = handler;
export const HEAD   = handler;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Allow": "GET, POST, HEAD, OPTIONS",
      "Cache-Control": "no-store",
    },
  });
}
