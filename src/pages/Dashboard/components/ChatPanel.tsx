import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Send,
    Bot,
    User,
    ChevronDown,
    Loader2,
    Sparkles,
    AlertCircle,
    RefreshCw,
    MessageSquarePlus,
    FilePlus,
    Search,
    Globe,
    FileText,
    Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { marked } from "marked";
import DOMPurify from "dompurify";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

// Configure marked for safe rendering with external links opening in new tab
const renderer = new marked.Renderer();
renderer.link = ({ href, title, text }) => {
    const titleAttr = title ? ` title="${title}"` : "";
    return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};
marked.setOptions({ breaks: true, gfm: true, renderer });

function renderMarkdown(content: string): string {
    const raw = marked.parse(content || "") as string;
    return DOMPurify.sanitize(raw, {
        ADD_ATTR: ["target", "rel"],
        ALLOW_TAGS: [
            "p","br","strong","em","b","i","u","s","del",
            "h1","h2","h3","h4","h5","h6",
            "ul","ol","li","blockquote","pre","code",
            "a","table","thead","tbody","tr","th","td","hr","img",
        ],
    });
}

function MarkdownContent({ content }: { content: string }) {
    const html = useMemo(() => renderMarkdown(content), [content]);
    return (
        <div
            className="prose prose-sm dark:prose-invert max-w-none leading-relaxed w-full min-w-0 overflow-hidden
                [&_a]:text-primary [&_a]:underline [&_a:hover]:text-primary/80 [&_a]:break-all
                [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2
                [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1.5
                [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1
                [&_p]:my-1.5
                [&_ul]:my-1.5 [&_ul]:pl-5 [&_ul]:list-disc
                [&_ol]:my-1.5 [&_ol]:pl-5 [&_ol]:list-decimal
                [&_li]:my-0.5
                [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
                [&_code]:bg-muted/60 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs
                [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto
                [&_table]:w-full [&_table]:text-xs [&_th]:bg-muted [&_th]:p-2 [&_td]:p-2 [&_td]:border [&_th]:border
                [&_img]:max-w-full [&_img]:h-auto
                [&_hr]:my-3"
            style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

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
    const [agentStatus, setAgentStatus] = useState<string | null>(null);
    const [sourcesOnly, setSourcesOnly] = useState(false);
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
        const streamingId = `streaming-${Date.now()}`;
        const optimisticMessage: Message = {
            id: optimisticId,
            role: "user",
            content: trimmed,
            timestamp: new Date(),
        };
        const streamingMessage: Message = {
            id: streamingId,
            role: "assistant",
            content: "",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, optimisticMessage, streamingMessage]);
        setInputValue("");
        setIsGenerating(true);
        setAgentStatus("Sending request…");
        setError(null);

        try {
            const response = await fetch(`${API_URL}/stories/${storyId}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "text/event-stream",
                },
                body: JSON.stringify({ message: trimmed, sourcesOnly }),
            });

            if (!response.ok) {
                const errPayload = await response.json().catch(() => ({}));
                throw new Error(errPayload?.message || "Failed to send message");
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error("Streaming not supported by browser");
            }

            const decoder = new TextDecoder();
            let buffer = "";
            let accumulated = "";
            let finalPayload: any = null;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // Parse SSE frames from buffer
                const parts = buffer.split("\n\n");
                // Keep the last (possibly incomplete) chunk in the buffer
                buffer = parts.pop() || "";

                for (const part of parts) {
                    let eventType = "";
                    let dataStr = "";

                    for (const line of part.split("\n")) {
                        if (line.startsWith("event: ")) {
                            eventType = line.slice(7).trim();
                        } else if (line.startsWith("data: ")) {
                            dataStr += line.slice(6);
                        }
                    }

                    if (!eventType || !dataStr) continue;

                    try {
                        const parsed = JSON.parse(dataStr);

                        if (eventType === "token" && parsed.token) {
                            accumulated += parsed.token;
                            const snapshot = accumulated;
                            setAgentStatus(null);
                            setMessages((prev) =>
                                prev.map((msg) =>
                                    msg.id === streamingId
                                        ? { ...msg, content: snapshot }
                                        : msg
                                )
                            );
                        } else if (eventType === "complete") {
                            finalPayload = parsed;
                        } else if (eventType === "status" && parsed.status) {
                            setAgentStatus(parsed.status);
                        } else if (eventType === "error") {
                            throw new Error(parsed.message || "Streaming error");
                        }
                    } catch (parseErr) {
                        if (parseErr instanceof Error && parseErr.message !== "Streaming error") {
                            console.warn("SSE parse error", parseErr);
                        } else {
                            throw parseErr;
                        }
                    }
                }
            }

            // Replace optimistic + streaming messages with final persisted ones
            if (finalPayload) {
                const userMsg = mapMessageDocument(finalPayload.userMessage) ?? optimisticMessage;
                const assistantMsg = mapMessageDocument(finalPayload.assistantMessage);

                setMessages((prev) => {
                    const cleaned = prev.filter(
                        (msg) => msg.id !== optimisticId && msg.id !== streamingId
                    );
                    return assistantMsg
                        ? [...cleaned, userMsg, assistantMsg]
                        : [...cleaned, userMsg];
                });
            } else if (accumulated) {
                // No complete event but we got tokens — keep the streamed content
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === optimisticId
                            ? { ...msg, id: optimisticId }
                            : msg.id === streamingId
                              ? { ...msg, content: accumulated }
                              : msg
                    )
                );
            }
        } catch (sendError) {
            console.error("Failed to send chat message", sendError);
            setMessages((prev) =>
                prev.filter((msg) => msg.id !== optimisticId && msg.id !== streamingId)
            );
            setError(sendError instanceof Error ? sendError.message : "Failed to send message");
        } finally {
            setIsGenerating(false);
            setAgentStatus(null);
        }
    };

    return {
        storyId,
        messages,
        inputValue,
        setInputValue,
        isGenerating,
        agentStatus,
        sourcesOnly,
        setSourcesOnly,
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
        agentStatus,
        sourcesOnly,
        setSourcesOnly,
        sendMessage,
        isLoading,
        error,
        retryLoad,
    } = state;
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const scrollViewportRef = useRef<HTMLDivElement | null>(null);
    const bottomAnchorRef = useRef<HTMLDivElement>(null);
    const shouldAutoScrollRef = useRef(true);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);

    const updateScrollState = useCallback(() => {
        const viewport = scrollViewportRef.current;
        if (!viewport) {
            return;
        }

        const distanceFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
        const isNearBottom = distanceFromBottom <= 120;

        shouldAutoScrollRef.current = isNearBottom;
        setShowScrollToBottom(!isNearBottom && viewport.scrollHeight > viewport.clientHeight + 80);
    }, []);

    const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
        const viewport = scrollViewportRef.current;

        if (viewport) {
            viewport.scrollTo({
                top: viewport.scrollHeight,
                behavior,
            });
        } else if (bottomAnchorRef.current) {
            bottomAnchorRef.current.scrollIntoView({ behavior });
        }

        shouldAutoScrollRef.current = true;
        setShowScrollToBottom(false);
    }, []);

    useEffect(() => {
        const scrollArea = scrollAreaRef.current;
        if (!scrollArea) {
            return;
        }

        const viewport = scrollArea.querySelector("[data-radix-scroll-area-viewport]");
        if (!(viewport instanceof HTMLDivElement)) {
            return;
        }

        scrollViewportRef.current = viewport;
        updateScrollState();

        const handleScroll = () => updateScrollState();
        viewport.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);

        return () => {
            viewport.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
            scrollViewportRef.current = null;
        };
    }, [updateScrollState]);

    useEffect(() => {
        if (shouldAutoScrollRef.current) {
            scrollToBottom(messages.length ? "smooth" : "auto");
            return;
        }

        updateScrollState();
    }, [messages, isGenerating, isLoading, scrollToBottom, updateScrollState]);

  return (
        <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Messages Area */}
                        <ScrollArea ref={scrollAreaRef} className="flex-1 w-full min-w-0">
                <div className="flex flex-col gap-2.5 pb-3 max-w-3xl mx-auto w-full min-h-0 px-3">
            
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
            {!isLoading && !error && messages.filter((msg) => msg.role !== "assistant" || msg.content).map((msg) => (
                <div
                    key={msg.id}
                    className={cn(
                        "flex w-full gap-2 min-w-0 overflow-hidden",
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
                            "relative px-3 py-2.5 text-sm shadow-sm max-w-[85%] min-w-0 overflow-hidden",
                            msg.role === "user"
                                ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                                : "bg-muted text-foreground rounded-2xl rounded-tl-sm border"
                        )}
                    >
                        {msg.role === "assistant" ? (
                            <MarkdownContent content={msg.content} />
                        ) : (
                            <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                        )}
                        {msg.role === "assistant" && onAddToArtifacts && (
                            <div className="mt-1.5 flex justify-end">
                                <Button
                                    variant="ghost" 
                                    size="sm" 
                                    className="group h-6 px-2 text-[10px] text-muted-foreground hover:bg-green-100 hover:text-green-700 gap-1.5 transition-all duration-300 ease-in-out"
                                    onClick={() => onAddToArtifacts(
                                        `Insight: ${msg.content.slice(0, 48)}${
                                            msg.content.length > 48 ? "..." : ""
                                        }`,
                                        msg.content
                                    )}
                                >
                                    <FilePlus className="h-3 w-3" />
                                    <span>Add to Artifacts</span>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* User Avatar */}
                    {msg.role === "user" && (
                        <Avatar className="h-8 w-8 mt-0.5 border bg-muted">
                             <AvatarFallback><User className="h-4 w-4 text-muted-foreground" /></AvatarFallback>
                        </Avatar>
                    )}
                </div>
            ))}

            {isGenerating && (!messages.length || !messages[messages.length - 1]?.content) && (
                      <div className="flex w-full gap-2 justify-start">
                    <Avatar className="h-8 w-8 mt-0.5 border bg-primary/10">
                        <AvatarFallback><Bot className="h-4 w-4 text-primary" /></AvatarFallback>
                    </Avatar>
                          <div className="bg-muted border rounded-2xl rounded-tl-sm px-3 py-2.5 max-w-[85%]">
                        <div className="flex items-center gap-2">
                            {agentStatus?.includes("source") ? (
                                <Search className="h-3.5 w-3.5 text-primary animate-pulse" />
                            ) : agentStatus?.includes("web") ? (
                                <Globe className="h-3.5 w-3.5 text-primary animate-pulse" />
                            ) : agentStatus?.includes("Extracting") ? (
                                <FileText className="h-3.5 w-3.5 text-primary animate-pulse" />
                            ) : (
                                <Brain className="h-3.5 w-3.5 text-primary animate-pulse" />
                            )}
                            <p className="text-sm text-muted-foreground italic leading-relaxed">
                                {agentStatus || "Gathering sources and data…"}
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="h-1.5 w-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-1.5 w-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-1.5 w-1.5 bg-primary/50 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                 </div>
            )}
                        <div ref={bottomAnchorRef} />
        </div>
      </ScrollArea>

            {showScrollToBottom && (
                <div className="absolute bottom-24 right-5 z-20">
                    <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => scrollToBottom("smooth")}
                        className="h-10 w-10 rounded-full border bg-background/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80"
                        aria-label="Scroll to bottom"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>
            )}

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
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    placeholder="Ask a question about your sources..."
                    disabled={isLoading || !!error || !storyId}
                    rows={1}
                    className="flex-1 resize-none border-0 bg-transparent focus:outline-none focus:ring-0 px-2 py-2 min-h-[40px] max-h-[120px] text-sm placeholder:text-muted-foreground disabled:opacity-50"
                    style={{ fieldSizing: 'content' } as React.CSSProperties}
                />
                
                <div className="flex items-center gap-1 shrink-0 pb-0.5">
                     <Button 
                        type="submit" 
                        size="icon"
                        disabled={isGenerating || !inputValue.trim() || !storyId}
                        className="h-8 w-8 rounded-full"
                    >
                         {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </div>
            </form>
            <div className="flex items-center justify-between mt-2">
                 <label className="flex items-center gap-2 cursor-pointer select-none">
                    <Switch
                        checked={sourcesOnly}
                        onCheckedChange={setSourcesOnly}
                        className="h-4 w-7 data-[state=checked]:bg-green-600 [&>span]:h-3 [&>span]:w-3"
                    />
                    <span className="text-[11px] text-muted-foreground">
                        {sourcesOnly ? "Using uploaded sources only" : "Sources + web search"}
                    </span>
                 </label>
                 <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> 
                    AI can make mistakes. Check important info.
                 </p>
            </div>
        </div>
      </div>
    </div>
  );
}
