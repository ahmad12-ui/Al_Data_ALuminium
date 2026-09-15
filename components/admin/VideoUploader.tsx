"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Loader2, X, Video as VideoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoAsset } from "@/types";

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function VideoUploader({
  value,
  onChange,
}: {
  value: VideoAsset | undefined;
  onChange: (video: VideoAsset | undefined) => void;
}) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState("");

  const onDrop = React.useCallback(async (accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const dataUri = await fileToDataUri(file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: dataUri, folder: "videos", resourceType: "video" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed.");
      onChange(json);
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/mp4": [], "video/webm": [], "video/quicktime": [] },
    multiple: false,
  });

  return (
    <div>
      <p className="text-xs font-body font-semibold uppercase tracking-wide text-brown-700 mb-2">Video File</p>

      {value ? (
        <div className="relative border border-brown-200 p-4 flex items-center gap-3">
          <VideoIcon className="h-6 w-6 text-brown-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-body text-sm text-brown-900 truncate">{value.public_id.split("/").pop()}</p>
            {value.duration && (
              <p className="font-body text-xs text-warm-grey">{Math.round(value.duration)}s</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="h-7 w-7 rounded-full bg-brown-100 flex items-center justify-center focus-ring"
            aria-label="Remove video"
          >
            <X className="h-4 w-4 text-brown-700" />
          </button>
        </div>
      ) : (
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
              <p className="font-body text-sm">Uploading video...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-brown-500">
              <UploadCloud className="h-7 w-7" />
              <p className="font-body text-sm">Drag &amp; drop a video here, or click to browse</p>
              <p className="font-body text-xs text-warm-grey">MP4, WEBM, MOV</p>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-xs text-destructive font-body mt-2">{error}</p>}
    </div>
  );
}
