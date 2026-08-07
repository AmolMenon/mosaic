"use client";
import React, { useState, useRef, useEffect } from "react";
import { Bell, FileText, CheckCircle2, AlertTriangle, MessageSquareText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mock notifications to remove empty states
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "AI Analysis Complete",
      description: "Project Apollo data room has been successfully indexed.",
      time: "2m ago",
      icon: CheckCircle2,
      color: "text-accent-success",
      bg: "bg-accent-success/10",
      border: "border-accent-success/20",
    },
    {
      id: 2,
      type: "warning",
      title: "Missing Documents",
      description: "Project Titan is missing 3 requested appendix files.",
      time: "1h ago",
      icon: AlertTriangle,
      color: "text-accent-warning",
      bg: "bg-accent-warning/10",
      border: "border-accent-warning/20",
    },
    {
      id: 3,
      type: "info",
      title: "New Memo Drafted",
      description: "Initial investment memo generated for Project Hermes.",
      time: "3h ago",
      icon: FileText,
      color: "text-accent-primary",
      bg: "bg-accent-primary/10",
      border: "border-accent-primary/20",
    }
  ];

  const unreadCount = notifications.length;

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-8 h-8 flex items-center justify-center rounded-full transition-colors relative",
          isOpen ? "bg-bg-surface-hover text-text-primary" : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover"
        )}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-danger border border-bg-surface"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute right-0 mt-2 w-80 bg-bg-surface border border-border-strong rounded-xl shadow-modal overflow-hidden z-50 font-ui"
          >
            <div className="px-4 py-3 border-b border-border-subtle flex justify-between items-center bg-bg-base">
              <span className="font-bold text-sm text-text-primary">Notifications</span>
              <button className="text-xs font-medium text-accent-primary hover:text-accent-primary-hover transition-colors">Mark all read</button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-border-subtle">
                  {notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <div key={notif.id} className="p-4 hover:bg-bg-surface-hover transition-colors cursor-pointer flex gap-3">
                        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border", notif.bg, notif.color, notif.border)}>
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                            <span className="text-sm font-semibold text-text-primary truncate pr-2">{notif.title}</span>
                            <span className="text-[10px] text-text-tertiary flex-shrink-0 whitespace-nowrap mt-0.5">{notif.time}</span>
                          </div>
                          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{notif.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center mb-3">
                    <CheckCircle2 size={18} className="text-text-tertiary" />
                  </div>
                  <span className="text-sm font-medium text-text-secondary">You&apos;re all caught up.</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
