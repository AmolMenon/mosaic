"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Activity, Clock, FileText, CheckCircle2, 
  AlertTriangle, Zap, Star, Search, Plus, Bell, Command,
  ArrowRight, Shield, BrainCircuit, BarChart3, Database,
  Lock, Globe, Users, ChevronRight
} from "lucide-react";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base font-ui text-text-primary overflow-x-hidden selection:bg-accent-primary/30 selection:text-text-primary">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-bg-base/80 backdrop-blur-md border-b border-border-subtle py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center text-bg-base">
              <Command size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Mosaic OS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <Link href="#features" className="hover:text-text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-text-primary transition-colors">How it Works</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Dashboard</Link>
            <Link href="mailto:beta@mosaicos.com" className="text-sm font-semibold bg-text-primary text-bg-base px-4 py-2 rounded-md hover:bg-text-secondary transition-all shadow-sm flex items-center gap-2">
              Request Beta Access <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-primary/5 blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-warning/5 blur-[100px]" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-border-subtle text-xs font-semibold text-accent-primary mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
            </span>
            Mosaic OS Public Beta is now live
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-text-primary leading-[1.1] mb-6">
              The operating system for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-warning">investment intelligence.</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed">
              Automate thesis extraction, evidence synthesis, and adversarial diligence with enterprise-grade AI. Built for the most rigorous private equity and corporate strategy teams.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard" className="w-full sm:w-auto text-base font-semibold bg-text-primary text-bg-base px-8 py-3.5 rounded-lg hover:bg-text-secondary transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
              Launch Workspace <ArrowRight size={18} />
            </Link>
            <Link href="mailto:beta@mosaicos.com" className="w-full sm:w-auto text-base font-semibold bg-bg-surface border border-border-strong text-text-primary px-8 py-3.5 rounded-lg hover:bg-bg-surface-hover transition-all flex items-center justify-center gap-2">
              Request Beta Access
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Product Screenshot / Interface Preview */}
      <section className="px-6 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <div className="rounded-2xl border border-border-subtle bg-bg-surface shadow-2xl overflow-hidden relative">
            <div className="h-10 border-b border-border-subtle bg-bg-base/50 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-danger/80" />
              <div className="w-3 h-3 rounded-full bg-accent-warning/80" />
              <div className="w-3 h-3 rounded-full bg-accent-success/80" />
            </div>
            <div className="p-2 relative bg-bg-base">
               <div className="grid grid-cols-4 gap-4 p-4">
                 {[1, 2, 3, 4].map(i => (
                   <div key={i} className="h-24 bg-bg-surface rounded-xl border border-border-subtle animate-pulse opacity-50" style={{ animationDelay: `${i * 0.1}s` }} />
                 ))}
               </div>
               <div className="grid grid-cols-3 gap-6 p-4">
                 <div className="col-span-2 h-96 bg-bg-surface rounded-xl border border-border-subtle animate-pulse opacity-50" />
                 <div className="col-span-1 h-96 bg-bg-surface rounded-xl border border-border-subtle animate-pulse opacity-50" style={{ animationDelay: '0.2s' }} />
               </div>
               {/* Overlay gradient to simulate 'preview' */}
               <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/50 to-transparent pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-4">Enterprise-grade diligence, automated.</h2>
            <p className="text-lg text-text-secondary">Mosaic OS ingests your entire data room and runs adversarial LLM reasoning loops to extract truth from unstructured chaos.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Database, title: "Massive Data Ingestion", desc: "Upload thousands of CIMs, expert transcripts, and financial models. We parse and index everything instantly." },
              { icon: BrainCircuit, title: "Adversarial AI Reasoning", desc: "Our orchestration engine pits Claude 3.5 Sonnet against GPT-4o to debate hypotheses and find contradictions." },
              { icon: Shield, title: "Bank-Grade Security", desc: "SOC2 Type II ready architecture. Your data never trains our models. Strict tenant isolation at the row level." },
              { icon: FileText, title: "Automated IC Memos", desc: "Generate 50-page investment committee memos automatically, complete with citations mapping back to source documents." },
              { icon: BarChart3, title: "Telemetry & Observability", desc: "Track LLM latency, token usage, and pipeline status in real-time. Full transparency into AI decision making." },
              { icon: Users, title: "Multi-Player Collaboration", desc: "Work alongside your deal team. Comment on AI insights, assign tasks, and build consensus." }
            ].map((feature, i) => (
              <div key={i} className="bg-bg-base border border-border-subtle p-8 rounded-2xl hover:border-accent-primary/50 transition-colors">
                <div className="w-12 h-12 bg-bg-surface rounded-xl flex items-center justify-center mb-6 text-accent-primary">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 border-t border-border-subtle bg-bg-surface">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-text-primary mb-6">Ready to upgrade your diligence?</h2>
          <p className="text-lg text-text-secondary mb-10">Join the top tier of investors utilizing Mosaic OS to extract alpha.</p>
          <Link href="mailto:beta@mosaicos.com" className="inline-flex items-center gap-2 bg-text-primary text-bg-base px-8 py-4 rounded-lg font-semibold text-lg hover:bg-text-secondary transition-all hover:scale-105">
            Request Beta Access <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Command size={20} className="text-text-primary" />
            <span className="font-bold text-text-primary tracking-tight">Mosaic OS</span>
          </div>
          <div className="flex gap-8 text-sm text-text-secondary font-medium">
            <Link href="#" className="hover:text-text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-text-primary transition-colors">Security</Link>
            <Link href="#" className="hover:text-text-primary transition-colors">Status</Link>
          </div>
          <div className="text-sm text-text-tertiary">
            © 2026 Mosaic OS Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
