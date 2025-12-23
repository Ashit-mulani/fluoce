"use client";

import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import DownloadButton from "@/components/ui/download";

export default function FontPreview({ url, mimeType, fileName }) {
  const [loaded, setLoaded] = useState(false);
  const [fontName, setFontName] = useState("PreviewFont");

  useEffect(() => {
    const loadFont = async () => {
      try {
        const font = new FontFace(fontName, `url(${url})`);
        await font.load();
        document.fonts.add(font);
        setLoaded(true);
      } catch (e) {
        console.error("Font load failed:", e);
      }
    };

    loadFont();
  }, [url, fontName]);

  return (
    <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center gap-6">
      {!loaded ? (
        <div className="text-zinc-500 flex gap-2 items-center">
          <Spinner /> Loading font preview . . . .
        </div>
      ) : (
        <div
          className="text-2xl border border-white/20 p-4 rounded-lg w-full max-w-xl"
          style={{ fontFamily: fontName }}
        >
          The quick brown fox jumps over the lazy dog.
        </div>
      )}

      <DownloadButton url={url} fileName={fileName} />
    </div>
  );
}
