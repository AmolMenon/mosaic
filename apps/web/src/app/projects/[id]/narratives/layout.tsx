import React from "react";
import { AppShell, Sidebar } from "@mosaic/ui";
import { LeftPanel } from "../../../../features/narratives/LeftPanel";

export default function NarrativesLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell 
      sidebar={
        <Sidebar width={320} className="border-r border-border-subtle">
          <LeftPanel />
        </Sidebar>
      }
    >
      {children}
    </AppShell>
  );
}
