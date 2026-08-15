"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { APP_SIDEBAR_NAV_GROUPS, SITE_HEADER_LOGO, SITE_NAME } from "@/lib/utils/constants";

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="h-14 justify-center px-2">
        <Link
          href="/gestao-obras"
          className="flex items-center gap-2.5 rounded-lg px-1 py-1.5 group-data-[collapsible=icon]:justify-center"
        >
          <span className="relative size-8 shrink-0 overflow-hidden rounded-md ring-1 ring-black/5">
            <Image src={SITE_HEADER_LOGO} alt={SITE_NAME} fill sizes="32px" className="object-cover" />
          </span>
          <span className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate font-display text-sm leading-tight text-sidebar-accent-foreground">
              {SITE_NAME}
            </span>
            <span className="truncate text-[11px] leading-tight text-sidebar-foreground/70">Painel de gestão</span>
          </span>
        </Link>
      </SidebarHeader>
      <Separator className="w-full bg-sidebar-border" />
      <SidebarContent>
        {APP_SIDEBAR_NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={{
                        children: item.title,
                        className:
                          "bg-white text-panel-surface-foreground border border-panel-border **:data-[slot=tooltip-arrow]:bg-white **:data-[slot=tooltip-arrow]:fill-white",
                      }}
                      className={
                        "text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground " +
                        "data-[active=true]:bg-panel-accent data-[active=true]:text-panel-accent-foreground data-[active=true]:font-medium " +
                        "data-[active=true]:hover:bg-panel-accent"
                      }
                    >
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (isMobile) setOpenMobile(false);
                        }}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge !== undefined && (
                      <SidebarMenuBadge className="bg-panel-accent font-semibold text-panel-accent-foreground">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
