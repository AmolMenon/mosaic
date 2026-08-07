"use client";
import React, { useState } from "react";
import { useMemoStore } from "../../store/memo";
import { useMemos } from "../../hooks/queries";
import { clsx } from "clsx";
import { 
  FileText, Clock, Share2, MoreHorizontal, Download,
  Bold, Italic, List, ListOrdered, Link, Heading1, Heading2
} from "lucide-react";

export function CenterPanel() {
  const { activeBlockId, setActiveBlock, heatmapEnabled, setHeatmapEnabled } = useMemoStore();
  const { data, isLoading } = useMemos();

  // Mock memo content to replace the empty state
  const memoContent = [
    { type: "h1", content: "Project Apollo: Investment Memo" },
    { type: "p", content: "Based on the review of the Q3 and Q4 data room artifacts, we have synthesized the following investment thesis regarding the acquisition of Apollo Inc." },
    { type: "h2", content: "Executive Summary" },
    { type: "p", content: "Apollo Inc. presents a strong strategic fit within the enterprise SaaS portfolio. They have demonstrated robust YoY growth of 45% with a net retention rate of 122%. However, our AI analysis flags potential integration risks regarding their legacy tech debt in the billing infrastructure." },
    { type: "h2", content: "Financial Highlights" },
    { type: "ul", items: [
        "EBITDA margins expanded from 12% to 18% in the last 12 months.",
        "Customer Acquisition Cost (CAC) payback period reduced to 9 months.",
        "Operating cash flow remains positive and accelerating."
      ]
    },
    { type: "h2", content: "Risk Factors" },
    { type: "p", content: "The primary risk identified by the AI orchestration pipeline relates to the pending litigation outlined in Appendix C. While management considers it non-material, a deeper legal review is recommended." }
  ];

  return (
    <div className="flex-1 flex flex-col bg-bg-base overflow-hidden font-ui">
      
      {/* Editor Top Bar */}
      <div className="h-14 border-b border-border-subtle bg-bg-surface flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <FileText size={18} className="text-accent-primary" />
          <span className="font-semibold text-text-primary text-sm">Project Apollo: Final Thesis</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-bg-base border border-border-subtle rounded-md text-[10px] text-text-tertiary ml-2">
            <Clock size={10} /> Saved just now
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-bg-base border border-border-subtle rounded-md overflow-hidden mr-4">
            <button className="px-2.5 py-1.5 hover:bg-bg-surface-hover text-text-secondary transition-colors"><Bold size={14} /></button>
            <button className="px-2.5 py-1.5 hover:bg-bg-surface-hover text-text-secondary transition-colors"><Italic size={14} /></button>
            <div className="w-px h-4 bg-border-subtle mx-1" />
            <button className="px-2.5 py-1.5 hover:bg-bg-surface-hover text-text-secondary transition-colors"><Heading1 size={14} /></button>
            <button className="px-2.5 py-1.5 hover:bg-bg-surface-hover text-text-secondary transition-colors"><Heading2 size={14} /></button>
            <div className="w-px h-4 bg-border-subtle mx-1" />
            <button className="px-2.5 py-1.5 hover:bg-bg-surface-hover text-text-secondary transition-colors"><List size={14} /></button>
            <button className="px-2.5 py-1.5 hover:bg-bg-surface-hover text-text-secondary transition-colors"><ListOrdered size={14} /></button>
          </div>
          
          <button className="p-1.5 text-text-tertiary hover:text-text-primary transition-colors">
            <Share2 size={16} />
          </button>
          <button className="p-1.5 text-text-tertiary hover:text-text-primary transition-colors">
            <Download size={16} />
          </button>
          <button className="p-1.5 text-text-tertiary hover:text-text-primary transition-colors">
            <MoreHorizontal size={16} />
          </button>
          <button className="px-4 py-1.5 bg-text-primary text-bg-base text-xs font-bold rounded-md hover:bg-text-secondary transition-colors shadow-sm ml-2">
            Publish
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-bg-base flex justify-center">
        {/* Document Canvas */}
        <div className="max-w-3xl w-full py-16 px-12">
          
          <div className="space-y-6">
            {memoContent.map((block, i) => {
              if (block.type === 'h1') {
                return <h1 key={i} className="text-4xl font-bold tracking-tight text-text-primary mb-8 font-outfit">{block.content}</h1>;
              }
              if (block.type === 'h2') {
                return <h2 key={i} className="text-2xl font-semibold text-text-primary mt-12 mb-4 font-outfit">{block.content}</h2>;
              }
              if (block.type === 'p') {
                return <p key={i} className="text-base text-text-secondary leading-relaxed">{block.content}</p>;
              }
              if (block.type === 'ul') {
                return (
                  <ul key={i} className="list-disc pl-6 space-y-2 text-base text-text-secondary">
                    {block.items?.map((item, j) => (
                      <li key={j} className="leading-relaxed pl-1">{item}</li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </div>
          
          <div className="mt-20 pt-8 border-t border-border-subtle flex items-center justify-between text-xs text-text-tertiary font-mono">
            <div>v2.4 • Last edited by AI Analyst</div>
            <div>Word count: 184</div>
          </div>
        </div>
      </div>
    </div>
  );
}
