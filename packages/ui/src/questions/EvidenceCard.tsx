import React from "react";
import { Evidence, ClaimEvidenceLink, ConfidenceLevel } from "@mosaic/contracts";
import { clsx } from "clsx";

export interface EvidenceCardProps {
  evidence: Evidence;
  link: ClaimEvidenceLink;
  isTraced?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
  onClick?: () => void;
}

const roleColors = {
  SUPPORTS: "border-accent-success text-accent-success",
  CONTRADICTS: "border-accent-danger text-accent-danger",
  QUALIFIES: "border-accent-warning text-accent-warning",
  CONTEXT: "border-border-strong text-text-secondary",
  METRIC: "border-accent-primary text-accent-primary",
  ASSUMPTION: "border-accent-warning text-accent-warning",
  RISK: "border-accent-danger text-accent-danger",
  GAP: "border-border-subtle text-text-tertiary border-dashed",
};

export function EvidenceCard({
  evidence,
  link,
  isTraced = false,
  onHover,
  onLeave,
  onClick,
}: EvidenceCardProps) {
  const roleStyle = roleColors[link.role as keyof typeof roleColors];
  const isDimmed = link.confidence === "low";

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={clsx(
        "p-3 rounded-md bg-bg-base border flex flex-col gap-2 transition-all cursor-pointer relative",
        roleStyle,
        isTraced ? "ring-2 ring-offset-2 ring-accent-primary bg-bg-surface-active" : "hover:bg-bg-surface",
        isDimmed && "opacity-60"
      )}
    >
      {isTraced && (
        <div className="absolute -left-2 top-1/2 w-4 h-[1px] bg-accent-primary shadow-[0_0_8px_var(--color-accent-primary)]" />
      )}
      
      <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
        <span>{link.role}</span>
        <span className="opacity-70">{link.confidence} conf</span>
      </div>
      
      <div className={clsx("text-sm text-text-primary", isDimmed ? "text-text-secondary" : "")}>
        "{evidence.text}"
      </div>
      
      <div className="flex justify-between items-center mt-1 pt-2 border-t border-border-subtle/50 text-[11px] text-text-tertiary">
        <span>Pg {evidence.provenance.page} • Para {evidence.provenance.paragraph}</span>
      </div>
    </div>
  );
}
