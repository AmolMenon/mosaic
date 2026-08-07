"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@mosaic/ui";
import { Home, FolderDot, BookOpen, BrainCircuit, Command } from "lucide-react";
import clsx from "clsx";

export function GlobalSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Projects", href: "/projects", icon: FolderDot },
    { name: "Knowledge", href: "/knowledge", icon: BookOpen },
    { name: "AI", href: "/ai", icon: BrainCircuit },
  ];

  return (
    <Sidebar width={260} className="border-r border-border-subtle bg-bg-surface/50 p-4 hidden lg:flex flex-col">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center text-bg-base">
          <Command size={18} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-text-primary">Mosaic OS</span>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-selection-bg text-accent-primary" 
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover"
              )}
            >
              <Icon size={18} className={clsx(isActive ? "text-accent-primary" : "text-text-tertiary")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </Sidebar>
  );
}
