import DownloadButton from "@/components/ui/download";
import { FilePreview } from "@/components/view/FilePreview";
import { serverFetch } from "@/lib/serverFetch";

export default async function page({ params }) {
  const { folderId, fileId } = await params;

  let metaData;

  if (!metaData) {
    const data = await serverFetch(
      `/read/api/v2/file/previewUrl/${folderId}/${fileId}`
    );
    metaData = data?.data;
  }

  return (
    <>
      <div className="h-screen w-full">
        <div className="flex items-center gap-2 p-2 w-full fixed top-0 z-20">
          <DownloadButton
            url={metaData?.previewUrl}
            fileName={metaData?.fileName}
            full={false}
          />
          <span className="text-sm line-clamp-1 truncate">
            {metaData?.fileName || "untitled File"}
          </span>
        </div>
        <div className="pt-[42px] h-[calc(100vh-1px)]">
          <FilePreview
            url={metaData?.previewUrl}
            fileName={metaData?.fileName}
            mimeType={metaData?.mimeType}
          />
        </div>
      </div>
    </>
  );
}
