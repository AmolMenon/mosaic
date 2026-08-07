"use client";
import React from "react";
import { useMemoStore } from "../../store/memo";
import { useMemos } from "../../hooks/queries";

export function ContextPanel() {
  const { activeBlockId } = useMemoStore();
  const { data } = useMemos();

  return (
    <div className="p-4 h-full bg-bg-surface border-l border-border-subtle text-text-tertiary text-sm flex items-center justify-center text-center flex-col">
      <div className="text-2xl mb-2">📄</div>
      <div>Select a paragraph in the memo<br/>to inspect its underlying knowledge.</div>
    </div>
  );
}
