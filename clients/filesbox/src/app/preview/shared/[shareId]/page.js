import BackButton from "@/components/view/dashboard/Usage/BackButton";
import { FilePreview } from "@/components/view/FilePreview";
import { serverFetch } from "@/lib/serverFetch";

export default async function page({ params, searchParams }) {
  const { shareId } = await params;

  const { ref } = await searchParams;

  let metaData;

  if (!metaData && shareId) {
    const data = await serverFetch(`/read/api/v2/share/previewUrl/${shareId}`);
    metaData = data?.data;
  }

  if (!metaData) {
    return null;
  }

  return (
    <>
      <div className="h-screen w-full">
        <div className="flex items-center gap-2 p-2 w-full fixed top-0 z-20">
          {ref === "internal" && <BackButton />}
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
