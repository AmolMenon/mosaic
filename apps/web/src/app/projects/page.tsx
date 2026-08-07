"use client";
import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { AppShell } from "@mosaic/ui";
import { GlobalSidebar } from "../../components/GlobalSidebar";
import { 
  Activity, AlertTriangle, ArrowRight, CheckCircle2, 
  Clock, Database, Search, Shield, Zap, Folder, Plus
} from "lucide-react";
import clsx from "clsx";


export default function CommandCenter() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <AppShell sidebar={<GlobalSidebar />}>
      <div className="h-full overflow-y-auto p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-2">Institutional Intelligence</h1>
              <p className="text-text-secondary">Real-time pipeline health, active executions, and risk monitoring.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input 
                  type="text" 
                  placeholder="Global Search (CMD+K)" 
                  className="pl-10 pr-4 py-2 rounded-md bg-bg-surface border border-border-subtle text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 transition-all w-64"
                />
              </div>
            </div>
          </header>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {/* Widget 1: Pipeline Health */}
            <motion.div variants={item} className="p-6 rounded-xl bg-bg-surface border border-border-subtle shadow-sm relative overflow-hidden group hover:border-border-strong transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity size={64} />
              </div>
              <h3 className="text-sm font-medium text-text-secondary mb-1">Active Pipeline</h3>
              <div className="text-3xl font-semibold mb-4">0 <span className="text-sm text-text-tertiary font-normal">opportunities</span></div>
              <div className="flex gap-4 text-xs font-mono opacity-50">
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-accent-primary" /> 0 Screening</div>
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-accent-success" /> 0 Diligence</div>
              </div>
            </motion.div>

            {/* Widget 2: AI Orchestration */}
            <motion.div variants={item} className="p-6 rounded-xl bg-bg-surface border border-border-subtle shadow-sm relative overflow-hidden group hover:border-border-strong transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={64} />
              </div>
              <h3 className="text-sm font-medium text-text-secondary mb-1">AI Executions (24h)</h3>
              <div className="text-3xl font-semibold mb-4">0 <span className="text-sm text-text-tertiary font-normal">tasks</span></div>
              <div className="text-xs text-text-tertiary font-mono flex items-center gap-1.5 opacity-50">
                <CheckCircle2 size={12} /> System idle
              </div>
            </motion.div>

            {/* Widget 3: Risk Alerts */}
            <motion.div variants={item} className="p-6 rounded-xl bg-bg-surface border border-border-subtle shadow-sm relative overflow-hidden group hover:border-border-strong transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <AlertTriangle size={64} />
              </div>
              <h3 className="text-sm font-medium text-text-secondary mb-1">Active Risk Alerts</h3>
              <div className="text-3xl font-semibold text-text-primary mb-4">0 <span className="text-sm text-text-tertiary font-normal">critical</span></div>
              <div className="text-xs text-text-tertiary font-mono flex items-center gap-1.5 opacity-50">
                <CheckCircle2 size={12} /> All systems operational
              </div>
            </motion.div>
          </motion.div>

          {/* Active Projects List */}
          <motion.div variants={item} initial="hidden" animate="show">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Active Workspaces</h2>
              <button className="text-sm text-accent-primary hover:text-accent-primary-hover font-medium transition-colors">
                View All
              </button>
            </div>
            
            <div className="bg-bg-surface border border-dashed border-border-strong rounded-xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-bg-base border border-border-subtle flex items-center justify-center mb-6 shadow-sm">
                <Folder size={32} className="text-text-tertiary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">No Active Workspaces</h3>
              <p className="text-base text-text-secondary max-w-lg mb-8">
                Your intelligence workspaces will appear here. Create a new workspace to start processing data room documents and generating insights.
              </p>
              <button className="flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-base rounded-lg font-medium hover:bg-text-secondary transition-all shadow-md hover:shadow-lg">
                <Plus size={18} /> Create Workspace
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </AppShell>
  );
}
