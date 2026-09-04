import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { uploadToS3, generateUploadKey } from "@/lib/s3";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const key = generateUploadKey(folder, file.name);
    const url = await uploadToS3(file, key, file.type);

    return NextResponse.json({ success: true, url, key });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
