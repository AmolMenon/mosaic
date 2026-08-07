"use client";
import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  Building2, Activity, Clock, FileText, CheckCircle2, 
  AlertTriangle, Zap, Star, Search, Plus, Bell, Command, User, ArrowRight, FolderDot
} from "lucide-react";
import { AppShell } from "@mosaic/ui";
import { GlobalSidebar } from "../../components/GlobalSidebar";

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
    <AppShell sidebar={<GlobalSidebar />}>
      <div className="flex flex-col h-full overflow-hidden bg-bg-base font-ui">
        {/* Top Navbar */}
        <header className="h-14 border-b border-border-subtle bg-bg-surface flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4 w-1/3 lg:hidden">
            <div className="font-bold text-text-primary tracking-tight">Mosaic OS</div>
          </div>
          
          <div className="flex-1 flex justify-center max-w-xl hidden lg:flex">
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
          
          <div className="w-1/3 flex justify-end gap-3 items-center ml-auto">
            <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover rounded-full transition-colors relative">
              <Bell size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-bg-base border border-border-strong text-text-secondary flex items-center justify-center font-bold text-xs">
              <User size={14} />
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
                <h1 className="text-3xl font-semibold text-text-primary mb-2">Welcome to Mosaic.</h1>
                <p className="text-text-secondary text-sm">Your intelligence workspace is ready. Connect your first data room to begin.</p>
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
                { label: "Active Companies", value: "-", icon: Building2, color: "text-text-tertiary" },
                { label: "Running Executions", value: "-", icon: Zap, color: "text-text-tertiary" },
                { label: "Assigned Reviews", value: "-", icon: CheckCircle2, color: "text-text-tertiary" },
                { label: "Recent Documents", value: "-", icon: FileText, color: "text-text-tertiary" },
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
                  </div>
                  
                  {/* Empty State */}
                  <div className="border border-dashed border-border-strong rounded-xl p-12 flex flex-col items-center justify-center text-center bg-bg-surface/50">
                    <div className="w-12 h-12 rounded-xl bg-bg-base border border-border-subtle flex items-center justify-center mb-4">
                      <FolderDot size={24} className="text-text-tertiary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">No Workspaces Pinned</h3>
                    <p className="text-sm text-text-secondary max-w-md mb-6">Create a new workspace or pin an existing one to quickly access your most important diligence projects.</p>
                    <button className="flex items-center gap-2 px-4 py-2 bg-text-primary text-bg-base rounded-md text-sm font-medium hover:bg-text-secondary transition-colors shadow-sm">
                      <Plus size={16} /> Create Workspace
                    </button>
                  </div>
                </motion.div>

                {/* AI Pipeline Telemetry */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text-tertiary mb-4">Active Executions</h2>
                  <div className="border border-border-subtle rounded-xl p-8 flex flex-col items-center justify-center text-center bg-bg-surface/50">
                    <div className="w-10 h-10 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center mb-3">
                      <Zap size={20} className="text-text-tertiary" />
                    </div>
                    <h3 className="text-sm font-medium text-text-primary mb-1">System Idle</h3>
                    <p className="text-xs text-text-tertiary">No AI orchestration tasks are currently running.</p>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Activity Feed */}
              <div className="col-span-1">
                <motion.div variants={itemVariants} className="bg-bg-surface border border-border-subtle rounded-xl p-5 h-full">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text-tertiary mb-6">Recent Activity</h2>
                  
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Activity size={24} className="text-text-tertiary mb-3 opacity-50" />
                    <p className="text-sm text-text-secondary font-medium">No recent activity</p>
                    <p className="text-xs text-text-tertiary mt-1">Actions in your workspaces will appear here.</p>
                  </div>
                </motion.div>
              </div>
            </div>
            
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
