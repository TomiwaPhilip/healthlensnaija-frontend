import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Send, Bot, User, Loader2, Mic, Sparkles, AlertCircle, RefreshCw, MessageSquarePlus, FilePlus } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// --- Hook / Logic ---
export function useChatPanelState() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate initial load
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate network delay
    setTimeout(() => {
        // Randomly simulate error (10% chance) for demonstration
        const shouldFail = Math.random() < 0.1;
        
        if (shouldFail) {
            setError("Failed to connect to AI service.");
            setIsLoading(false);
        } else {
             setMessages([
                {
                  id: "welcome-1",
                  role: "assistant",
                  content: "Hello! I'm your Newsroom AI assistant. I can help you analyze your sources, draft stories, or answer questions about the data you've uploaded. How can I help you today?",
                  timestamp: new Date(),
                },
             ]);
             setIsLoading(false);
        }
    }, 1500);
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a simulated response. In the real application, this would claim to analyze the provided sources and generate a relevant answer based on the context.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsGenerating(false);
    }, 1500);
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isGenerating,
    sendMessage,
    isLoading,
    error,
    retryLoad: loadChatHistory
  };
}

// --- Component ---
export function ChatPanel({ state, onAddToArtifacts }: { 
    state: ReturnType<typeof useChatPanelState>,
    onAddToArtifacts?: (title: string, content: string) => void
}) {
  const { messages, inputValue, setInputValue, isGenerating, sendMessage, isLoading, error, retryLoad } = state;
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
                            {msg.role === 'assistant' && onAddToArtifacts && (
                                <Button
                                    variant="ghost" 
                                    size="sm" 
                                    className="group h-6 px-2 text-[10px] text-muted-foreground hover:bg-green-100 hover:text-green-700 gap-1.5 ml-auto transition-all duration-300 ease-in-out"
                                    onClick={() => onAddToArtifacts(
                                        `Insight: ${msg.content.slice(0, 20)}...`, 
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
                    (isLoading || error) && "opacity-50 pointer-events-none"
                )}
            >
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask a question about your sources..."
                    disabled={isLoading || !!error}
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2 h-auto min-h-[40px] max-h-[120px]"
                />
                
                <div className="flex items-center gap-1 shrink-0 pb-0.5">
                     { inputValue.length === 0 ? (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
                        >
                            <Mic className="h-4 w-4" />
                        </Button>
                     ) : (
                         <Button 
                            type="submit" 
                            size="icon"
                            disabled={isGenerating || !inputValue.trim()}
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
