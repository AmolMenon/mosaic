import React from "react";
import { clsx } from "clsx";

export interface AppShellProps {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ sidebar, header, children, className }: AppShellProps) {
  return (
    <div className={clsx("flex h-screen w-full bg-bg-base text-text-primary overflow-hidden", className)}>
      {sidebar && <aside className="h-full border-r border-border-subtle bg-bg-surface flex-shrink-0">{sidebar}</aside>}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {header && <header className="h-14 border-b border-border-subtle bg-bg-base flex-shrink-0">{header}</header>}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
