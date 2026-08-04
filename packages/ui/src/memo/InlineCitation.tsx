import React from "react";

export interface InlineCitationProps {
  id: string | number;
  sourceTitle: string;
  onClick?: () => void;
}

export function InlineCitation({ id, sourceTitle, onClick }: InlineCitationProps) {
  return (
    <span 
      className="inline-flex items-center justify-center bg-bg-surface-active text-accent-primary border border-border-subtle rounded px-1 text-[11px] font-medium ml-1 cursor-pointer select-none hover:border-accent-primary"
      title={sourceTitle}
      onClick={onClick}
    >
      [{id}]
    </span>
  );
}
