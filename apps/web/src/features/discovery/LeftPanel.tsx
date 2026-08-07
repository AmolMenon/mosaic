"use client";
import React from "react";
import { useDiscoveryStore } from "../../store/discovery";
import { useDiscovery } from "../../hooks/queries";
import { clsx } from "clsx";

export function LeftPanel() {
  const { activeViewId, setActiveView } = useDiscoveryStore();
  const { data } = useDiscovery();
  
  React.useEffect(() => {
    if (data && !activeViewId) setActiveView(data.discoveryView.id);
  }, [activeViewId, setActiveView, data]);

  return (
    <div className="p-4 h-full flex flex-col bg-bg-base overflow-y-auto">
      <div className="mb-8">
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3">Knowledge Views</div>
        <div className="text-sm text-text-tertiary italic p-3 text-center border border-dashed border-border-strong rounded-md">
          No views available.
        </div>
      </div>

      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3">Following</div>
        <div className="text-sm text-text-tertiary italic p-3 text-center border border-dashed border-border-strong rounded-md">
          Not following any entities.
        </div>
      </div>
    </div>
  );
}
