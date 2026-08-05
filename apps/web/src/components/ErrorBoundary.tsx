"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg-base text-text-primary p-4 text-center">
          <div className="p-6 max-w-lg bg-bg-surface border border-border-subtle rounded-lg shadow-sm">
            <h1 className="text-xl font-bold mb-4 text-red-500">Something went wrong.</h1>
            <p className="text-text-secondary mb-4">An unexpected error occurred in the application.</p>
            <pre className="text-left text-xs bg-bg-subtle p-4 rounded overflow-auto text-text-tertiary">
              {this.state.error?.message}
            </pre>
            <button 
              className="mt-6 px-4 py-2 bg-text-primary text-bg-base rounded hover:opacity-90 font-medium"
              onClick={() => window.location.reload()}
            >
              Reload application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
