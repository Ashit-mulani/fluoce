export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { serverFetch } from "@/lib/serverFetch";
import Folder from "./Folder";

export const metadata = {
  title: "Folder's File | Filesbox",
  description:
    "Open a folder to view and manage all files it contains in your Filesbox dashboard.",
  openGraph: {
    title: "Folder's File | Filesbox",
    description:
      "Browse all files and folders contained inside the selected folder on your Filesbox dashboard.",
  },
};

export default async function page({ params }) {
  const { folderId } = await params;

  const data = await serverFetch(`/read/api/v2/file/${folderId}`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });

  return (
    <>
      <Folder data={data} folderId={folderId} />
    </>
  );
}
