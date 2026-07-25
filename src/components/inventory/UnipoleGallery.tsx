"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import type { Unipole } from "@/types/unipole";

interface UnipoleGalleryProps {
  unipole: Unipole;
}

function buildImageList(unipole: Unipole): string[] {
  return Array.from(new Set([unipole.dayImage, unipole.nightImage, ...unipole.images].filter(Boolean)));
}

/**
 * No real photography exists yet (every current record is `isPlaceholderData: true`), so this
 * always renders the labelled fallback for now — the interactive Next/Image gallery below is
 * fully implemented and activates automatically once real images are supplied.
 */
export function UnipoleGallery({ unipole }: UnipoleGalleryProps) {
  const images = buildImageList(unipole);
  const [index, setIndex] = useState(0);

  if (unipole.isPlaceholderData || images.length === 0) {
    return (
      <div className="flex aspect-4/3 w-full flex-col items-center justify-center gap-2 bg-brand-soft text-brand-muted lg:aspect-auto lg:h-full">
        <ImageOff size={32} strokeWidth={1.5} aria-hidden />
        <span className="text-sm">Photography coming soon</span>
      </div>
    );
  }

  const current = images[index];
  const hasMultiple = images.length > 1;

  return (
    <div className="relative aspect-4/3 w-full bg-brand-soft lg:aspect-auto lg:h-full">
      <Image
        key={current}
        src={current}
        alt={`${unipole.title} — image ${index + 1} of ${images.length}`}
        fill
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="object-cover"
        priority={index === 0}
      />

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={() => setIndex((current) => (current - 1 + images.length) % images.length)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-white/90 text-brand-black"
          >
            <ChevronLeft size={18} strokeWidth={1.75} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setIndex((current) => (current + 1) % images.length)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-white/90 text-brand-black"
          >
            <ChevronRight size={18} strokeWidth={1.75} aria-hidden />
          </button>
          <span className="absolute bottom-3 right-3 rounded-full bg-brand-black/60 px-2.5 py-1 text-xs font-medium text-brand-white">
            {index + 1} / {images.length}
          </span>
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {images.map((image, imageIndex) => (
              <button
                key={image}
                type="button"
                onClick={() => setIndex(imageIndex)}
                aria-label={`Go to image ${imageIndex + 1}`}
                aria-current={imageIndex === index}
                className={`h-1.5 w-1.5 rounded-full ${imageIndex === index ? "bg-brand-white" : "bg-brand-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
