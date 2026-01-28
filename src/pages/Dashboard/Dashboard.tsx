import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreVertical,
  Calendar,
  FileText,
  Trash2,
  AlertCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface Story {
  id: string;
  title: string;
  createdAt: Date;
  status: "published" | "draft";
  preview: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Mock Data Load ---
  useEffect(() => {
    const loadStories = async () => {
      setIsLoading(true);
      setError(null);
      
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock Data (Demo Mode: Always loaded)
      const mockStories: Story[] = [
        {
          id: "story-1",
          title: "Malaria Intervention Strategy 2026",
          createdAt: new Date("2026-01-25T10:00:00"),
          status: "published",
          preview: "Analysis of the effectiveness of new mosquito nets distribution in rural areas..."
        },
        {
          id: "story-2",
          title: "Maternal Health Statistics Q4 2025",
          createdAt: new Date("2026-01-20T14:30:00"),
          status: "draft",
          preview: "Draft report on improved maternal survival rates across three key states..."
        },
        {
          id: "story-3",
          title: "Primary Healthcare Funding Report",
          createdAt: new Date("2026-01-15T09:15:00"),
          status: "published",
          preview: "Breakdown of budget allocation for primary healthcare centers..."
        },
        {
          id: "story-4",
          title: "Vaccination Campaign Overview",
          createdAt: new Date("2026-01-10T11:45:00"),
          status: "draft",
          preview: "Initial data from the nationwide polio vaccination drive..."
        },
        {
          id: "story-5",
          title: "Community Health Outreach Program",
          createdAt: new Date("2026-01-05T16:20:00"),
          status: "published",
          preview: "Success stories from the recent community health outreach program in Lagos..."
        }
      ];

      setStories(mockStories);
      setIsLoading(false);
      
      // Uncomment to test empty state
      // setStories([]);

      // Uncomment to test error state
      // setError("Failed to load stories. Please try again.");
    };

    loadStories();
  }, []);

  // Filter stories based on search
  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setStories((prev) => prev.filter((s) => s.id !== id));
  };

  const handleStoryClick = (id: string) => {
    navigate(`/generate-story?id=${id}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Heading & Header Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your generated stories and reports
          </p>
        </div>
        <Button onClick={() => navigate("/generate-story")} className="sm:w-auto w-full">
          <Plus className="mr-2 h-4 w-4" /> New Story
        </Button>
      </div>

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stories..."
          className="pl-9 max-w-md bg-background text-foreground placeholder:text-muted-foreground border-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 3. Content Content */}
      <div className="space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {[1, 2, 3, 4, 5, 6].map((i) => (
               <div key={i} className="p-4 rounded-lg border bg-card space-y-3">
                 <div className="flex justify-between items-start">
                    <div className="space-y-2 w-full">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                 </div>
                 <div className="pt-4 border-t flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                 </div>
               </div>
             ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredStories.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg bg-muted/10">
            <div className="bg-muted p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No stories found</h3>
            <p className="text-muted-foreground mt-1 mb-6 max-w-sm">
              {searchQuery 
                ? `No results found for "${searchQuery}".` 
                : "You haven't created any stories yet. Start by creating your first story."}
            </p>
            {!searchQuery && (
                 <Button onClick={() => navigate("/generate-story")} variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Create Story
                 </Button>
            )}
          </div>
        )}

        {/* Loaded State: List/Grid of Cards */}
        {!isLoading && !error && filteredStories.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                onClick={() => handleStoryClick(story.id)}
                className="group relative flex flex-col p-5 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
              >
                {/* Card Content simplified */}
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 min-w-0 flex-1">
                        <h3 className="font-semibold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-3" title={story.title}>
                             {story.title}
                        </h3>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1.5 h-3.5 w-3.5" />
                            {story.createdAt.toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </div>
                    </div>

                    <div onClick={(e) => e.stopPropagation()} className="-mt-1 -mr-2 flex-shrink-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStoryClick(story.id)}>
                                     Open Story
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={(e) => handleDelete(e, story.id)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
