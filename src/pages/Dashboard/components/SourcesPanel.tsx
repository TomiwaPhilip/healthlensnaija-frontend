import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
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

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export type SourceStatus = "queued" | "processing" | "indexed" | "failed";
export type SourceType = "pdf" | "url";

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  status: SourceStatus;
  errorMessage?: string;
  dateAdded: Date;
}

interface UseSourcesPanelArgs {
  storyId?: string | null;
  initialSources?: unknown[];
}

function mapSourceStatus(ingestStatus?: string, vectorStatus?: string): SourceStatus {
  if (ingestStatus === "failed" || vectorStatus === "failed") {
    return "failed";
  }
  if (ingestStatus === "indexed" || vectorStatus === "indexed") {
    return "indexed";
  }
  if (ingestStatus === "processing" || vectorStatus === "processing") {
    return "processing";
  }
  return "queued";
}

function mapSourceDocument(doc: any): Source | null {
  if (!doc) {
    return null;
  }

  const id = doc._id || doc.id;
  if (!id) {
    return null;
  }

  const date = doc.createdAt || doc.uploaded_at || Date.now();
  const type: SourceType = doc.source_type === "url" ? "url" : "pdf";
  return {
    id,
    name: doc.filename || doc.url || "Untitled source",
    type,
    status: mapSourceStatus(doc.ingest_status, doc.vector_status),
    errorMessage: doc.ingest_error || undefined,
    dateAdded: new Date(date),
  };
}

