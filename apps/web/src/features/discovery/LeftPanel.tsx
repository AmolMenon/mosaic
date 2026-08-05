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

  if (!data) return null;
  const mockDiscoveryView = data.discoveryView;
  const mockFollowNode = data.followNode;

  const views = [mockDiscoveryView];
  const follows = [mockFollowNode]; // In a real app we'd hydrate this

  return (
    <div className="p-4 h-full flex flex-col bg-bg-base overflow-y-auto">
      <div className="mb-8">
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3">Knowledge Views</div>
        <div className="space-y-1.5">
          {views.map(view => {
            const isActive = activeViewId === view.id;
            return (
              <div 
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={clsx(
                  "p-2 rounded cursor-pointer transition-colors flex items-center justify-between text-sm",
                  isActive ? "bg-selection-bg text-accent-primary font-semibold" : "text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
                )}
              >
                <div className="flex items-center gap-2">
                  <span>{view.isPinned ? "📌" : "📄"}</span>
                  <span>{view.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3">Following</div>
        <div className="space-y-1.5">
          {follows.map(fol => (
            <div 
              key={fol.id}
              className="p-2 rounded cursor-pointer transition-colors flex items-center gap-2 text-sm text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
            >
              <span className="text-accent-success">★</span>
              <span className="capitalize">{fol.targetType}</span>
              <span className="text-text-tertiary text-xs truncate">Updates</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
