import React, { useState, useEffect } from "react";
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
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// --- Types ---
export type ArtifactType = "story" | "report" | "summary";

export interface Artifact {
  id: string;
  title: string;
  type: ArtifactType;
  dateCreated: Date;
  previewText?: string;
}

// --- Hook / Logic ---
export function useArtifactsPanelState() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate initial fetch
    const timer = setTimeout(() => {
        setIsLoading(false);
        setArtifacts([
            {
            id: "1",
            title: "Malaria Outbreak Report - Q1 2026",
            type: "report",
            dateCreated: new Date(Date.now() - 10000000),
            previewText: "Comprehensive analysis of recent malaria trends in the northern region..."
            },
            {
            id: "2",
            title: "Patient Success Story: Amina's Journey",
            type: "story",
            dateCreated: new Date(Date.now() - 5000000),
            previewText: "A heartwarming narrative focused on community intervention success..."
            },
            {
            id: "3",
            title: "Weekly Health Digest Summary",
            type: "summary",
            dateCreated: new Date(Date.now() - 200000),
            previewText: "Key takeaways from the ministerial press briefing..."
            }
        ]);
        // Simulate error (toggle comment to test)
        // setError("Failed to load artifacts."); setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const deleteArtifact = (id: string) => {
    setArtifacts((prev) => prev.filter((a) => a.id !== id));
  };

  const addArtifact = (title: string, previewText: string, type: ArtifactType) => {
    const newArtifact: Artifact = {
      id: Date.now().toString(),
      title,
      type,
      dateCreated: new Date(),
      previewText
    };
    setArtifacts(prev => [newArtifact, ...prev]);
  };
  
  const exportArtifact = (id: string, format: 'pdf' = 'pdf') => {
      console.log("Exporting artifact", id, format);
      // Logic to trigger download
  };

  const retryLoad = () => {
      setIsLoading(true);
      setError(null);
      // Re-trigger fetch logic (simplified)
      setTimeout(() => {
          setIsLoading(false);
           setArtifacts([
            {
            id: "1",
            title: "Malaria Outbreak Report - Q1 2026",
            type: "report",
            dateCreated: new Date(Date.now() - 10000000),
            previewText: "Comprehensive analysis of recent malaria trends in the northern region..."
            },
             {
            id: "2",
            title: "Patient Success Story: Amina's Journey",
            type: "story",
            dateCreated: new Date(Date.now() - 5000000),
            previewText: "A heartwarming narrative focused on community intervention success..."
            }
        ]);
      }, 1000);
  }

  return {
    artifacts,
    isLoading,
    error,
    deleteArtifact,
    exportArtifact,
    retryLoad,
    addArtifact
  };
}

// --- Component ---
export function ArtifactsPanel({ state }: { state: ReturnType<typeof useArtifactsPanelState> }) {
  const { artifacts, isLoading, error, deleteArtifact, exportArtifact, retryLoad } = state;

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
             {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-3 p-4 rounded-lg border bg-card opacity-80">
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
                <p className="text-xs text-muted-foreground mt-1">Please check your connection and try again.</p>
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
                Generated stories and reports will appear here. Ask the AI to draft something!
                </p>
            </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-background">
       <div className="p-4 border-b">
         <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
             Saved Items ({artifacts.length})
         </h4>
       </div>
      <ScrollArea className="flex-1 w-full h-full">
        <div className="p-4 space-y-3">
          {artifacts.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col gap-3 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-all w-full overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
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

                <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
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
                            <DropdownMenuItem onClick={() => deleteArtifact(item.id)} className="text-destructive focus:text-destructive">
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
