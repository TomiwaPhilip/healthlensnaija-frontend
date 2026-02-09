import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  FileBarChart,
  Trash2,
  Download,
  MoreVertical,
  LayoutTemplate,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export type ArtifactType = "story" | "report" | "summary";

export interface Artifact {
  id: string;
  title: string;
  type: ArtifactType;
  dateCreated: Date;
  previewText?: string;
  content: string;
}

interface UseArtifactsStateArgs {
  storyId?: string | null;
  initialArtifacts?: unknown[];
}

function mapArtifactDocument(doc: any): Artifact | null {
  if (!doc) {
    return null;
  }

  const id = doc._id || doc.id;
  if (!id) {
    return null;
  }

  const content = doc.content || "";
  return {
    id,
    title: doc.title || "Untitled artifact",
    type: (doc.type as ArtifactType) || "story",
    dateCreated: new Date(doc.createdAt || Date.now()),
    previewText: content.slice(0, 180),
    content,
  };
}

export function useArtifactsPanelState({ storyId, initialArtifacts = [] }: UseArtifactsStateArgs = {}) {
  const [artifacts, setArtifacts] = useState<Artifact[]>(() =>
    initialArtifacts
      .map(mapArtifactDocument)
      .filter((artifact): artifact is Artifact => Boolean(artifact))
  );
  const [isLoading, setIsLoading] = useState(Boolean(storyId));
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    setArtifacts(
      initialArtifacts
        .map(mapArtifactDocument)
        .filter((artifact): artifact is Artifact => Boolean(artifact))
    );
  }, [initialArtifacts]);

  const fetchArtifacts = useCallback(
    async (showSpinner = true) => {
      if (!storyId) {
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be signed in to load artifacts.");
        return;
      }

      try {
        if (showSpinner) {
          setIsLoading(true);
        }
        setError(null);
        const response = await fetch(`${API_URL}/stories/${storyId}/artifacts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const payload = await response.json().catch(() => []);
        if (!response.ok) {
          throw new Error(payload?.message || "Failed to load artifacts");
        }
        setArtifacts(
          (Array.isArray(payload) ? payload : [])
            .map(mapArtifactDocument)
            .filter((artifact): artifact is Artifact => Boolean(artifact))
        );
      } catch (requestError) {
        console.error("Failed to load artifacts", requestError);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load artifacts"
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
      setArtifacts([]);
      setIsLoading(false);
      return;
    }
    fetchArtifacts(true);
  }, [fetchArtifacts, storyId]);

  const ensureStoryContext = () => {
    if (!storyId) {
      setError("Select a story before managing artifacts.");
      return null;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be signed in to manage artifacts.");
      return null;
    }
    return token;
  };

  const deleteArtifact = async (id: string) => {
    const token = ensureStoryContext();
    if (!token) {
      return;
    }

    try {
      setIsMutating(true);
      const response = await fetch(`${API_URL}/artifacts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to delete artifact");
      }
      setArtifacts((prev) => prev.filter((artifact) => artifact.id !== id));
    } catch (requestError) {
      console.error("Failed to delete artifact", requestError);
      setError(
        requestError instanceof Error ? requestError.message : "Failed to delete artifact"
      );
    } finally {
      setIsMutating(false);
    }
  };

  const addArtifact = async (title: string, content: string, type: ArtifactType) => {
    const token = ensureStoryContext();
    if (!token || !storyId) {
      return null;
    }

    try {
      setIsMutating(true);
      const response = await fetch(`${API_URL}/stories/${storyId}/artifacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, type }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to save artifact");
      }
      const mapped = mapArtifactDocument(payload);
      if (mapped) {
        setArtifacts((prev) => [mapped, ...prev]);
      }
      return mapped;
    } catch (requestError) {
      console.error("Failed to create artifact", requestError);
      setError(
        requestError instanceof Error ? requestError.message : "Failed to save artifact"
      );
      return null;
    } finally {
      setIsMutating(false);
    }
  };

  const exportArtifact = async (id: string, format: "pdf" | "docx" = "pdf") => {
    const token = ensureStoryContext();
    if (!token) {
      return;
    }

    try {
      setIsMutating(true);
      const response = await fetch(`${API_URL}/artifacts/${id}/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ format }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message || "Failed to export artifact");
      }
      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="?([^";]+)"?/i);
      const filename = match?.[1] || `artifact.${format}`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      console.error("Failed to export artifact", requestError);
      setError(
        requestError instanceof Error ? requestError.message : "Failed to export artifact"
      );
    } finally {
      setIsMutating(false);
    }
  };

  const retryLoad = () => fetchArtifacts(true);

  return {
    artifacts,
    isLoading,
    error,
    isMutating,
    deleteArtifact,
    exportArtifact,
    retryLoad,
    addArtifact,
  };
}

export function ArtifactsPanel({ state }: { state: ReturnType<typeof useArtifactsPanelState> }) {
  const { artifacts, isLoading, error, isMutating, deleteArtifact, exportArtifact, retryLoad } = state;

  const getIcon = (type: ArtifactType) => {
    switch (type) {
      case "story":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "report":
        return <FileBarChart className="h-4 w-4 text-green-500" />;
      case "summary":
        return <LayoutTemplate className="h-4 w-4 text-purple-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="flex flex-col gap-3 p-4 rounded-lg border bg-card opacity-80">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 w-full">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-3 w-[40%]" />
                </div>
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 space-y-4 text-center">
        <div className="bg-destructive/10 p-3 rounded-full">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <h3 className="font-medium text-destructive">Unable to load artifacts</h3>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
        </div>
        <Button variant="outline" size="sm" onClick={retryLoad}>
          <RefreshCw className="mr-2 h-3 w-3" />
          Retry
        </Button>
      </div>
    );
  }

  if (artifacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
        <div className="bg-muted/50 p-4 rounded-full">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-sm">No artifacts yet</h3>
          <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
            Ask the AI to draft summaries or reports—saved work will show up here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Saved Items ({artifacts.length})
          </h4>
          {isMutating && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Syncing
            </span>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1 w-full h-full">
        <div className="p-4 space-y-3">
          {artifacts.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col gap-3 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-all w-full overflow-hidden shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 p-2 bg-muted rounded-md flex-shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="grid gap-1 min-w-0">
                    <h4 className="font-medium text-sm truncate pr-2" title={item.title}>
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{item.type}</span>
                      <span>•</span>
                      <span>{item.dateCreated.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0" onClick={(event) => event.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => exportArtifact(item.id)}>
                        <Download className="mr-2 h-3.5 w-3.5" />
                        Export PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteArtifact(item.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {item.previewText && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.previewText}
                </p>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
