import React, { useState, useCallback, useRef } from "react";
import { UploadCloud, FileText, X, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadDocument } from "../../hooks/queries";

export type UploadStatus = "pending" | "uploading" | "complete" | "error" | "duplicate";

export interface QueueItem {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  errorMessage?: string;
  pipelineId?: string;
}

interface UploaderProps {
  onUploadSuccess: (pipeline: any) => void;
}

export function Uploader({ onUploadSuccess }: UploaderProps) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const uploadDoc = useUploadDocument();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: File[]) => {
    setQueue((prev) => {
      const newItems: QueueItem[] = [];
      const updatedQueue = [...prev];

      files.forEach((file) => {
        const isDuplicate = updatedQueue.some(
          (item) => item.file.name === file.name && item.file.size === file.size
        );
        const id = `${file.name}-${file.size}-${Date.now()}`;
        
        const newItem: QueueItem = {
          id,
          file,
          progress: 0,
          status: isDuplicate ? "duplicate" : "pending",
          errorMessage: isDuplicate ? "Duplicate file detected" : undefined,
        };
        newItems.push(newItem);
        updatedQueue.unshift(newItem); // Add to top of queue
      });

      newItems.filter(item => item.status === "pending").forEach(item => {
        handleUpload(item.id, item.file);
      });

      return updatedQueue;
    });
  };

  const handleUpload = (id: string, file: File) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: "uploading", progress: 10 } : q));
    
    const formData = new FormData();
    formData.append("document", file);

    const interval = setInterval(() => {
      setQueue(prev => prev.map(q => {
        if (q.id === id && q.status === "uploading" && q.progress < 90) {
          return { ...q, progress: q.progress + 10 };
        }
        return q;
      }));
    }, 300);

    uploadDoc.mutateAsync(formData)
      .then(res => {
        clearInterval(interval);
        setQueue(prev => prev.map(q => q.id === id ? { ...q, status: "complete", progress: 100, pipelineId: res.pipeline?.id } : q));
        if (res.pipeline) {
          onUploadSuccess(res.pipeline);
        }
      })
      .catch(err => {
        clearInterval(interval);
        setQueue(prev => prev.map(q => q.id === id ? { ...q, status: "error", errorMessage: err.message || "Upload failed" } : q));
      });
  };

  const handleRetry = (item: QueueItem) => {
    setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: "pending", errorMessage: undefined } : q));
    handleUpload(item.id, item.file);
  };

  const handleCancel = (id: string) => {
    setQueue(prev => prev.filter(q => q.id !== id));
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, [processFiles]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={clsx(
          "relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
          isDragging ? "border-accent-primary bg-accent-primary/10" : "border-border-strong bg-bg-surface hover:border-accent-primary/50"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className={clsx("w-8 h-8 mb-2", isDragging ? "text-accent-primary" : "text-text-tertiary")} />
        <div className="text-sm font-medium text-text-primary mb-1 text-center">
          Drag & drop files or click to upload
        </div>
        <div className="text-xs text-text-tertiary text-center max-w-[200px]">
          Supports PDF, TXT, MD
        </div>
        <div className="flex items-center gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
          <button 
            type="button" 
            className="text-xs px-3 py-1.5 bg-bg-base border border-border-strong rounded hover:bg-bg-surface text-text-secondary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            Select Files
          </button>
          <button 
            type="button" 
            className="text-xs px-3 py-1.5 bg-bg-base border border-border-strong rounded hover:bg-bg-surface text-text-secondary transition-colors"
            onClick={() => folderInputRef.current?.click()}
          >
            Select Folder
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept=".pdf,.txt,.md" 
          multiple 
          onChange={onFileChange} 
        />
        <input 
          type="file" 
          ref={folderInputRef}
          className="hidden" 
          /* @ts-ignore */
          webkitdirectory="" 
          directory="" 
          onChange={onFileChange} 
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-[10px] font-mono text-text-secondary uppercase">Upload Queue</div>
        {queue.length === 0 ? (
          <div className="p-4 border border-dashed border-border-strong rounded bg-bg-base text-center text-xs text-text-tertiary">
            Queue is empty
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            <AnimatePresence>
              {queue.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0, marginBottom: 0 }}
                  className="p-3 bg-bg-surface border border-border-subtle rounded flex flex-col gap-2 relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-text-tertiary shrink-0" />
                      <div className="flex flex-col truncate">
                        <span className="text-xs font-medium text-text-primary truncate" title={item.file.name}>{item.file.name}</span>
                        <span className="text-[10px] text-text-tertiary">{(item.file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {item.status === 'error' && (
                        <button onClick={() => handleRetry(item)} className="p-1 hover:bg-bg-base rounded text-accent-warning" title="Retry">
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {['pending', 'error', 'duplicate'].includes(item.status) && (
                        <button onClick={() => handleCancel(item.id)} className="p-1 hover:bg-bg-base rounded text-text-tertiary hover:text-text-primary transition-colors" title="Cancel">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {item.status === 'complete' && <CheckCircle2 className="w-4 h-4 text-accent-success" />}
                      {item.status === 'duplicate' && <div title="Duplicate file"><AlertCircle className="w-4 h-4 text-accent-warning" /></div>}
                    </div>
                  </div>
                  
                  {['uploading', 'pending'].includes(item.status) && (
                    <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden mt-1">
                      <motion.div 
                        className="bg-accent-primary h-full" 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ ease: "linear", duration: 0.2 }}
                      />
                    </div>
                  )}

                  {item.errorMessage && (
                    <div className="text-[10px] text-accent-warning mt-0.5">
                      {item.errorMessage}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
