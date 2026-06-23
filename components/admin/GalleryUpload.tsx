"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { uploadImage } from "@/lib/supabase/storage";
import { cn } from "@/lib/admin/utils";

type GalleryUploadProps = {
  label?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  hint?: string;
};

export default function GalleryUpload({
  label = "Images",
  value,
  onChange,
  folder = "general",
  hint,
}: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");

  const addUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) {
      setError("This image is already in the gallery");
      return;
    }
    setError("");
    onChange([...value, trimmed]);
    setUrlInput("");
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange([...value, url]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = [...value];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    const next = [...value];
    const [img] = next.splice(index, 1);
    onChange([img, ...next]);
  };

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-medium text-dark-700">{label}</p>}

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative overflow-hidden rounded-xl border border-dark-200 bg-white"
            >
              <div className="relative h-28 w-full">
                <Image src={url} alt={`Property image ${index + 1}`} fill className="object-cover" unoptimized />
              </div>
              {index === 0 && (
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  <Star size={10} /> Cover
                </span>
              )}
              <div className="flex items-center justify-between gap-1 border-t border-dark-100 p-1.5">
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded p-1 text-dark-500 hover:bg-dark-100 disabled:opacity-30"
                    aria-label="Move left"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === value.length - 1}
                    className="rounded p-1 text-dark-500 hover:bg-dark-100 disabled:opacity-30"
                    aria-label="Move right"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
                <div className="flex gap-1">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => setAsCover(index)}
                      className="rounded px-1.5 py-0.5 text-[10px] font-medium text-primary-700 hover:bg-primary-50"
                    >
                      Set cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="rounded p-1 text-red-500 hover:bg-red-50"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-dark-200 bg-dark-50/50 py-6 transition hover:border-primary-400 hover:bg-primary-50/30",
          uploading && "opacity-60"
        )}
      >
        {uploading ? (
          <Loader2 size={22} className="animate-spin text-primary-600" />
        ) : (
          <Upload size={22} className="text-primary-600" />
        )}
        <span className="text-sm font-medium text-dark-600">
          {uploading ? "Uploading..." : "Upload image from device"}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl(urlInput);
            }
          }}
          placeholder="Or paste image URL and add..."
          className="min-w-0 flex-1 rounded-xl border border-dark-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
        />
        <button
          type="button"
          onClick={() => addUrl(urlInput)}
          className="shrink-0 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Add
        </button>
      </div>

      {hint && !error && <p className="text-xs text-dark-400">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
