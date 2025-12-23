import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/view/dashboard/navigation/AppSidebar";
import AppTopbar from "@/components/view/dashboard/navigation/AppTopbar";
import { serverFetch } from "@/lib/serverFetch";
import { AuthProvider } from "@/provider/auth-provider";
import InitReduxProvider from "@/provider/InitRedux-provider";
import { Toaster } from "sonner";

export const metadata = {
  title: "Dashboard | FilesBox",
  description:
    "Access your FilesBox dashboard to manage, upload, and organize your files securely in one place.",
};

export default async function DashboardLayout({ children }) {
  const dashboardData = await serverFetch("/read/api/v2/dashboard");
  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <InitReduxProvider dashboardData={dashboardData}>
        <AuthProvider>
          <SidebarProvider>
            <div className="flex w-full">
              <AppSidebar />
              <main className="flex min-w-0 flex-1 flex-col">
                <div className="sticky top-0 z-30 flex w-full items-center gap-1 bg-white p-2 dark:bg-zinc-950">
                  <SidebarTrigger className="opacity size-9 cursor-pointer" />
                  <AppTopbar />
                </div>
                <div className="px-2 md:px-4">{children}</div>
              </main>
            </div>
            <Toaster position="top-center" />
          </SidebarProvider>
        </AuthProvider>
      </InitReduxProvider>
    </div>
  );
}
