import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Send,
    Bot,
    User,
    Loader2,
    Mic,
    Sparkles,
    AlertCircle,
    RefreshCw,
    MessageSquarePlus,
    FilePlus
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: Date;
}

interface UseChatPanelArgs {
    storyId?: string | null;
    initialMessages?: unknown[];
}

function mapMessageDocument(doc: any): Message | null {
    if (!doc) {
        return null;
    }
    const id = doc._id || doc.id;
    if (!id) {
        return null;
    }
    return {
        id,
        role: (doc.role as MessageRole) || "assistant",
        content: doc.content || "",
        timestamp: new Date(doc.timestamp || doc.createdAt || Date.now()),
    };
}

export function useChatPanelState({ storyId, initialMessages = [] }: UseChatPanelArgs = {}) {
    const [messages, setMessages] = useState<Message[]>(() =>
        initialMessages
            .map(mapMessageDocument)
            .filter((message): message is Message => Boolean(message))
    );
    const [inputValue, setInputValue] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoading, setIsLoading] = useState(Boolean(storyId));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMessages(
            initialMessages
                .map(mapMessageDocument)
                .filter((message): message is Message => Boolean(message))
        );
    }, [initialMessages]);

    const fetchHistory = useCallback(async () => {
        if (!storyId) {
            setMessages([]);
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be signed in to load chat history.");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/stories/${storyId}/chat?limit=50`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const payload = await response.json().catch(() => []);
            if (!response.ok) {
                throw new Error(payload?.message || "Failed to load chat history");
            }
            setMessages(
                (Array.isArray(payload) ? payload : [])
                    .map(mapMessageDocument)
                    .filter((message): message is Message => Boolean(message))
            );
        } catch (historyError) {
            console.error("Failed to load chat history", historyError);
            setError(
                historyError instanceof Error ? historyError.message : "Failed to load chat history"
            );
        } finally {
            setIsLoading(false);
        }
    }, [storyId]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const sendMessage = async (event?: React.FormEvent) => {
        event?.preventDefault();
        if (!inputValue.trim() || isGenerating) {
            return;
        }
        if (!storyId) {
            setError("Create or select a story to start chatting.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be signed in to chat with the assistant.");
            return;
        }

        const trimmed = inputValue.trim();
        const optimisticId = `temp-${Date.now()}`;
        const optimisticMessage: Message = {
            id: optimisticId,
            role: "user",
            content: trimmed,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setInputValue("");
        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/stories/${storyId}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ message: trimmed }),
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(payload?.message || "Failed to send message");
            }

            const userMessage = mapMessageDocument(payload.userMessage) ?? optimisticMessage;
            const assistantMessage = mapMessageDocument(payload.assistantMessage);

            setMessages((prev) => {
                const withoutTemp = prev.filter((message) => message.id !== optimisticId);
                return assistantMessage
                    ? [...withoutTemp, userMessage, assistantMessage]
                    : [...withoutTemp, userMessage];
            });
        } catch (sendError) {
            console.error("Failed to send chat message", sendError);
            setMessages((prev) => prev.filter((message) => message.id !== optimisticId));
            setError(sendError instanceof Error ? sendError.message : "Failed to send message");
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        storyId,
        messages,
        inputValue,
        setInputValue,
        isGenerating,
        sendMessage,
        isLoading,
        error,
        retryLoad: fetchHistory,
    };
}

