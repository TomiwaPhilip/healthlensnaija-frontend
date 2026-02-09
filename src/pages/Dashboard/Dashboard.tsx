import React, { useState, useEffect, useRef, useCallback } from "react";
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
  AlertCircle
} from "lucide-react";

// --- Types ---
interface StoryCard {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  status: string;
  preview: string;
}

const PAGE_SIZE = 9;
const API_URL = import.meta.env.VITE_API_URL ?? "/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [stories, setStories] = useState<StoryCard[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const formatDate = (value?: string) => {
    if (!value) {
      return "Unknown date";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const isEmpty = !isInitialLoading && !error && stories.length === 0;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchStories = useCallback(
    async (pageToLoad: number, append: boolean) => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be signed in to view stories.");
        setIsInitialLoading(false);
        setHasMore(false);
        return;
      }

      setIsFetching(true);
      setError(null);
      if (!append) {
        setIsInitialLoading(true);
      }

      try {
        const params = new URLSearchParams({
          page: String(pageToLoad),
          limit: String(PAGE_SIZE),
        });
        if (debouncedSearch) {
          params.set("q", debouncedSearch);
        }

        const response = await fetch(`${API_URL}/stories?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload?.message || "Failed to load stories");
        }

        const incoming = ((payload?.stories || payload?.data) ?? []).map((story: any) => ({
          id: story.id || story._id,
          title: story.title,
          status: story.status || "draft",
          preview: story.preview_text || story.preview || "",
          createdAt: story.createdAt || story.updatedAt,
          updatedAt: story.updatedAt || story.createdAt,
        })) as StoryCard[];

        setStories((prev) => {
          const next = append ? [...prev, ...incoming] : incoming;
          const deduped: StoryCard[] = [];
          const seen = new Set<string>();
          next.forEach((item) => {
            if (!item.id) {
              return;
            }
            if (!seen.has(item.id)) {
              seen.add(item.id);
              deduped.push(item);
            }
          });
          return deduped;
        });

        setPage(pageToLoad);
        const hasMoreFlag =
          typeof payload?.hasMore === "boolean"
            ? payload.hasMore
            : incoming.length === PAGE_SIZE;
        setHasMore(hasMoreFlag);
      } catch (err) {
        console.error("Failed to fetch stories", err);
        setError(err instanceof Error ? err.message : "Failed to load stories");
      } finally {
        setIsFetching(false);
        setIsInitialLoading(false);
      }
    },
    [debouncedSearch]
  );

  useEffect(() => {
    setStories([]);
    setPage(1);
    setHasMore(true);
    fetchStories(1, false);
  }, [debouncedSearch, fetchStories]);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const node = sentinelRef.current;
    if (node && hasMore) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isFetching) {
            fetchStories(page + 1, true);
          }
        },
        { rootMargin: "200px" }
      );

      observer.observe(node);
    }

    return () => {
      observer?.disconnect();
    };
  }, [fetchStories, hasMore, isFetching, page]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be signed in to delete stories.");
      return;
    }

    try {
      setError(null);
      const response = await fetch(`${API_URL}/stories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message || "Failed to delete story");
      }

      setStories((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete story", err);
      setError(err instanceof Error ? err.message : "Failed to delete story");
    }
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
        {isInitialLoading && (
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
        {!isInitialLoading && error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {isEmpty && (
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
        {!isInitialLoading && !error && stories.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
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
                            {formatDate(story.updatedAt || story.createdAt)}
                        </div>
                        {story.preview && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {story.preview}
                          </p>
                        )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
                        story.status === "published"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}>
                        {story.status === "published" ? "Published" : "Draft"}
                      </span>

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
              </div>
            ))}
          </div>
        )}

        {/* Infinite Scroll Sentinel & Loading */}
        {!isInitialLoading && !error && stories.length > 0 && (
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            {isFetching && hasMore && (
              <div className="text-sm text-muted-foreground">Loading more stories...</div>
            )}
            <div ref={sentinelRef} className="h-2 w-full" />
            {!hasMore && (
              <p className="text-xs text-muted-foreground">You've reached the end.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
