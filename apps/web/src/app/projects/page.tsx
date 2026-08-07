"use client";
import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { AppShell, Sidebar } from "@mosaic/ui";
import { 
  Activity, AlertTriangle, ArrowRight, CheckCircle2, 
  Clock, Database, Search, Shield, Zap
} from "lucide-react";
import clsx from "clsx";

const mockProjects = [
  { id: "prj_01HVKM4T", name: "Project Apollo", stage: "diligence", risk: "low", updated: "2m ago" },
  { id: "prj_02", name: "Project Titan", stage: "screening", risk: "high", updated: "1h ago" },
  { id: "prj_03", name: "Project Odyssey", stage: "committee", risk: "medium", updated: "3h ago" },
];

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
    <AppShell
      sidebar={
        <Sidebar width={260} className="border-r border-border-subtle bg-bg-surface/50 p-4 hidden lg:flex">
          <div className="mb-8">
            <h2 className="text-xs font-mono uppercase tracking-widest text-text-tertiary mb-4">Command Center</h2>
            <nav className="space-y-1">
              <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-selection-bg text-text-primary">
                <Activity size={16} className="text-accent-primary" /> Overview
              </a>
              <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors">
                <Database size={16} /> Data Hub
              </a>
              <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors">
                <Shield size={16} /> Compliance
              </a>
            </nav>
          </div>
          
          <div className="mt-auto">
            <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-accent-success animate-pulse" />
                <span className="text-xs font-mono text-text-secondary">System Online</span>
              </div>
              <div className="text-xs text-text-tertiary">All AI orchestration services operational.</div>
            </div>
          </div>
        </Sidebar>
      }
    >
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
              <div className="text-3xl font-semibold mb-4">12 <span className="text-sm text-text-tertiary font-normal">opportunities</span></div>
              <div className="flex gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-accent-primary" /> 5 Screening</div>
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-accent-success" /> 7 Diligence</div>
              </div>
            </motion.div>

            {/* Widget 2: AI Orchestration */}
            <motion.div variants={item} className="p-6 rounded-xl bg-bg-surface border border-border-subtle shadow-sm relative overflow-hidden group hover:border-border-strong transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={64} />
              </div>
              <h3 className="text-sm font-medium text-text-secondary mb-1">AI Executions (24h)</h3>
              <div className="text-3xl font-semibold mb-4">842 <span className="text-sm text-text-tertiary font-normal">tasks</span></div>
              <div className="text-xs text-text-tertiary font-mono flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-accent-success" /> 99.8% synthesis success rate
              </div>
            </motion.div>

            {/* Widget 3: Risk Alerts */}
            <motion.div variants={item} className="p-6 rounded-xl bg-bg-surface border border-border-subtle shadow-sm relative overflow-hidden group hover:border-accent-danger/30 transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <AlertTriangle size={64} className="text-accent-danger" />
              </div>
              <h3 className="text-sm font-medium text-text-secondary mb-1">Active Risk Alerts</h3>
              <div className="text-3xl font-semibold text-text-primary mb-4">2 <span className="text-sm text-text-tertiary font-normal">critical</span></div>
              <div className="text-xs text-text-tertiary font-mono flex items-center gap-1.5 text-accent-danger/80">
                <AlertTriangle size={12} /> Compliance flag on Project Titan
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
            
            <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-bg-base/50 text-xs uppercase font-mono text-text-tertiary border-b border-border-subtle">
                  <tr>
                    <th className="px-6 py-4 font-medium">Project</th>
                    <th className="px-6 py-4 font-medium">Stage</th>
                    <th className="px-6 py-4 font-medium">Risk Profile</th>
                    <th className="px-6 py-4 font-medium">Last AI Activity</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {mockProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-bg-surface-hover transition-colors group">
                      <td className="px-6 py-4 font-medium text-text-primary">
                        <Link href={`/projects/${project.id}`} className="hover:underline decoration-border-strong underline-offset-4">
                          {project.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bg-base border border-border-subtle">
                          {project.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "capitalize flex items-center gap-1.5 text-xs font-medium",
                          project.risk === 'low' ? "text-accent-success" : project.risk === 'high' ? "text-accent-danger" : "text-accent-warning"
                        )}>
                          <div className={clsx(
                            "w-1.5 h-1.5 rounded-full",
                            project.risk === 'low' ? "bg-accent-success" : project.risk === 'high' ? "bg-accent-danger" : "bg-accent-warning"
                          )} />
                          {project.risk}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-tertiary font-mono flex items-center gap-2">
                        <Clock size={14} /> {project.updated}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-1 text-accent-primary hover:text-accent-primary-hover font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Open <ArrowRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
    </AppShell>
  );
}
