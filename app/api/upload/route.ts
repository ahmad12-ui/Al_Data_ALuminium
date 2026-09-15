import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, deleteFromCloudinary, type CloudinaryFolder } from "@/lib/cloudinary";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

function approxBase64Bytes(dataUri: string) {
  const base64 = dataUri.split(",")[1] || "";
  return Math.ceil((base64.length * 3) / 4);
}

export async function POST(req: NextRequest) {
  try {
    const { file, folder, resourceType } = (await req.json()) as {
      file: string;
      folder: CloudinaryFolder;
      resourceType?: "image" | "video";
    };

    if (!file || !folder) {
      return NextResponse.json({ error: "Missing file or folder." }, { status: 400 });
    }

    const type = resourceType === "video" ? "video" : "image";
    //  PASTE THIS INSTEAD
let mime: string | undefined;
if (file.startsWith("data:")) {
  const parts = file.split(";base64,");
  if (parts.length > 0) {
    mime = parts[0].substring(5); // Strips away "data:" (5 characters)
  }
}


    if (type === "image" && (!mime || !ALLOWED_IMAGE_TYPES.includes(mime))) {
      return NextResponse.json({ error: "Only JPG, PNG, and WEBP images are allowed." }, { status: 400 });
    }
    if (type === "video" && (!mime || !ALLOWED_VIDEO_TYPES.includes(mime))) {
      return NextResponse.json({ error: "Only MP4, WEBM, and MOV videos are allowed." }, { status: 400 });
    }

    const size = approxBase64Bytes(file);
    const maxSize = type === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (size > maxSize) {
      return NextResponse.json(
        { error: `File is too large. Max ${Math.round(maxSize / 1024 / 1024)}MB.` },
        { status: 400 }
      );
    }

    const result = await uploadToCloudinary(file, folder, type);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { publicId, resourceType } = await req.json();
    if (!publicId) return NextResponse.json({ error: "Missing publicId." }, { status: 400 });
    await deleteFromCloudinary(publicId, resourceType === "video" ? "video" : "image");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
