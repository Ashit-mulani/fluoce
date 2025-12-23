import CBtn from "@/components/ui/CBtn";
import Upgrade from "./Upgrade";
import { serverFetch } from "@/lib/serverFetch";

export const metadata = {
  title: "Upgrade Plan | Filesbox",
  description:
    "Upgrade your Filesbox plan to unlock more features and storage.",
  openGraph: {
    title: "Upgrade Your Plan | Filesbox",
    description:
      "Compare and upgrade your Filesbox plan for access to more storage and premium features.",
  },
};

export default async function page() {
  const data = await serverFetch("/read/api/v2/storage");

  return (
    <>
      <Upgrade data={data} />
    </>
  );
}
