import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ResponseCardProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  tokenCount?: number;
  isTyping?: boolean;
  className?: string;
  messageId?: string;
  onTextToSpeech?: (messageId: string, text: string) => void;
  speakingMessageId?: string | null;
  translatedContent?: {
    en?: string;
    hi?: string;
    mr?: string;
  };
  currentLanguage?: 'en' | 'hi' | 'mr';
  onTranslate?: (messageId: string, targetLanguage: 'en' | 'hi' | 'mr') => void;
}

export function ResponseCard({ 
  role, 
  content, 
  timestamp, 
  tokenCount,
  isTyping = false,
  className,
  messageId,
  onTextToSpeech,
  speakingMessageId,
  translatedContent,
  currentLanguage = 'en',
  onTranslate
}: ResponseCardProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isComplete, setIsComplete] = useState(!isTyping);

  // Typing animation effect
  useEffect(() => {
    if (!isTyping || role === "user") {
      setDisplayedContent(content);
      setIsComplete(true);
      return;
    }

    setDisplayedContent("");
    setIsComplete(false);
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(typingInterval);
      }
    }, 20); // Speed of typing (ms per character)

    return () => clearInterval(typingInterval);
  }, [content, isTyping, role]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getTimeAgo = () => {
    if (!timestamp) return "";
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  };

  if (role === "user") {
    return (
      <div className={cn("flex justify-end group", className)}>
        <div className="rounded-xl bg-primary text-primary-foreground px-5 py-3.5 max-w-[85%] shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-[1.02]">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2 group", className)}>
      <div className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-xl hover:border-primary/20 hover:-translate-y-0.5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <h3 className="font-semibold text-foreground text-sm">Medical Analysis</h3>
            </div>
            {(timestamp || tokenCount) && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {timestamp && <span className="font-medium">{getTimeAgo()}</span>}
                {timestamp && tokenCount && <span>•</span>}
                {tokenCount && (
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {tokenCount} tokens
                  </span>
                )}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
            disabled={!isComplete}
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {displayedContent}
            {!isComplete && (
              <motion.span 
                className="inline-block w-0.5 h-4 bg-primary ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </p>
          {/* Action buttons for assistant responses */}
          {role === "assistant" && messageId && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* Speaker button */}
              {onTextToSpeech && (
                <button
                  onClick={() => onTextToSpeech(messageId, displayedContent)}
                  className={cn(
                    "p-2 rounded-full",
                    speakingMessageId === messageId
                      ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                  )}
                  disabled={!isComplete}
                >
                  {speakingMessageId === messageId ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
              )}
              
              {/* Translation buttons */}
              {onTranslate && (
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => onTranslate(messageId, 'en')}
                    className={cn(
                      "text-xs px-2 py-1 rounded-full border",
                      currentLanguage === 'en' 
                        ? "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300" 
                        : "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"
                    )}
                  >
                    English
                  </button>
                  <button
                    onClick={() => onTranslate(messageId, 'hi')}
                    className={cn(
                      "text-xs px-2 py-1 rounded-full border",
                      currentLanguage === 'hi' 
                        ? "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300" 
                        : "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"
                    )}
                  >
                    हिंदी
                  </button>
                  <button
                    onClick={() => onTranslate(messageId, 'mr')}
                    className={cn(
                      "text-xs px-2 py-1 rounded-full border",
                      currentLanguage === 'mr' 
                        ? "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300" 
                        : "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"
                    )}
                  >
                    मराठी
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}