import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/provider/query-provider";
import { Jsloader } from "@/components/other/Jsloader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`light ${inter.className}`}
      suppressHydrationWarning={true}
    >
      <head>
        <script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              const saved = localStorage.getItem("theme");
              if (saved === "dark") {
                document.documentElement.classList.add("dark");
                document.documentElement.classList.remove("light");
              } else {
                document.documentElement.classList.add("light");
                document.documentElement.classList.remove("dark");
              }
            } catch (e) {}
          `}
        </script>
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        ></script>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707070' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='4' ry='4'/%3E%3C/svg%3E"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lobster&family=Pacifico&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Stack+Sans+Notch:wght@200..700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/logo.svg" />
      </head>
      <body className="custom-scroll dark:bg-zinc-950" suppressHydrationWarning>
        <Jsloader />
        <QueryProvider>
          <div>{children}</div>
        </QueryProvider>
      </body>
    </html>
  );
}
