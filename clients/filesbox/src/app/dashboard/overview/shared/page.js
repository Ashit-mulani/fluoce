import { serverFetch } from "@/lib/serverFetch";
import Shared from "./Shared";

export const metadata = {
  title: "Shared Files | Filesbox",
  description:
    "View all files that are shared with others or with you in your Filesbox dashboard.",
  openGraph: {
    title: "Shared Files | Filesbox",
    description:
      "Browse and manage all shared files in your Filesbox dashboard.",
  },
};

export default async function page() {
  const data = await serverFetch("/read/api/v2/share");

  return (
    <>
      <Shared data={data} />
    </>
  );
}
