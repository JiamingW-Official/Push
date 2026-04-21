// TODO: wire to Supabase Storage or Persona SDK document upload
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Stub: accept multipart file upload
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
  const file = formData.get("file");
  const docType = formData.get("docType") ?? "unknown";

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    fileId: `mock-${Date.now()}`,
    fileName: file.name,
    docType,
    uploadedAt: new Date().toISOString(),
  });
}
