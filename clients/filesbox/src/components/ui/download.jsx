"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { handleDownload } from "@/utils/handleDownload";

export default function DownloadButton({
  className,
  url,
  fileName,
  full = true,
}) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      className={className}
      variant="outline"
      size={full ? "" : "icon-sm"}
      onClick={() => handleDownload(url, fileName, setLoading)}
      disabled={!url || loading}
    >
      {loading ? <Spinner /> : <HiOutlineDownload className="h-5 w-5" />}
      {full ? " Download" : ""}
    </Button>
  );
}
