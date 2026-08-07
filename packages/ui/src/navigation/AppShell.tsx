"use client";
import React from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

export interface AppShellProps {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ sidebar, header, children, className }: AppShellProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx("flex h-screen w-full bg-bg-base text-text-primary overflow-hidden font-ui", className)}
    >
      {sidebar && (
        <aside className="h-full border-r border-border-subtle bg-bg-surface flex-shrink-0 relative z-20 shadow-lg">
          {sidebar}
        </aside>
      )}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-bg-base">
        {header && (
          <header className="h-14 border-b border-border-subtle bg-bg-surface/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-30">
            {header}
          </header>
        )}
        <main className="flex-1 overflow-auto relative z-10">{children}</main>
      </div>
    </motion.div>
  );
}
