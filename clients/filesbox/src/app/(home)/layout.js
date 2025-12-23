import Hero from "@/components/view/home/hero/Hero";
import HomeTopbar from "@/components/view/home/navigation/HomeTopbar";

export const metadata = {
  title: "FilesBox",
  description:
    "FilesBox is a modern cloud storage application to easily upload, manage, and securely access your files from anywhere.",
};

export default function RootLayout({ children }) {
  return (
    <>
      <main className="max-w-[1600px] mx-auto w-full">
        <HomeTopbar />
        <Hero />
        {children}
      </main>
    </>
  );
}
