"use client";
import React from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  children?: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, width = 320, className, ...props }: SidebarProps) {
  return (
    <motion.div 
      layout
      style={{ width }} 
      className={clsx("flex flex-col h-full bg-bg-surface/90 backdrop-blur-xl overflow-hidden transition-colors duration-200", className)} 
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}
