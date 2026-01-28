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

type PanelProps = {
  title: string;
  description: string;
  className?: string;
  onToggle?: () => void;
  showToggle?: boolean;
  toggleIcon?: "left" | "right";
};

const NewsroomPanel = ({
  title,
  description,
  className,
  onToggle,
  showToggle = false,
  toggleIcon = "left",
}: PanelProps) => (
  <Card className={cn("flex h-full flex-col shadow-sm transition-all", className)}>
    <CardHeader className="flex flex-col space-y-0 pb-2 px-4 pt-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          {showToggle && toggleIcon === "left" && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 lg:hidden" // Only show on mobile or handle differently? Wait, design change.
              onClick={onToggle}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
        {showToggle && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggle}
            aria-label={`Collapse ${title}`}
            className="hidden h-8 w-8 text-muted-foreground hover:text-foreground lg:inline-flex"
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
    <CardContent className="flex-1 overflow-y-auto px-4 pb-4">
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-muted-foreground/40 bg-muted/40 p-4 text-sm text-muted-foreground">
        {description}
      </div>
    </CardContent>
  </Card>
);

const GenerateStory = () => {
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
              description="Add the sources list panel content here."
              showToggle={false}
            />
          </TabsContent>
          <TabsContent value="chat" className="mt-4 flex-1 h-full overflow-hidden">
            <NewsroomPanel
              title="Chat"
              description="Design the newsroom chat experience in this section."
              showToggle={false}
            />
          </TabsContent>
          <TabsContent value="artifacts" className="mt-4 flex-1 h-full overflow-hidden">
            <NewsroomPanel
              title="Artifacts"
              description="Surface generated artifacts and reports here."
              showToggle={false}
            />
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
            description="Add the sources list panel content here."
            onToggle={() => togglePanel("sources")}
            showToggle
            toggleIcon="left"
          />
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
            description="Design the newsroom chat experience in this section."
            className={cn(
              "transition-all duration-300",
              collapsedPanels.sources && "pl-14",
              collapsedPanels.artifacts && "pr-14"
            )}
          />
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
            description="Surface generated artifacts and reports here."
            onToggle={() => togglePanel("artifacts")}
            showToggle
            toggleIcon="right"
          />
        </div>
      </div>
    </div>
  );
};

export default GenerateStory;
