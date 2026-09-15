import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type CloudinaryImage = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
};

export type CloudinaryVideo = {
  public_id: string;
  secure_url: string;
  resource_type: string;
  duration?: number;
};

const FOLDERS = {
  logo: "aldata/logo",
  hero: "aldata/hero",
  projects: "aldata/projects",
  services: "aldata/services",
  videos: "aldata/videos",
  site: "aldata/site",
} as const;

export type CloudinaryFolder = keyof typeof FOLDERS;

/**
 * Uploads a base64 data-URI (or remote URL) to Cloudinary in the given
 * ALDATA folder. Used from server-only route handlers / server actions —
 * never call this from client code, since it requires CLOUDINARY_API_SECRET.
 */
export async function uploadToCloudinary(
  fileDataUri: string,
  folder: CloudinaryFolder,
  resourceType: "image" | "video" = "image"
): Promise<CloudinaryImage | CloudinaryVideo> {
  const result = await cloudinary.uploader.upload(fileDataUri, {
    folder: FOLDERS[folder],
    resource_type: resourceType,
    overwrite: false,
     timeout: 150000,
  });

  if (resourceType === "video") {
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      resource_type: result.resource_type,
      duration: result.duration,
    };
  }

  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    width: result.width,
    height: result.height,
  };
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" = "image"
) {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    // Log but don't block the DB delete on a failed Cloudinary cleanup —
    // we still don't want to intentionally leave the app in a broken state.
    console.error("Cloudinary delete failed for", publicId, err);
  }
}

export default cloudinary;
