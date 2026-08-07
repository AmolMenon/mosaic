"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { AppShell } from "@mosaic/ui";
import { GlobalSidebar } from "../../components/GlobalSidebar";
import { 
  Activity, AlertTriangle, ArrowRight, CheckCircle2, 
  Clock, Database, Search, Shield, Zap, Folder, Plus,
  Building2, FileText
} from "lucide-react";
import clsx from "clsx";
import { useProjects, useDeleteProject } from "../../hooks/useProjects";
import { CreateProjectModal } from "../../features/projects/CreateProjectModal";


export default function CommandCenter() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: projects, isLoading } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();
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
            {/* Widget 1: Active Projects */}
            <motion.div variants={item} className="p-6 rounded-xl bg-bg-surface border border-border-subtle shadow-sm relative overflow-hidden group hover:border-border-strong transition-colors">
              <div className="flex justify-between items-start mb-4">
                <Building2 size={24} className="text-text-tertiary" />
                <span className="text-2xl font-semibold text-text-primary">12</span>
              </div>
              <h3 className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">Active Projects</h3>
            </motion.div>

            {/* Widget 2: Documents */}
            <motion.div variants={item} className="p-6 rounded-xl bg-bg-surface border border-border-subtle shadow-sm relative overflow-hidden group hover:border-border-strong transition-colors">
              <div className="flex justify-between items-start mb-4">
                <FileText size={24} className="text-text-tertiary" />
                <span className="text-2xl font-semibold text-text-primary">84</span>
              </div>
              <h3 className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">Documents Under Review</h3>
            </motion.div>

            {/* Widget 3: AI Processing */}
            <motion.div variants={item} className="p-6 rounded-xl bg-bg-surface border border-border-subtle shadow-sm relative overflow-hidden group hover:border-border-strong transition-colors">
              <div className="flex justify-between items-start mb-4">
                <Zap size={24} className="text-accent-primary" />
                <span className="text-2xl font-semibold text-text-primary">3</span>
              </div>
              <h3 className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">AI Processing (24h)</h3>
            </motion.div>

            {/* Widget 4: Risk Alerts */}
            <motion.div variants={item} className="p-6 rounded-xl bg-bg-surface border border-border-subtle shadow-sm relative overflow-hidden group hover:border-border-strong transition-colors">
              <div className="flex justify-between items-start mb-4">
                <AlertTriangle size={24} className="text-text-tertiary" />
                <span className="text-2xl font-semibold text-text-primary">0</span>
              </div>
              <h3 className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">Active Risk Alerts</h3>
            </motion.div>
          </motion.div>

          {/* Active Projects List */}
          <motion.div variants={item} initial="hidden" animate="show">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Active Workspaces</h2>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="text-sm text-accent-primary hover:text-accent-primary-hover font-medium transition-colors"
              >
                + New Workspace
              </button>
            </div>
            
            {isLoading ? (
              <div className="bg-bg-surface border border-border-strong rounded-xl p-16 flex justify-center shadow-sm">
                <div className="animate-spin text-accent-primary"><Activity size={24} /></div>
              </div>
            ) : projects && projects.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.data.map((p) => (
                  <div key={p.id} className="p-6 bg-bg-surface border border-border-subtle rounded-xl hover:border-accent-primary/50 transition-all shadow-sm group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-lg bg-bg-base border border-border-subtle flex items-center justify-center">
                        <Folder size={18} className="text-accent-primary" />
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          deleteProject(p.id);
                        }}
                        className="text-xs text-text-tertiary hover:text-accent-danger opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Delete
                      </button>
                    </div>
                    <Link href={`/projects/${p.id}`} className="block">
                      <h3 className="text-lg font-medium text-text-primary mb-1 group-hover:text-accent-primary transition-colors">{p.name}</h3>
                      <p className="text-sm text-text-tertiary">Created recently</p>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-bg-surface border border-dashed border-border-strong rounded-xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-bg-base border border-border-subtle flex items-center justify-center mb-6 shadow-sm">
                  <Folder size={32} className="text-text-tertiary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">No Active Workspaces</h3>
                <p className="text-base text-text-secondary max-w-lg mb-8">
                  Your intelligence workspaces will appear here. Create a new workspace to start processing data room documents and generating insights.
                </p>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-base rounded-lg font-medium hover:bg-text-secondary transition-all shadow-md hover:shadow-lg"
                >
                  <Plus size={18} /> Create Workspace
                </button>
              </div>
            )}
          </motion.div>
          <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

        </div>
      </div>
    </AppShell>
  );
}
