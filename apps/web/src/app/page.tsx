"use client";
import React from "react";
import Link from "next/link";
import { Folder, HardDrive, HelpCircle, FileText } from "lucide-react";
import styles from "./landing.module.css";

export default function HomePage() {
  const defaultProjectId = "prj_01HVKM4T";

  return (
    <div className={styles.container}>
      <div className={styles.background}></div>
      <div className={styles.overlay}></div>

      <main className={styles.hero}>
        <h1 className={styles.title}>Mosaic OS</h1>
        <p className={styles.subtitle}>
          The Evidence Layer for Investment Decisions.
          <br />
          Synthesize, trace, and collaborate on due diligence instantly.
        </p>

        <div className={styles.grid}>
          <Link href="/projects" className={styles.card}>
            <div className={styles.iconWrapper}>
              <Folder size={28} strokeWidth={1.5} />
            </div>
            <div className={styles.cardTitle}>Projects</div>
            <div className={styles.cardDesc}>
              View and manage all active investment opportunities and diligence workflows.
            </div>
          </Link>

          <Link href={`/projects/${defaultProjectId}/data-room`} className={styles.card}>
            <div className={styles.iconWrapper}>
              <HardDrive size={28} strokeWidth={1.5} />
            </div>
            <div className={styles.cardTitle}>Data Room</div>
            <div className={styles.cardDesc}>
              Ingest, organize, and query thousands of documents instantly with AI.
            </div>
          </Link>

          <Link href={`/projects/${defaultProjectId}/questions`} className={styles.card}>
            <div className={styles.iconWrapper}>
              <HelpCircle size={28} strokeWidth={1.5} />
            </div>
            <div className={styles.cardTitle}>Q&A Matrix</div>
            <div className={styles.cardDesc}>
              Track key diligence questions mapped directly to supporting evidence.
            </div>
          </Link>

          <Link href={`/projects/${defaultProjectId}/memo`} className={styles.card}>
            <div className={styles.iconWrapper}>
              <FileText size={28} strokeWidth={1.5} />
            </div>
            <div className={styles.cardTitle}>Investment Memo</div>
            <div className={styles.cardDesc}>
              Collaborative, auto-updating memos fully backed by cited sources.
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
