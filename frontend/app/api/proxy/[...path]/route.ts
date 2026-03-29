import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(request, path);
}

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
  const path = pathSegments.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const destUrl = `https://agentforit-backend.onrender.com/api/${path}${searchParams ? `?${searchParams}` : ""}`;

  // SANITIZATION: Only keep essential headers
  const newHeaders = new Headers();
  const allowedHeaders = ["authorization", "content-type", "accept"];
  for (const [key, value] of request.headers.entries()) {
    if (allowedHeaders.includes(key.toLowerCase())) {
      newHeaders.set(key, value);
    }
  }

  try {
    let body = undefined;
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      body = await request.text();
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 10000); // 10s timeout

    const response = await fetch(destUrl, {
      method: request.method,
      headers: newHeaders,
      body: body,
      cache: 'no-store',
      signal: abortController.signal
    });

    clearTimeout(timeoutId);

    const dataBuffer = await response.text();
    
    // Safety check: if the response is NOT Jason but has the "Internal Server Error" text
    if (dataBuffer.startsWith("Internal Server Error") || !dataBuffer.trim().startsWith("{")) {
        return NextResponse.json({ 
            error: "Backend Error", 
            message: "The backend encountered a network spike. Trying to auto-fix..." 
        }, { status: 500 });
    }
    
    return new NextResponse(dataBuffer, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Proxy connection failed", details: error.message }, { status: 502 });
  }
}
