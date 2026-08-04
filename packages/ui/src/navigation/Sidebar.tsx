import React from "react";
import { clsx } from "clsx";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
}

export function Sidebar({ children, width = 320, className, ...props }: SidebarProps) {
  return (
    <div 
      style={{ width }} 
      className={clsx("flex flex-col h-full bg-bg-surface overflow-hidden", className)} 
      {...props}
    >
      {children}
    </div>
  );
}
