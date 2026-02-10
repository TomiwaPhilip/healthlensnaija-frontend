import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SourcesPanel, useSourcesPanelState } from "./components/SourcesPanel";
import { ChatPanel, useChatPanelState } from "./components/ChatPanel";
import { ArtifactsPanel, useArtifactsPanelState } from "./components/ArtifactsPanel";
import CreateStoryDialog from "@/components/stories/CreateStoryDialog";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

interface StoryWorkspaceData {
  id: string;
  title: string;
  status: string;
  preview_text?: string;
  metadata?: Record<string, unknown>;
  artifacts: unknown[];
  sources: unknown[];
  chat: unknown[];
}

type PanelProps = {
  title: string;
  description?: string;
  className?: string;
  onToggle?: () => void;
  showToggle?: boolean;
  toggleIcon?: "left" | "right";
  children?: React.ReactNode;
};

const NewsroomPanel = ({
  title,
  description,
  className,
  onToggle,
  showToggle = false,
  toggleIcon = "left",
  children
}: PanelProps) => (
  <Card className={cn("flex h-full flex-col shadow-sm transition-all overflow-hidden", className)}>
    <CardHeader className="flex flex-col space-y-0 pb-3 px-4 pt-4 flex-shrink-0 border-b">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          {showToggle && toggleIcon === "left" && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 lg:hidden"
              onClick={onToggle}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </div>
        {showToggle && (
           <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggle}
            aria-label={`Collapse ${title}`}
            className="hidden h-6 w-6 text-muted-foreground hover:text-foreground lg:inline-flex"
          >
            {toggleIcon === "left" ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent className="flex-1 min-h-0 p-0 overflow-hidden relative">
       {children ? children : (
         <div className="p-4">
           <p className="text-sm text-muted-foreground">{description}</p>
         </div>
       )}
    </CardContent>
  </Card>
);

// --- Main Logic Component ---
const NewsroomContent = ({
  storyId,
  storyData,
}: {
  storyId: string;
  storyData: StoryWorkspaceData;
}) => {
  const sourcesPanelState = useSourcesPanelState({
    storyId,
    initialSources: storyData.sources,
  });
  const chatPanelState = useChatPanelState({
    storyId,
    initialMessages: storyData.chat,
  });
  const artifactsPanelState = useArtifactsPanelState({
    storyId,
    initialArtifacts: storyData.artifacts,
  });
  const [collapsedPanels, setCollapsedPanels] = useState({
    sources: false,
    artifacts: false,
  });

  const togglePanel = (panel: keyof typeof collapsedPanels) => {
    setCollapsedPanels((prev) => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

  const handleAddToArtifacts = async (title: string, content: string) => {
    try {
      await artifactsPanelState.addArtifact(title, content, "summary");
    } catch (error) {
      console.error("Failed to save artifact from chat", error);
    }
  };

  return (
    <>
      {/* Mobile Tabs */}
      <div className="lg:hidden h-[calc(100vh-8rem)]">
        <Tabs defaultValue="chat" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
          </TabsList>
          <TabsContent value="sources" className="mt-4 flex-1 h-full overflow-hidden">
            <NewsroomPanel
              title="Sources"
              showToggle={false}
            >
              <SourcesPanel state={sourcesPanelState} />
            </NewsroomPanel>
          </TabsContent>
          <TabsContent value="chat" className="mt-4 flex-1 h-full overflow-hidden">
            <NewsroomPanel
              title="Chat"
              showToggle={false}
            >
              <ChatPanel state={chatPanelState} onAddToArtifacts={handleAddToArtifacts} />
            </NewsroomPanel>
          </TabsContent>
          <TabsContent value="artifacts" className="mt-4 flex-1 h-full overflow-hidden">
            <NewsroomPanel
              title="Artifacts"
              showToggle={false}
            >
              <ArtifactsPanel state={artifactsPanelState} />
            </NewsroomPanel>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop Columns */}
      <div className="hidden h-[calc(100vh-8rem)] w-full lg:flex items-stretch">
        {/* Sources Panel (Left) */}
        <div
          className={cn(
            "relative hidden h-full transition-all duration-300 ease-in-out lg:block",
            collapsedPanels.sources
              ? "w-0 min-w-0 opacity-0 overflow-hidden"
              : "w-[20%] min-w-[240px] mr-2 opacity-100 overflow-hidden"
          )}
        >
          <NewsroomPanel
            title="Sources"
            onToggle={() => togglePanel("sources")}
            showToggle
            toggleIcon="left"
          >
            <SourcesPanel state={sourcesPanelState} />
          </NewsroomPanel>
        </div>

        {/* Chat Panel (Center) */}
        <div className="relative hidden h-full flex-1 lg:flex flex-col min-w-0">
          {/* Expand Buttons Overlay */}
          <div className="absolute top-3 left-0 right-0 z-10 flex justify-between px-2 pointer-events-none">
            <div className="pointer-events-auto">
              {collapsedPanels.sources && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => togglePanel("sources")}
                  aria-label="Show Sources"
                  className="h-8 w-8 shadow-sm transition-opacity hover:bg-muted"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="pointer-events-auto">
              {collapsedPanels.artifacts && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => togglePanel("artifacts")}
                  aria-label="Show Artifacts"
                  className="h-8 w-8 shadow-sm transition-opacity hover:bg-muted"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <NewsroomPanel
            title="Chat"
            className={cn(
              "transition-all duration-300",
              collapsedPanels.sources && "pl-14",
              collapsedPanels.artifacts && "pr-14"
            )}
          >
            <ChatPanel state={chatPanelState} onAddToArtifacts={handleAddToArtifacts} />
          </NewsroomPanel>
        </div>

        {/* Artifacts Panel (Right) */}
        <div
          className={cn(
            "relative hidden h-full transition-all duration-300 ease-in-out lg:block",
            collapsedPanels.artifacts
              ? "w-0 min-w-0 opacity-0 overflow-hidden"
              : "w-[25%] min-w-[280px] ml-2 opacity-100 overflow-hidden"
          )}
        >
          <NewsroomPanel
            title="Artifacts"
            onToggle={() => togglePanel("artifacts")}
            showToggle
            toggleIcon="right"
          >
            <ArtifactsPanel state={artifactsPanelState} />
          </NewsroomPanel>
        </div>
      </div>
    </>
  );
};

const GenerateStory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const storyId = searchParams.get("id");
  const [storyData, setStoryData] = useState<StoryWorkspaceData | null>(null);
  const [isStoryLoading, setIsStoryLoading] = useState(false);
  const [storyError, setStoryError] = useState<string | null>(null);

  const fetchStory = useCallback(
    async (targetId: string) => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStoryError("You must be signed in to open a story workspace.");
        setStoryData(null);
        setIsStoryLoading(false);
        return;
      }

      try {
        setIsStoryLoading(true);
        setStoryError(null);
        const response = await fetch(`${API_URL}/stories/${targetId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload?.message || "Failed to load story workspace");
        }

        setStoryData({
          id: payload.id || payload._id || targetId,
          title: payload.title || "Untitled Story",
          status: payload.status || "draft",
          preview_text: payload.preview_text,
          metadata: payload.metadata,
          artifacts: Array.isArray(payload.artifacts) ? payload.artifacts : [],
          sources: Array.isArray(payload.sources) ? payload.sources : [],
          chat: Array.isArray(payload.chat) ? payload.chat : [],
        });
      } catch (error) {
        console.error("Failed to fetch story", error);
        setStoryError(error instanceof Error ? error.message : "Failed to load story");
        setStoryData(null);
      } finally {
        setIsStoryLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!storyId) {
      setStoryData(null);
      setIsStoryLoading(false);
      setStoryError(null);
      return;
    }
    fetchStory(storyId);
  }, [fetchStory, storyId]);

  const handleStoryCreated = (story: { id?: string; _id?: string }) => {
    const newId = story.id || story._id;
    if (newId) {
      setSearchParams({ id: newId });
    }
  };

  return (
    <div className="p-5 min-h-screen transition-colors duration-300 bg-background text-foreground space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Newsroom</h1>
          <p className="text-sm text-muted-foreground">
            Upload sources, chat with the assistant, and publish artifacts in one workspace.
          </p>
        </div>
        <CreateStoryDialog
          trigger={<Button className="gap-2">Create Story</Button>}
          onSuccess={handleStoryCreated}
        />
      </div>

      {!storyId && (
        <div className="border rounded-xl p-10 text-center space-y-4 bg-muted/10">
          <h2 className="text-xl font-semibold">No story selected</h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Create a new story workspace or select an existing one from the dashboard to begin researching, chatting with the assistant, and building artifacts.
          </p>
        </div>
      )}

      {storyId && isStoryLoading && (
        <div className="space-y-4">
          <Skeleton className="h-20 rounded-xl" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      )}

      {storyId && !isStoryLoading && storyError && (
        <Alert variant="destructive">
          <AlertTitle>Unable to load story</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{storyError}</span>
            <Button size="sm" variant="outline" onClick={() => fetchStory(storyId)}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {storyId && !isStoryLoading && storyData && (
        <>
          <div className="border rounded-xl p-4 flex flex-col gap-1">
            <span className="text-xs uppercase text-muted-foreground">Active Story</span>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-xl font-semibold">{storyData.title}</h2>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full border w-fit",
                  storyData.status === "published"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                )}
              >
                {storyData.status === "published" ? "Published" : "Draft"}
              </span>
            </div>
          </div>

          <NewsroomContent storyId={storyId} storyData={storyData} key={storyId} />
        </>
      )}
    </div>
  );
};

export default GenerateStory;
