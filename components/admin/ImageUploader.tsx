"use client";

import * as React from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Loader2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({
  folder,
  images,
  onChange,
  multiple = true,
  label = "Images",
}: {
  folder: string;
  images: ImageAsset[];
  onChange: (images: ImageAsset[]) => void;
  multiple?: boolean;
  label?: string;
}) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState("");

  const onDrop = React.useCallback(
    async (accepted: File[]) => {
      setError("");
      setUploading(true);
      try {
        const uploaded: ImageAsset[] = [];
        for (const file of accepted) {
          const dataUri = await fileToDataUri(file);
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file: dataUri, folder, resourceType: "image" }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || "Upload failed.");
          uploaded.push(json);
        }
        onChange(multiple ? [...images, ...uploaded] : uploaded);
      } catch (err: any) {
        setError(err.message || "Upload failed.");
      } finally {
        setUploading(false);
      }
    },
    [folder, images, onChange, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    multiple,
  });

  const removeAt = async (index: number) => {
    const img = images[index];
    onChange(images.filter((_, i) => i !== index));
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: img.public_id, resourceType: "image" }),
      });
    } catch {
      // Non-fatal — the image reference is already removed from the form.
    }
  };

  const moveTo = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div>
      <p className="text-xs font-body font-semibold uppercase tracking-wide text-brown-700 mb-2">{label}</p>

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-brown-800 bg-brown-200/30" : "border-brown-300 hover:border-brown-500"
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-brown-700">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="font-body text-sm">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-brown-500">
            <UploadCloud className="h-7 w-7" />
            <p className="font-body text-sm">Drag &amp; drop images here, or click to browse</p>
            <p className="font-body text-xs text-warm-grey">JPG, PNG, WEBP</p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive font-body mt-2">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {images.map((img, i) => (
            <div key={img.public_id} className="relative group aspect-square bg-brown-100 border border-brown-200">
              <Image src={img.secure_url} alt={`Upload ${i + 1}`} fill sizes="150px" className="object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 bg-brown-800 text-cream text-[9px] px-1.5 py-0.5 font-body">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 h-6 w-6 rounded-full bg-brown-950/70 text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus-ring"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {multiple && images.length > 1 && (
                <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pb-1">
                  <button
                    type="button"
                    onClick={() => moveTo(i, i - 1)}
                    className="h-5 w-5 rounded-full bg-cream/90 text-brown-900 text-[10px] flex items-center justify-center"
                    aria-label="Move left"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTo(i, i + 1)}
                    className="h-5 w-5 rounded-full bg-cream/90 text-brown-900 text-[10px] flex items-center justify-center"
                    aria-label="Move right"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
