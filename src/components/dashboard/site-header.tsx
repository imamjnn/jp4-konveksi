"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { RightProfile } from "./right-profile";
import { usePathname } from "next/navigation";
import { navData } from "./app-sidebar";

export function SiteHeader() {
  const pathname = usePathname();
  const current = [...navData.navMain, ...navData.navSale].find((item) =>
    item.url === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.url),
  );
  const title = current?.title ?? "Dashboard";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 z-50 w-full bg-background/95">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-8"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <RightProfile />
        </div>
      </div>
    </header>
  );
}
