"use client";
import React from "react";
import { Evidence, ClaimEvidenceLink, ConfidenceLevel } from "@mosaic/contracts";
import { clsx } from "clsx";
import { motion } from "framer-motion";

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
    <motion.div
      layout
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={clsx(
        "p-4 rounded-xl bg-bg-surface/80 backdrop-blur-sm border flex flex-col gap-2 transition-colors cursor-pointer relative shadow-sm font-ui",
        roleStyle,
        isTraced ? "ring-1 ring-offset-2 ring-accent-primary bg-bg-surface-active shadow-md" : "hover:bg-bg-surface hover:shadow-md",
        isDimmed && "opacity-60 hover:opacity-100"
      )}
    >
      {isTraced && (
        <motion.div 
          layoutId="trace-indicator"
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-[2px] bg-accent-primary shadow-[0_0_12px_var(--color-accent-primary)] rounded-full" 
        />
      )}
      
      <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest mb-1">
        <span className="font-semibold">{link.role}</span>
        <span className="opacity-70 px-2 py-0.5 rounded-full bg-bg-base border border-border-subtle">{link.confidence} conf</span>
      </div>
      
      <div className={clsx("text-sm text-text-primary leading-relaxed", isDimmed ? "text-text-secondary" : "")}>
        "{evidence.text}"
      </div>
      
      <div className="flex justify-between items-center mt-2 pt-3 border-t border-border-subtle/30 text-xs font-medium text-text-tertiary">
        <span className="hover:text-text-secondary transition-colors">
          Pg {evidence.provenance.page} • Para {evidence.provenance.paragraph}
        </span>
      </div>
    </motion.div>
  );
}
