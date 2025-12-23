import { serverFetch } from "@/lib/serverFetch";
import Trash from "./Trash";

export const metadata = {
  title: "Trash | Filesbox",
  description:
    "View and manage deleted (trashed) files in your Filesbox account.",
  openGraph: {
    title: "Trash Bin | Filesbox",
    description:
      "Browse and restore your deleted files from the Filesbox trash.",
  },
};

export default async function page() {
  const data = await serverFetch("/read/api/v2/file/trash");

  return (
    <>
      <div>
        <Trash data={data} />
      </div>
    </>
  );
}
