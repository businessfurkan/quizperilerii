import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { storageProvider } from "@/lib/storage";

function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false;
  
  const hex = buffer.toString("hex", 0, 4).toUpperCase();
  
  switch (mimeType) {
    case "image/jpeg":
      return hex.startsWith("FFD8FF");
    case "image/png":
      return hex === "89504E47";
    case "image/gif":
      return hex === "47494638";
    case "image/webp":
      // WebP starts with RIFF (52 49 46 46) ... WEBP (57 45 42 50) at offset 8
      if (buffer.length < 12) return false;
      const riff = buffer.toString("hex", 0, 4).toUpperCase();
      const webp = buffer.toString("hex", 8, 12).toUpperCase();
      return riff === "52494646" && webp === "57454250";
    default:
      return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Auth Check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const uploadedFiles = [];
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

    for (const file of files) {
      // 2. File Type Validation
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 });
      }

      const ext = path.extname(file.name).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        return NextResponse.json({ error: `Invalid file extension: ${ext}` }, { status: 400 });
      }

      // 3. Magic Bytes Check (Optional but recommended)
      // We read the file as an ArrayBuffer to check magic bytes
      const buffer = Buffer.from(await file.arrayBuffer());
      if (!validateMagicBytes(buffer, file.type)) {
         return NextResponse.json({ error: `File content does not match extension/type: ${file.name}` }, { status: 400 });
      }
      
      try {
        const result = await storageProvider.uploadFile(file);
        uploadedFiles.push(result);
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
        return NextResponse.json({ error: `Failed to upload ${file.name}` }, { status: 500 });
      }
    }

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
