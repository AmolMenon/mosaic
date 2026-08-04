import React from "react";
import { AppShell, Sidebar } from "@mosaic/ui";
import { LeftPanel } from "../../../features/data-room/LeftPanel";
import { RightPanel } from "../../../features/projects/RightPanel"; // We use RightPanel fallback if we wanted, but we will use ContextPanel

export default function DataRoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell 
      sidebar={
        <Sidebar width={300} className="border-r border-border-subtle">
          <LeftPanel />
        </Sidebar>
      }
    >
      {children}
    </AppShell>
  );
}
