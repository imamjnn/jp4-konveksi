import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconBell, IconLogout, IconUser } from "@tabler/icons-react";
import { SidebarMenuButton } from "../ui/sidebar";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function RightProfile() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");

      // redirect ke login
      router.replace("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="sm"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="grid flex-1 text-right text-sm leading-tight">
            <span className="truncate font-medium">Admin</span>
            <span className="truncate text-xs text-muted-foreground">
              admin@admin.com
            </span>
          </div>
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage src="" alt="profile" />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconUser />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconBell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <IconLogout />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
