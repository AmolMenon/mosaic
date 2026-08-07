"use client";
import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  Building2, Activity, Clock, FileText, CheckCircle2, 
  AlertTriangle, Zap, Star, Search, Plus, Bell, Command
} from "lucide-react";
import { AppShell } from "@mosaic/ui";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function HomeDashboard() {
  return (
    <AppShell>
      <div className="flex flex-col h-full overflow-hidden bg-bg-base font-ui">
        {/* Top Navbar */}
        <header className="h-14 border-b border-border-subtle bg-bg-surface flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4 w-1/3">
            <div className="font-bold text-text-primary tracking-tight">Mosaic OS</div>
            <div className="h-4 w-[1px] bg-border-strong" />
            <span className="text-xs text-text-secondary font-medium">Home</span>
          </div>
          
          <div className="flex-1 flex justify-center max-w-xl">
            <div className="w-full relative flex items-center group cursor-pointer" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
              <Search className="absolute left-3 text-text-tertiary group-hover:text-text-secondary transition-colors" size={16} />
              <div className="w-full bg-bg-base border border-border-strong rounded-md py-1.5 pl-9 pr-3 text-sm text-text-tertiary group-hover:border-accent-primary transition-colors flex justify-between items-center">
                <span>Search global workspace...</span>
                <div className="flex items-center gap-1 text-[10px] font-mono opacity-60">
                  <Command size={12} /><span>K</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-1/3 flex justify-end gap-3 items-center">
            <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover rounded-full transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-danger rounded-full ring-2 ring-bg-surface" />
            </button>
            <div className="w-8 h-8 rounded-full bg-accent-primary text-bg-base flex items-center justify-center font-bold text-xs">
              JD
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <motion.div 
            className="max-w-6xl mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Header section */}
            <motion.div variants={itemVariants} className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-text-primary mb-2">Good morning, James.</h1>
                <p className="text-text-secondary text-sm">You have 3 active diligence processes and 12 documents awaiting review.</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border-strong rounded-md text-sm font-medium hover:bg-bg-surface-hover transition-colors">
                  <Activity size={16} /> System Health
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-text-primary text-bg-base rounded-md text-sm font-medium hover:bg-text-secondary transition-colors shadow-sm">
                  <Plus size={16} /> New Company
                </button>
              </div>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
              {[
                { label: "Active Companies", value: "8", icon: Building2, color: "text-accent-primary" },
                { label: "Running Executions", value: "2", icon: Zap, color: "text-accent-warning" },
                { label: "Assigned Reviews", value: "12", icon: CheckCircle2, color: "text-accent-danger" },
                { label: "Recent Documents", value: "142", icon: FileText, color: "text-text-secondary" },
              ].map((metric, i) => (
                <div key={i} className="bg-bg-surface border border-border-subtle rounded-xl p-5 hover:border-border-strong transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <metric.icon size={20} className={metric.color} />
                    <span className="text-2xl font-semibold text-text-primary">{metric.value}</span>
                  </div>
                  <div className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">{metric.label}</div>
                </div>
              ))}
            </motion.div>

            <div className="grid grid-cols-3 gap-8">
              {/* Left Column: Projects & Recents */}
              <div className="col-span-2 space-y-8">
                
                {/* Pinned Projects */}
                <motion.div variants={itemVariants}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-text-tertiary">Pinned Workspaces</h2>
                    <Link href="/projects" className="text-sm text-accent-primary hover:underline">View All</Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/projects/prj_01HVKM4T" className="block bg-bg-surface border border-border-subtle rounded-xl p-5 hover:border-accent-primary hover:shadow-md transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 text-accent-warning opacity-20 group-hover:opacity-100 transition-opacity">
                        <Star size={48} className="fill-current" />
                      </div>
                      <div className="flex items-center gap-2 mb-3 relative z-10">
                        <div className="w-8 h-8 rounded-md bg-selection-bg flex items-center justify-center text-accent-primary font-bold">AP</div>
                        <span className="font-semibold text-text-primary text-lg">Project Apollo</span>
                      </div>
                      <div className="text-sm text-text-secondary mb-4 relative z-10">LBO / Tech / Series E</div>
                      <div className="flex gap-2 relative z-10">
                        <span className="text-[10px] uppercase font-bold px-2 py-1 bg-accent-success/10 text-accent-success rounded border border-accent-success/20">Diligence Phase</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-1 bg-bg-base text-text-tertiary rounded border border-border-subtle">Last active 2m ago</span>
                      </div>
                    </Link>
                    
                    <Link href="/projects/prj_02" className="block bg-bg-surface border border-border-subtle rounded-xl p-5 hover:border-accent-primary hover:shadow-md transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 text-accent-warning opacity-20 group-hover:opacity-100 transition-opacity">
                        <Star size={48} className="fill-current" />
                      </div>
                      <div className="flex items-center gap-2 mb-3 relative z-10">
                        <div className="w-8 h-8 rounded-md bg-bg-base border border-border-strong flex items-center justify-center text-text-secondary font-bold">TI</div>
                        <span className="font-semibold text-text-primary text-lg">Project Titan</span>
                      </div>
                      <div className="text-sm text-text-secondary mb-4 relative z-10">Growth / SaaS</div>
                      <div className="flex gap-2 relative z-10">
                        <span className="text-[10px] uppercase font-bold px-2 py-1 bg-accent-warning/10 text-accent-warning rounded border border-accent-warning/20">Screening</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-1 bg-bg-base text-text-tertiary rounded border border-border-subtle">Last active 1h ago</span>
                      </div>
                    </Link>
                  </div>
                </motion.div>

                {/* AI Pipeline Telemetry */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text-tertiary mb-4">Active Executions</h2>
                  <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-border-subtle flex justify-between items-center hover:bg-bg-surface-hover cursor-pointer transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-accent-warning animate-pulse" />
                        <div>
                          <div className="text-sm font-semibold text-text-primary">Ingestion Pipeline: Q3 Transcripts</div>
                          <div className="text-xs text-text-tertiary mt-0.5">Project Apollo • 12 files • Extracting Entities</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-text-primary">68%</div>
                        <div className="text-xs text-text-tertiary mt-0.5">~2m remaining</div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center hover:bg-bg-surface-hover cursor-pointer transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-accent-warning animate-pulse" />
                        <div>
                          <div className="text-sm font-semibold text-text-primary">Memo Synthesis</div>
                          <div className="text-xs text-text-tertiary mt-0.5">Project Titan • Aligning Evidence</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-text-primary">12%</div>
                        <div className="text-xs text-text-tertiary mt-0.5">~15m remaining</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

              </div>

              {/* Right Column: Activity Feed */}
              <div className="col-span-1">
                <motion.div variants={itemVariants} className="bg-bg-surface border border-border-subtle rounded-xl p-5 h-full">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text-tertiary mb-6">Recent Activity</h2>
                  
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border-strong before:via-border-subtle before:to-transparent">
                    {[
                      { type: "ai", title: "AI generated new insights", project: "Project Apollo", time: "10m ago", icon: Zap, color: "text-accent-warning", bg: "bg-accent-warning/10" },
                      { type: "doc", title: "CIM v2 uploaded", project: "Project Titan", time: "1h ago", icon: FileText, color: "text-accent-primary", bg: "bg-selection-bg" },
                      { type: "alert", title: "Contradiction detected in Q3 earnings", project: "Project Apollo", time: "2h ago", icon: AlertTriangle, color: "text-accent-danger", bg: "bg-accent-danger/10" },
                      { type: "user", title: "Sarah left a comment on Memo", project: "Project Odyssey", time: "5h ago", icon: Activity, color: "text-text-secondary", bg: "bg-bg-base border border-border-strong" },
                    ].map((act, i) => (
                      <div key={i} className="relative flex items-start justify-between">
                        <div className="flex gap-4 w-full">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${act.bg}`}>
                            <act.icon size={12} className={act.color} />
                          </div>
                          <div className="flex-1 pb-1">
                            <div className="text-sm font-medium text-text-primary">{act.title}</div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-text-secondary">{act.project}</span>
                              <span className="text-[10px] text-text-tertiary font-mono uppercase">{act.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full mt-6 py-2 border border-border-subtle rounded-md text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-base transition-colors">
                    View All Activity
                  </button>
                </motion.div>
              </div>
            </div>
            
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
