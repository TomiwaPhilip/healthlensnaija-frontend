import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SourcesPanel, useSourcesPanelState } from "./components/SourcesPanel";
import { ChatPanel, useChatPanelState } from "./components/ChatPanel";
import { ArtifactsPanel, useArtifactsPanelState } from "./components/ArtifactsPanel";

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

const GenerateStory = () => {
  const sourcesPanelState = useSourcesPanelState();
  const chatPanelState = useChatPanelState();
  const artifactsPanelState = useArtifactsPanelState();
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

  const handleAddToArtifacts = (title: string, content: string) => {
      artifactsPanelState.addArtifact(title, content, "summary");
  };

  return (
    <div className="p-5 min-h-screen transition-colors duration-300 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-6">Newsroom</h1>

      {/* Mobile Tabs */}
      <div className="lg:hidden h-[calc(100vh-8rem)]">
        <Tabs defaultValue="sources" className="w-full h-full flex flex-col">
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
              : "w-[20%] min-w-[240px] mr-2 opacity-100"
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
              : "w-[25%] min-w-[280px] ml-2 opacity-100"
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
    </div>
  );
};

export default GenerateStory;
