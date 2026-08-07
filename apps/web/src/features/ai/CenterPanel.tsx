"use client";
import React from "react";
import { useAiStore } from "../../store/ai";
import { useAI } from "../../hooks/queries";
import { clsx } from "clsx";
import { AIThinking } from "./AIThinking";

export function CenterPanel() {
  const { activeProposalId, setActiveProposal } = useAiStore();
  const { data, isLoading } = useAI();

  if (isLoading) return <div className="flex-1 overflow-hidden bg-bg-base relative flex"><AIThinking /></div>;
  if (!data) return null;

  const assignment = data.assignmentChallengePricing;

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center bg-bg-base text-text-tertiary">
      <div className="w-24 h-24 mb-6 rounded-full bg-bg-surface border-2 border-border-dashed flex items-center justify-center">
        <span className="text-4xl text-accent-primary opacity-50">🤖</span>
      </div>
      <h3 className="text-xl font-medium text-text-primary mb-2">No Active AI Operations</h3>
      <p className="text-sm max-w-md text-center leading-relaxed">
        There are currently no AI agents running on this workspace. When agents propose insights or narratives, they will appear here for human review and approval.
      </p>
    </div>
  );
}
