import { serverFetch } from "@/lib/serverFetch";
import Activity from "./Activity";

export const metadata = {
  title: "Activity | Filesbox",
  description:
    "View your recent activity, track changes, and review file and folder actions in your Filesbox dashboard.",
  openGraph: {
    title: "Activity | Filesbox",
    description:
      "See your most recent activity and changes in your files and folders on the Filesbox platform.",
  },
};

export default async function page() {
  const data = await serverFetch("/read/api/v2/activity");

  return (
    <>
      <Activity data={data} />
    </>
  );
}
