"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import {
  Fingerprint,
  LayoutDashboard,
  Users,
  FileText,
  AlertTriangle,
  LifeBuoy,
  Cloud,
  LogOut,
  Settings,
  Calendar,
  Clock,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setCurrentDateTime(new Intl.DateTimeFormat('ar-SY', options).format(now));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { href: "/", label: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/employees", label: "الموظفون", icon: Users },
    { href: "/reports", label: "التقارير", icon: FileText },
    { href: "/anomalies", label: "كشف التجاوزات (AI)", icon: AlertTriangle },
    { href: "/settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar collapsible="icon" side="right" className="border-r">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Fingerprint className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-semibold text-primary">دوامي</h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, side: "left" }}
                  >
                    <span>
                      <item.icon />
                      <span>{item.label}</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           {/* Can be used for other links */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
             <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {currentDateTime ? (
                  <>
                    <Calendar className="h-4 w-4" />
                    <span>{currentDateTime}</span>
                  </>
                ) : (
                  <div className="h-5 w-64 bg-muted animate-pulse rounded-md" />
                )}
              </div>
          </div>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="@admin" data-ai-hint="profile picture" />
                  <AvatarFallback>مدير</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal text-right">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">المدير</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@dawamy.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuItem>
                <Cloud className="mr-2 h-4 w-4" />
                <span>نسخ احتياطي للبيانات</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>الدعم الفني</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
