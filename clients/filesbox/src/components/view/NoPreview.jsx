import React from "react";
import DownloadButton from "@/components/ui/download";
const NoPreview = ({ url, fileName }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 h-full text-center p-4">
        <img
          src="/cloud.svg"
          alt="No Preview Available"
          className="h-60 w-60 opacity-70"
          draggable={false}
        />
        <p className="text-zinc-500 text-sm">
          Preview not available — Download to view this file.
        </p>

        <DownloadButton url={url} fileName={fileName} />
      </div>
    </>
  );
};

export default NoPreview;
