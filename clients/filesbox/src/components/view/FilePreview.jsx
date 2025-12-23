"use client";

import { getFileTypeKeyFromMimetype } from "@/utils/fileType";
import { CodePreview } from "./CodePreview";
import AudioPlayer from "./AudioPlayer";
import DocsPreview from "./DocsPreview";
import FontPreview from "./FontPreview";
import NoPreview from "./NoPreview";
import Image from "next/image";

export function FilePreview({ mimeType, url, fileName }) {
  const fileType = getFileTypeKeyFromMimetype(mimeType);

  switch (fileType) {
    case "code":
      return <CodePreview url={url} mimeType={mimeType} fileName={fileName} />;

    case "image":
      return (
        <div className="relative w-full h-full">
          <Image
            src={url}
            alt={mimeType}
            fill
            className="object-contain"
            sizes="100vw"
          />
        </div>
      );
    case "video":
      return (
        <div className="w-full h-full flex items-center justify-center p-2 bg-black">
          <video
            src={url}
            controls
            autoPlay
            playsInline
            preload="auto"
            muted
            className="w-full h-full object-contain rounded-md"
          />
        </div>
      );

    case "audio":
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <AudioPlayer url={url} />
        </div>
      );

    case "docsEbooks":
      return <DocsPreview url={url} mimeType={mimeType} fileName={fileName} />;

    case "fonts":
      return <FontPreview url={url} mimeType={mimeType} fileName={fileName} />;

    default:
      return <NoPreview url={url} fileName={fileName} />;
  }
}
