export const metadata = {
  title: "Preview - FilesBox",
  description:
    "Preview your files online with FilesBox, a secure and modern cloud storage solution.",
};

export default function Layout({ children }) {
  return (
    <>
      <main className="max-w-[1600px] mx-auto w-full">{children}</main>
    </>
  );
}
