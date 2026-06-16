"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Item = {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string | null;
};

type Props = {
  items: Item[];
};

export function GalleryLightbox({ items }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);

  const prev = useCallback(() => {
    setIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  }, [items.length]);

  const next = useCallback(() => {
    setIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length]);

  useEffect(() => {
    if (index === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape")     close();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, close, prev, next]);

  const current = index !== null ? items[index] : null;

  return (
    <>
      {/* Photo grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="break-inside-avoid rounded-xl overflow-hidden shadow-sm group cursor-pointer"
            onClick={() => setIndex(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.thumbnailUrl ?? item.url}
              alt={item.title}
              className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {item.title && (
              <div className="bg-white px-3 py-2 flex items-center justify-between">
                <p className="text-xs font-medium text-gray-700 truncate">{item.title}</p>
                <span className="text-xs text-gray-400 shrink-0 ml-2">View</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={close}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          {items.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Image */}
          <div className="max-w-5xl w-full mx-16 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.title}
              className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
            {current.title && (
              <p className="text-white/80 text-sm mt-4 text-center">{current.title}</p>
            )}
            {items.length > 1 && (
              <p className="text-white/40 text-xs mt-1">
                {(index ?? 0) + 1} / {items.length}
              </p>
            )}
          </div>

          {/* Next */}
          {items.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
