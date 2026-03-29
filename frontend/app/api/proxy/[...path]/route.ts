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

  const headers = new Headers(request.headers);
  headers.delete("host"); 

  try {
    let body = undefined;
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      body = await request.text();
    }

    const response = await fetch(destUrl, {
      method: request.method,
      headers: headers,
      body: body,
      cache: 'no-store'
    });

    const data = await response.text();
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Proxy connection failed", details: error.message }, { status: 502 });
  }
}
