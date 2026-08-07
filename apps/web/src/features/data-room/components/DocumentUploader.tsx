"use client";
import React, { useState } from "react";
import { UploadCloud, File, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export function DocumentUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("uploading");
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("success");
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
  };

  return (
    <div className="w-full max-w-xl mx-auto font-ui">
      <div 
        className={clsx(
          "relative border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-all bg-bg-surface",
          isDragging ? "border-accent-primary bg-selection-bg" : "border-border-strong hover:border-text-tertiary",
          status !== "idle" && "opacity-0 hidden"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="w-12 h-12 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center mb-4">
          <UploadCloud size={24} className={isDragging ? "text-accent-primary" : "text-text-tertiary"} />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Upload Data Room Documents</h3>
        <p className="text-sm text-text-secondary mb-6 max-w-sm">
          Drag and drop your PDFs, Excel models, or Word documents here to add them to the intelligence workspace.
        </p>
        
        <label className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-bg-base border border-border-strong rounded-lg font-medium hover:bg-bg-surface-hover transition-colors shadow-sm text-text-primary text-sm">
          <span>Browse Files</span>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx"
          />
        </label>
      </div>

      <AnimatePresence>
        {status !== "idle" && file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-bg-base border border-border-subtle flex items-center justify-center">
                  <File size={20} className="text-text-tertiary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">{file.name}</div>
                  <div className="text-xs text-text-secondary mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              </div>
              {status === "uploading" && (
                <button onClick={reset} className="text-text-tertiary hover:text-text-primary transition-colors">
                  <X size={16} />
                </button>
              )}
              {status === "success" && (
                <CheckCircle2 size={20} className="text-accent-success" />
              )}
              {status === "error" && (
                <AlertTriangle size={20} className="text-accent-danger" />
              )}
            </div>

            {status === "uploading" && (
              <div>
                <div className="flex justify-between text-xs text-text-secondary mb-2">
                  <span>Uploading and extracting entities...</span>
                  <span className="font-mono">{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-bg-base rounded-full overflow-hidden border border-border-subtle">
                  <motion.div 
                    className="h-full bg-text-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="mt-4 pt-4 border-t border-border-subtle flex justify-end gap-3">
                <button onClick={reset} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                  Upload Another
                </button>
                <button className="px-4 py-2 text-sm font-medium bg-text-primary text-bg-base rounded-md hover:bg-text-secondary transition-colors">
                  Open Document
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
