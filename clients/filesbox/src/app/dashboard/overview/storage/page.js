import { serverFetch } from "@/lib/serverFetch";
import Storage from "./Storage";

export const metadata = {
  title: "Storage | Filesbox",
  description:
    "View and monitor your Filesbox storage usage. See your storage limits and how much space you have left in your account.",
  openGraph: {
    title: "Storage Usage | Filesbox",
    description:
      "Track your storage usage and available space in your Filesbox dashboard.",
  },
};

export default async function page() {
  const data = await serverFetch("/read/api/v2/storage");

  return (
    <>
      <Storage data={data} />
    </>
  );
}
