"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

dayjs.locale("id");

const queryClient = new QueryClient();

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh w-full items-center justify-center">
          Loading...
        </div>
      }
    >
      <QueryClientProvider client={queryClient}>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {children}
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </QueryClientProvider>
    </Suspense>
  );
}

export default DashboardLayout;
