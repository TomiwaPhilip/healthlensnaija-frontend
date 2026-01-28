import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  Trash2,
  Globe,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SourceStatus = "queued" | "indexing" | "indexed" | "error";
export type SourceType = "pdf" | "url";

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  status: SourceStatus;
  progress: number;
  errorMessage?: string;
  dateAdded: Date;
}

export function useSourcesPanelState() {
  const [sources, setSources] = useState<Source[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = (file: File) => {
    if (file.type !== "application/pdf") {
      setGlobalError("Only PDF files are supported.");
      return;
    }

    const newSource: Source = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: "pdf",
      status: "indexing",
      progress: 0,
      dateAdded: new Date(),
    };

    addSourceLimited_Simulated(newSource);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    try {
      new URL(urlInput);
    } catch (_) {
      setGlobalError("Please enter a valid URL.");
      return;
    }

    const newSource: Source = {
      id: Math.random().toString(36).substr(2, 9),
      name: urlInput,
      type: "url",
      status: "indexing",
      progress: 0,
      dateAdded: new Date(),
    };

    addSourceLimited_Simulated(newSource);
    setUrlInput("");
  };

  const addSourceLimited_Simulated = (source: Source) => {
    setGlobalError(null);
    setSources((prev) => [source, ...prev]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setSources((prev) =>
          prev.map((s) =>
            s.id === source.id ? { ...s, status: "indexed", progress: 100 } : s
          )
        );
      } else {
        if (Math.random() > 0.98 && progress < 50) {
            clearInterval(interval);
            setSources((prev) =>
                prev.map((s) =>
                  s.id === source.id ? { ...s, status: "error", errorMessage: "Failed to extract text." } : s
                )
              );
        } else {
            setSources((prev) =>
                prev.map((s) =>
                  s.id === source.id ? { ...s, progress } : s
                )
              );
        }
      }
    }, 800);
  };

  const deleteSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const retrySource = (id: string) => {
     setSources((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: "indexing", progress: 0, errorMessage: undefined } : s
        )
      );
  };

  return {
    sources,
    urlInput,
    setUrlInput,
    isLoading,
    globalError,
    handleFileUpload,
    handleUrlSubmit,
    deleteSource,
    retrySource
  };
}

export function SourcesPanel({ state }: { state: ReturnType<typeof useSourcesPanelState> }) {
  const {
    sources,
    urlInput,
    setUrlInput,
    isLoading,
    globalError,
    handleFileUpload,
    handleUrlSubmit,
    deleteSource,
    retrySource
  } = state;

  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Render Helpers
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4 opacity-100 transition-opacity">
      <div className="bg-muted/50 p-4 rounded-full">
        <Upload className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-sm">No sources added</h3>
        <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
          Upload PDF documents or add web links to start generating stories.
        </p>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="space-y-4 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-3 w-[40%]" />
          </div>
        </div>
      ))}
    </div>
  );

  const getStatusIcon = (status: SourceStatus) => {
    switch (status) {
      case "indexed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "indexing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "queued":
        return <div className="h-2 w-2 rounded-full bg-muted-foreground" />;
    }
  };

  if (isLoading) {
      return renderLoadingState();
  }
  
  // This could be a separate error state for "Initial Fetch Failed"
  // For now assuming sources just might be empty.

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Upload & Input Area */}
      <div className="p-4 border-b space-y-4">
        {globalError && (
            <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs ml-2">{globalError}</AlertDescription>
            </Alert>
        )}

        {/* Drag & Drop Zone */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-colors text-center cursor-pointer",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="application/pdf"
            aria-label="Upload PDF"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 bg-background rounded-full shadow-sm">
                <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                <p className="text-xs font-medium">Click to upload PDF or drag and drop</p>
                <p className="text-[10px] text-muted-foreground">PDF (max. 10MB)</p>
            </div>
          </div>
        </div>

        {/* URL Input */}
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <Input 
            placeholder="Paste website URL..." 
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="h-9 text-xs"
          />
          <Button type="submit" size="sm" className="h-9 w-9 p-0" variant="secondary" disabled={!urlInput.trim()}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Link</span>
          </Button>
        </form>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-hidden relative">
          {sources.length === 0 ? (
                renderEmptyState()
            ) : (
                <ScrollArea className="h-full w-full">
                <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            My Sources ({sources.length})
                        </h4>
                    </div>
                    
                    {sources.map((source) => (
                    <div
                        key={source.id}
                        className="group flex flex-col gap-2 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors w-full overflow-hidden"
                    >
                        <div className="flex items-start gap-3 w-full">
                            <div className="mt-0.5 flex-shrink-0">
                                {source.type === 'pdf' ? <FileText className="h-8 w-8 text-red-500/80" /> : <Globe className="h-8 w-8 text-blue-500/80" />}
                            </div>
                            
                            <div className="flex-1 min-w-0 grid gap-1">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="truncate text-sm font-medium" title={source.name}>{source.name}</span>
                                    <Button
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => deleteSource(source.id)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                                    </Button>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(source.status)}
                                    <span className={cn(
                                        "text-xs capitalize truncate",
                                        source.status === 'error' ? "text-destructive" : "text-muted-foreground"
                                    )}>
                                        {source.errorMessage ? source.errorMessage : source.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar for Indexing */}
                        {source.status === 'indexing' && (
                            <Progress value={source.progress} className="h-1 mt-1" />
                        )}
                        
                        {/* Retry Button for Errors */}
                         {source.status === 'error' && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-6 text-xs w-full mt-1"
                                onClick={() => retrySource(source.id)}
                            >
                                Retry Indexing
                            </Button>
                        )}
                    </div>
                    ))}
                </div>
                </ScrollArea>
           )}
      </div>
    </div>
  );
}
