import { uploadingStateEmitter } from "@/lib/UploadToR2";
import { useEffect, useState } from "react";

export function useUploadingState() {
  const [isUploading, setUploading] = useState(
    uploadingStateEmitter.isUploading
  );

  useEffect(() => {
    const sub = uploadingStateEmitter.subscribe((val) => {
      setUploading(val);
    });

    return sub;
  }, []);

  return isUploading;
}
