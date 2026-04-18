import { type NextRequest, NextResponse } from "next/server";

const CIRCLE_BASE = "https://api.circle.com";

function getServerKitKey() {
  const candidates = [
    process.env.CIRCLE_API_KEY,
    process.env.NEXT_PUBLIC_KIT_KEY,
  ];

  for (const candidate of candidates) {
    const normalized = candidate?.trim();
    if (normalized?.startsWith("KIT_KEY:")) {
      return normalized;
    }
  }

  return "";
}

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

  const forwardHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const authHeader = request.headers.get("authorization")?.trim();
  const serverKitKey = getServerKitKey();

  request.headers.forEach((value, key) => {
    if (
      key.startsWith("x-") &&
      !["x-forwarded-for", "x-real-ip", "x-api-key"].includes(key)
    ) {
      forwardHeaders[key] = value;
    }
  });

  if (serverKitKey) {
    forwardHeaders["Authorization"] = `Bearer ${serverKitKey}`;
  } else if (authHeader) {
    forwardHeaders["Authorization"] = authHeader;
  }

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

export const GET = handler;
export const POST = handler;
export const HEAD = handler;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "GET, POST, HEAD, OPTIONS",
      "Cache-Control": "no-store",
    },
  });
}
