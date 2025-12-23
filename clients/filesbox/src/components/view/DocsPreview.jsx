"use client";

import { Button } from "../ui/button";
import NoPreview from "./NoPreview";

export default function DocsPreview({ url, mimeType, fileName }) {
  const ext = url.split(".").pop().toLowerCase();

  // 1. PDF preview (best)
  if (ext === "pdf" || mimeType === "application/pdf") {
    return (
      <iframe src={url} className="w-full h-full" style={{ border: "none" }} />
    );
  }

  // 2. Google Docs Viewer for Office files
  const googleSupported = [
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "pages",
    "key",
    "numbers",
    "odt",
    "ods",
    "odp",
  ];

  if (googleSupported.includes(ext)) {
    return (
      <iframe
        src={`https://docs.google.com/gview?url=${url}&embedded=true`}
        className="w-full h-full"
        style={{ border: "none" }}
      />
    );
  }

  // 3. EPUB viewer
  if (ext === "epub") {
    return (
      <iframe
        src={`https://epub-viewer.vercel.app/?url=${encodeURIComponent(url)}`}
        className="w-full h-full"
        style={{ border: "none" }}
      />
    );
  }

  // 4. Fallback
  return <NoPreview url={url} fileName={fileName} />;
}
