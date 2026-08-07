"use client";
import React from "react";
import { Project } from "@mosaic/contracts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function LeftPanel({ project }: { project: Project }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Workspace", path: `/projects/${project.id}` },
    { name: "Smart Data Room", path: `/projects/${project.id}/data-room` },
    { name: "Questions", path: `/projects/${project.id}/questions` },
    { name: "Memo Canvas", path: `/projects/${project.id}/memo` },
  ];

  return (
    <div className="p-4 h-full flex flex-col font-ui">
      <div className="mb-6">
        <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-1">Active Project</div>
        <div className="font-semibold text-sm truncate">{project.name}</div>
        <div className="text-xs text-accent-primary mt-1">{project.stage.replace('_', ' ').toUpperCase()}</div>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path} 
              className={clsx(
                "block px-3 py-2 text-sm rounded-md font-medium transition-colors duration-200",
                isActive 
                  ? "bg-selection-bg text-accent-primary shadow-sm" 
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover"
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-border-subtle">
        <div className="text-xs text-text-tertiary">Owner: {project.owner}</div>
        <div className="text-[10px] text-text-tertiary mt-2 font-mono border border-border-subtle rounded px-2 py-1 inline-block bg-bg-base/50 shadow-sm">
          CMD+K to search
        </div>
      </div>
    </div>
  );
}
