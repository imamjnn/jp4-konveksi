"use client";

import * as React from "react";
import {
  IconCalendarDollar,
  IconChartBar,
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
  IconNotes,
  IconTransfer,
  IconUsers,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

export const navData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Pengeluaran",
      url: "/dashboard/expense",
      icon: IconCalendarDollar,
    },
    {
      title: "Item",
      url: "/dashboard/items",
      icon: IconListDetails,
    },
    {
      title: "Member",
      url: "/dashboard/member",
      icon: IconUsers,
    },
    {
      title: "Voucher",
      url: "/dashboard/voucher",
      icon: IconNotes,
    },
  ],
  navSale: [
    {
      title: "Produk",
      url: "/dashboard/sale/product",
      icon: IconListDetails,
    },
    {
      title: "Transaksi",
      url: "/dashboard/sale/transaction",
      icon: IconTransfer,
    },
    {
      title: "Laporan",
      url: "/dashboard/sale/report",
      icon: IconChartBar,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">JP4 Konveksi.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col">
            <SidebarMenu>
              {navData.navMain.map((item) => {
                let isActive = false;

                if (item.url === "/dashboard") {
                  isActive = pathname === "/dashboard";
                } else {
                  isActive = pathname.startsWith(item.url);
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => router.push(item.url)}
                      className={cn(
                        isActive &&
                          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                      )}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col">
            <SidebarGroupLabel>Penjualan</SidebarGroupLabel>
            <SidebarMenu>
              {navData.navSale.map((item) => {
                let isActive = false;

                if (item.url === "/dashboard") {
                  isActive = pathname === "/dashboard";
                } else {
                  isActive = pathname.startsWith(item.url);
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => router.push(item.url)}
                      className={cn(
                        isActive &&
                          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                      )}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}