// --- Component ---
export function ChatPanel({
    state,
    onAddToArtifacts,
}: {
    state: ReturnType<typeof useChatPanelState>;
    onAddToArtifacts?: (title: string, content: string) => Promise<void> | void;
}) {
    const {
        storyId,
        messages,
        inputValue,
        setInputValue,
        isGenerating,
        sendMessage,
        isLoading,
        error,
        retryLoad,
    } = state;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isGenerating, isLoading]); // Added isLoading to dependencies

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Messages Area */}
      <ScrollArea className="flex-1 w-full p-4">
        <div className="flex flex-col gap-4 pb-4 max-w-3xl mx-auto w-full min-h-0">
            
            {/* Loading State */}
                        {isLoading && (
              <div className="space-y-4 py-4">
                  {[1, 2, 3].map((i) => (
                      <div key={i} className={cn("flex w-full gap-3", i % 2 === 0 ? "justify-end" : "justify-start")}>
                         {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                         <Skeleton className={cn("h-12 w-[60%] rounded-2xl", i % 2 === 0 ? "rounded-tr-sm" : "rounded-tl-sm")} />
                      </div>
                  ))}
              </div>
            )}

            {/* Error State */}
            {!isLoading && error && (
                <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center h-full">
                    <div className="bg-destructive/10 p-3 rounded-full">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-medium text-destructive">Connection Error</h3>
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                    <Button variant="outline" onClick={retryLoad}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry Connection
                    </Button>
                </div>
            )}

            {/* Empty State */}
              {!isLoading && !error && messages.length === 0 && (
                 <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 opacity-50">
                    <div className="bg-muted p-4 rounded-full">
                        <MessageSquarePlus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="font-medium">Information Awaits</h3>
                        <p className="text-sm text-muted-foreground">Start by asking a question related to your sources.</p>
                    </div>
                 </div>
            )}

            {/* Messages */}
            {!isLoading && !error && messages.map((msg) => (
                <div
                    key={msg.id}
                    className={cn(
                        "flex w-full gap-3",
                        msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                >
                    {/* Bot Avatar */}
                    {msg.role === "assistant" && (
                        <Avatar className="h-8 w-8 mt-0.5 border bg-primary/10">
                            <AvatarFallback><Bot className="h-4 w-4 text-primary" /></AvatarFallback>
                        </Avatar>
                    )}

                    <div
                        className={cn(
                            "relative px-4 py-3 text-sm shadow-sm max-w-[80%]",
                            msg.role === "user"
                                ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                                : "bg-muted text-foreground rounded-2xl rounded-tl-sm border"
                        )}
                    >
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                            <span className="text-[10px] opacity-50">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {msg.role === "assistant" && onAddToArtifacts && (
                                <Button
                                    variant="ghost" 
                                    size="sm" 
                                    className="group h-6 px-2 text-[10px] text-muted-foreground hover:bg-green-100 hover:text-green-700 gap-1.5 ml-auto transition-all duration-300 ease-in-out"
                                                                        onClick={() => onAddToArtifacts(
                                                                            `Insight: ${msg.content.slice(0, 48)}${
                                                                                msg.content.length > 48 ? "..." : ""
                                                                            }`,
                                                                            msg.content
                                                                        )}
                                >
                                    <FilePlus className="h-3 w-3" />
                                    <span className="">Add to Artifacts</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* User Avatar */}
                    {msg.role === "user" && (
                        <Avatar className="h-8 w-8 mt-0.5 border bg-muted">
                             <AvatarFallback><User className="h-4 w-4 text-muted-foreground" /></AvatarFallback>
                        </Avatar>
                    )}
                </div>
            ))}

            {isGenerating && (
                 <div className="flex w-full gap-3 justify-start">
                    <Avatar className="h-8 w-8 mt-0.5 border bg-primary/10">
                        <AvatarFallback><Bot className="h-4 w-4 text-primary" /></AvatarFallback>
                    </Avatar>
                    <div className="bg-muted border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                        <span className="h-2 w-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-primary/50 rounded-full animate-bounce"></span>
                    </div>
                 </div>
            )}
            <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-background border-t">
        <div className="max-w-3xl mx-auto w-full">
            <form 
                onSubmit={sendMessage}
                className={cn(
                    "relative flex items-end gap-2 bg-muted/30 p-2 rounded-xl border focus-within:ring-2 focus-within:ring-ring/10 transition-all",
                    (!storyId || isLoading || error) && "opacity-50 pointer-events-none"
                )}
            >
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask a question about your sources..."
                    disabled={isLoading || !!error || !storyId}
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2 h-auto min-h-[40px] max-h-[120px]"
                />
                
                <div className="flex items-center gap-1 shrink-0 pb-0.5">
                     { inputValue.length === 0 ? (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
                            disabled={!storyId}
                        >
                            <Mic className="h-4 w-4" />
                        </Button>
                     ) : (
                         <Button 
                            type="submit" 
                            size="icon"
                            disabled={isGenerating || !inputValue.trim() || !storyId}
                            className="h-8 w-8 rounded-full"
                        >
                             {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                     )}
                </div>
            </form>
            <div className="text-center mt-2">
                 <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                    <Sparkles className="h-3 w-3" /> 
                    AI can make mistakes. Check important info.
                 </p>
            </div>
        </div>
      </div>
    </div>
  );
}
