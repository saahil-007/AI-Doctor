import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ModelCard } from "./ModelCard";
import { ResponseCard } from "./ResponseCard";
import { Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  tokenCount?: number;
  isTyping?: boolean;
}

interface ModelState {
  name: string;
  icon: string;
  messages: Message[];
  isLoading: boolean;
}

interface ArenaColumnProps {
  model: ModelState;
  scrollSync?: boolean;
  syncGroup?: string;
  className?: string;
  onTextToSpeech?: (messageId: string, text: string) => void;
  speakingMessageId?: string | null;
  onTranslate?: (messageId: string, targetLanguage: 'en' | 'hi' | 'mr') => void;
}

export function ArenaColumn({ model, scrollSync, syncGroup, className, onTextToSpeech, speakingMessageId, onTranslate }: ArenaColumnProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current && !isScrollingRef.current) {
      // Smooth scroll to bottom
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [model.messages]);

  // Handle scroll sync
  const handleScroll = () => {
    if (!scrollSync || !scrollRef.current || isScrollingRef.current) return;

    const scrollPercentage = 
      scrollRef.current.scrollTop / 
      (scrollRef.current.scrollHeight - scrollRef.current.clientHeight);

    // Broadcast scroll position to other columns
    const event = new CustomEvent('arena-scroll-sync', {
      detail: { scrollPercentage, source: scrollRef.current }
    });
    window.dispatchEvent(event);
  };

  // Listen for scroll sync events
  useEffect(() => {
    if (!scrollSync || !scrollRef.current) return;

    const handleSyncScroll = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { scrollPercentage, source } = customEvent.detail;

      if (source === scrollRef.current || !scrollRef.current) return;

      isScrollingRef.current = true;
      const targetScroll = 
        scrollPercentage * 
        (scrollRef.current.scrollHeight - scrollRef.current.clientHeight);
      
      scrollRef.current.scrollTop = targetScroll;

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    };

    window.addEventListener('arena-scroll-sync', handleSyncScroll);
    return () => window.removeEventListener('arena-scroll-sync', handleSyncScroll);
  }, [scrollSync]);

  return (
    <div className={cn("flex flex-col h-full bg-gradient-to-b from-background to-muted/20", className)}>
      {/* Model header */}
      <ModelCard name={model.name} icon={model.icon} />

      {/* Messages area with proper scroll */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 space-y-4"
        style={{ 
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--primary) transparent'
        }}
      >
        <AnimatePresence mode="popLayout">
          {model.messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.05,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
            >
              <ResponseCard
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
                tokenCount={message.tokenCount}
                isTyping={message.isTyping}
                messageId={message.id}
                onTextToSpeech={onTextToSpeech}
                speakingMessageId={speakingMessageId}
                onTranslate={onTranslate}
                translatedContent={(message as any).translatedContent}
                currentLanguage={(message as any).currentLanguage}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator with pulse animation */}
        {model.isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-3 text-muted-foreground px-4 py-3 rounded-lg bg-muted/30"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="text-sm font-medium">Analyzing medical query...</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}