export function useSourcesPanelState({ storyId, initialSources = [] }: UseSourcesPanelArgs = {}) {
  const [sources, setSources] = useState<Source[]>(() =>
    initialSources
      .map(mapSourceDocument)
      .filter((source): source is Source => Boolean(source))
  );
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(storyId));
  const [isMutating, setIsMutating] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [storyError, setStoryError] = useState<string | null>(null);

  useEffect(() => {
    setSources(
      initialSources
        .map(mapSourceDocument)
        .filter((source): source is Source => Boolean(source))
    );
  }, [initialSources]);

  const fetchSources = useCallback(
    async (showSpinner = true) => {
      if (!storyId) {
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setStoryError("You must be signed in to view sources.");
        return;
      }

      try {
        if (showSpinner) {
          setIsLoading(true);
        }
        setStoryError(null);
        const response = await fetch(`${API_URL}/stories/${storyId}/sources`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const payload = await response.json().catch(() => []);
        if (!response.ok) {
          throw new Error(payload?.message || "Failed to load sources");
        }
        setSources(
          (Array.isArray(payload) ? payload : [])
            .map(mapSourceDocument)
            .filter((source): source is Source => Boolean(source))
        );
      } catch (error) {
        console.error("Failed to load sources", error);
        setStoryError(
          error instanceof Error ? error.message : "Failed to load sources"
        );
      } finally {
        if (showSpinner) {
          setIsLoading(false);
        }
      }
    },
    [storyId]
  );

  useEffect(() => {
    if (!storyId) {
      setSources([]);
      setIsLoading(false);
      return;
    }
    fetchSources(true);
  }, [fetchSources, storyId]);

  const ensureStoryContext = () => {
    if (!storyId) {
      setGlobalError("Select or create a story before adding sources.");
      return false;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setGlobalError("You must be signed in to perform this action.");
      return false;
    }
    return token;
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      setGlobalError("Only PDF files are supported.");
      return;
    }
    const token = ensureStoryContext();
    if (!token || !storyId) {
      return;
    }

    try {
      setIsMutating(true);
      setGlobalError(null);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/stories/${storyId}/sources`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to upload source");
      }

      const mapped = mapSourceDocument(payload);
      if (mapped) {
        setSources((prev) => [mapped, ...prev]);
      }
    } catch (error) {
      console.error("Failed to upload source", error);
      setGlobalError(
        error instanceof Error ? error.message : "Failed to upload source"
      );
    } finally {
      setIsMutating(false);
    }
  };

  const handleUrlSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!urlInput.trim()) {
      return;
    }

    let parsedUrl: string;
    try {
      const normalized = new URL(urlInput.trim());
      parsedUrl = normalized.toString();
    } catch (error) {
      setGlobalError("Please enter a valid URL.");
      return;
    }

    const token = ensureStoryContext();
    if (!token || !storyId) {
      return;
    }

    try {
      setIsMutating(true);
      setGlobalError(null);
      const response = await fetch(`${API_URL}/stories/${storyId}/sources/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: parsedUrl }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to add URL source");
      }
      const mapped = mapSourceDocument(payload);
      if (mapped) {
        setSources((prev) => [mapped, ...prev]);
      }
      setUrlInput("");
    } catch (error) {
      console.error("Failed to add URL source", error);
      setGlobalError(
        error instanceof Error ? error.message : "Failed to add URL source"
      );
    } finally {
      setIsMutating(false);
    }
  };

  const deleteSource = async (id: string) => {
    const token = ensureStoryContext();
    if (!token) {
      return;
    }

    try {
      setIsMutating(true);
      setGlobalError(null);
      const response = await fetch(`${API_URL}/sources/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to delete source");
      }

      setSources((prev) => prev.filter((source) => source.id !== id));
    } catch (error) {
      console.error("Failed to delete source", error);
      setGlobalError(
        error instanceof Error ? error.message : "Failed to delete source"
      );
    } finally {
      setIsMutating(false);
    }
  };

  const refreshSourceStatus = async () => {
    await fetchSources(false);
  };

  // Poll for status updates when any source is still processing/queued
  useEffect(() => {
    const hasInProgress = sources.some(
      (s) => s.status === "queued" || s.status === "processing"
    );
    if (!hasInProgress || !storyId) {
      return;
    }

    const interval = setInterval(() => {
      fetchSources(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [sources, storyId, fetchSources]);

  return {
    storyId,
    sources,
    urlInput,
    setUrlInput,
    isLoading,
    isMutating,
    globalError,
    storyError,
    handleFileUpload,
    handleUrlSubmit,
    deleteSource,
    refreshSourceStatus,
    fetchSources,
  };
}

export function SourcesPanel({ state }: { state: ReturnType<typeof useSourcesPanelState> }) {
  const {
    storyId,
    sources,
    urlInput,
    setUrlInput,
    isLoading,
    isMutating,
    globalError,
    storyError,
    handleFileUpload,
    handleUrlSubmit,
    deleteSource,
    refreshSourceStatus,
    fetchSources,
  } = state;

  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasStory = Boolean(storyId);

  const handleDrag = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setIsDragActive(true);
    } else if (event.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFileUpload(event.dataTransfer.files[0]);
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
      <div className="bg-muted/50 p-4 rounded-full">
        <Upload className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-sm">No sources yet</h3>
        <p className="text-xs text-muted-foreground max-w-[220px] mx-auto">
          Upload PDFs or add trusted links to power the investigation.
        </p>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="space-y-4 p-4">
      {[1, 2, 3].map((index) => (
        <div key={index} className="flex items-center space-x-3">
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
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-muted-foreground" />;
    }
  };

  if (!hasStory) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
        Create or select a story to start attaching sources.
      </div>
    );
  }

  if (isLoading) {
    return renderLoadingState();
  }

  if (storyError) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="bg-destructive/10 p-3 rounded-full">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h3 className="font-medium">Unable to load sources</h3>
          <p className="text-xs text-muted-foreground mt-1">{storyError}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchSources(true)}>
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b space-y-4">
        {globalError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs ml-2">{globalError}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Upload PDFs or paste a URL below</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => refreshSourceStatus()}
            disabled={isMutating}
          >
            <RefreshCw className="mr-1.5 h-3 w-3" />
            Refresh
          </Button>
        </div>

        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-colors text-center cursor-pointer",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
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
            onChange={(event) => event.target.files?.[0] && handleFileUpload(event.target.files[0])}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 bg-background rounded-full shadow-sm">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">Click to upload PDF or drag and drop</p>
              <p className="text-[10px] text-muted-foreground">Supports PDF up to 10MB</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <Input
            placeholder="Paste website URL..."
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            className="h-9 text-xs"
            disabled={isMutating}
          />
          <Button
            type="submit"
            size="sm"
            className="h-9 w-9 p-0"
            variant="secondary"
            disabled={!urlInput.trim() || isMutating}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Link</span>
          </Button>
        </form>
      </div>

      <div className="flex-1 overflow-hidden">
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
                  className="group flex flex-col gap-2 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {source.type === "pdf" ? (
                        <FileText className="h-8 w-8 text-red-500/80" />
                      ) : (
                        <Globe className="h-8 w-8 text-blue-500/80" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 grid gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium" title={source.name}>
                          {source.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteSource(source.id)}
                          disabled={isMutating}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {getStatusIcon(source.status)}
                        <span
                          className={cn(
                            "capitalize truncate",
                            source.status === "failed"
                              ? "text-destructive"
                              : "text-muted-foreground"
                          )}
                        >
                          {source.errorMessage || source.status}
                        </span>
                        <span className="text-muted-foreground/60">•</span>
                        <span className="text-muted-foreground/60">
                          {source.dateAdded.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {source.status === "failed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => refreshSourceStatus()}
                      disabled={isMutating}
                    >
                      Refresh Status
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
