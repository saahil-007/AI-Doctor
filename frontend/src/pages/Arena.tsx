import { useState, useRef, useEffect, useCallback } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, MessageSquare, Settings, LogOut, ArrowLeftRight, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { AIInput } from "@/components/ui/ai-input";
import { ArenaColumn } from "@/components/arena/ArenaColumn";
import { Switch } from "../components/ui/switch";
import { Label } from "@/components/ui/label";

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

export default function Arena() {
  const [open, setOpen] = useState(false);
  const [scrollSync, setScrollSync] = useState(false);
  // State to track which message is currently being spoken
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  // Ref to store available voices
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  
  // Three separate model states with isolated memory
  const [model1, setModel1] = useState<ModelState>({
    name: "Gemini 2.5 Flash",
    icon: "✨",
    messages: [{
      id: "1",
      role: "assistant",
      content: "Hello! I'm Dr. Vaani, powered by Gemini 2.5 Flash. I'm ready to assist you with your medical questions. Please tell me your age to get started."
    }],
    isLoading: false
  });

  const [model2, setModel2] = useState<ModelState>({
    name: "GLM 4.5",
    icon: "🤖",
    messages: [{
      id: "1",
      role: "assistant",
      content: "Hi! I'm Dr. Vaani, powered by GLM 4.5. I'm here to help with your health concerns. Could you please share your age with me?"
    }],
    isLoading: false
  });

  const [model3, setModel3] = useState<ModelState>({
    name: "GPT-3.5 Turbo",
    icon: "🧠",
    messages: [{
      id: "1",
      role: "assistant",
      content: "Greetings! I'm Dr. Vaani, powered by GPT-3.5 Turbo. I'm your AI medical assistant. To begin, may I know your age?"
    }],
    isLoading: false
  });

  // Function to load available voices
  const loadVoices = useCallback(() => {
    if ('speechSynthesis' in window) {
      // Get the available voices
      const voices = window.speechSynthesis.getVoices();
      voicesRef.current = voices;
      
      // If voices are not yet loaded, wait for the voiceschanged event
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          voicesRef.current = window.speechSynthesis.getVoices();
        };
      }
    }
  }, []);

  // Load voices when component mounts
  useEffect(() => {
    loadVoices();
  }, [loadVoices]);

  const handleSendMessage = async (input: string) => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    // Add user message to all models
    setModel1(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }));
    setModel2(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }));
    setModel3(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }));

    try {
      // Call the backend API for arena responses
      const response = await fetch('/api/arena', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          user_id: 'default_user'
        })
      });

      // Check if the response is ok
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Backend API not found (404). Please make sure the backend server is running and the proxy configuration is correct.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if the response has content
      const responseText = await response.text();
      if (!responseText) {
        throw new Error('Empty response from server');
      }

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}`);
      }
      
      if (data.responses) {
        // Add responses from all models
        const response1: Message = {
          id: `${Date.now()}-1`,
          role: "assistant",
          content: data.responses.gemini,
          timestamp: new Date(),
          tokenCount: 200,
          isTyping: false
        };
        setModel1(prev => ({
          ...prev,
          messages: [...prev.messages, response1],
          isLoading: false
        }));

        const response2: Message = {
          id: `${Date.now()}-2`,
          role: "assistant",
          content: data.responses.glm,
          timestamp: new Date(),
          tokenCount: 200,
          isTyping: false
        };
        setModel2(prev => ({
          ...prev,
          messages: [...prev.messages, response2],
          isLoading: false
        }));

        const response3: Message = {
          id: `${Date.now()}-3`,
          role: "assistant",
          content: data.responses.openrouter,
          timestamp: new Date(),
          tokenCount: 200,
          isTyping: false
        };
        setModel3(prev => ({
          ...prev,
          messages: [...prev.messages, response3],
          isLoading: false
        }));
      } else {
        // Handle error case with simulated responses
        const response1: Message = {
          id: `${Date.now()}-1`,
          role: "assistant",
          content: data.error || "Error: Could not get response from models.",
          timestamp: new Date(),
          tokenCount: 0,
          isTyping: false
        };
        setModel1(prev => ({
          ...prev,
          messages: [...prev.messages, response1],
          isLoading: false
        }));

        const response2: Message = {
          id: `${Date.now()}-2`,
          role: "assistant",
          content: data.error || "Error: Could not get response from models.",
          timestamp: new Date(),
          tokenCount: 0,
          isTyping: false
        };
        setModel2(prev => ({
          ...prev,
          messages: [...prev.messages, response2],
          isLoading: false
        }));

        const response3: Message = {
          id: `${Date.now()}-3`,
          role: "assistant",
          content: data.error || "Error: Could not get response from models.",
          timestamp: new Date(),
          tokenCount: 0,
          isTyping: false
        };
        setModel3(prev => ({
          ...prev,
          messages: [...prev.messages, response3],
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error with error responses
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      
      // If the error is related to JSON parsing, provide a more helpful message
      const displayErrorMessage = errorMessage.includes('JSON') || errorMessage.includes('404') ? 
        "Failed to connect to the AI models. Please make sure the backend server is running and try again." : 
        `Error: ${errorMessage}`;
      
      const response1: Message = {
        id: `${Date.now()}-1`,
        role: "assistant",
        content: displayErrorMessage,
        timestamp: new Date(),
        tokenCount: 0,
        isTyping: false
      };
      setModel1(prev => ({
        ...prev,
        messages: [...prev.messages, response1],
        isLoading: false
      }));

      const response2: Message = {
        id: `${Date.now()}-2`,
        role: "assistant",
        content: displayErrorMessage,
        timestamp: new Date(),
        tokenCount: 0,
        isTyping: false
      };
      setModel2(prev => ({
        ...prev,
        messages: [...prev.messages, response2],
        isLoading: false
      }));

      const response3: Message = {
        id: `${Date.now()}-3`,
        role: "assistant",
        content: displayErrorMessage,
        timestamp: new Date(),
        tokenCount: 0,
        isTyping: false
      };
      setModel3(prev => ({
        ...prev,
        messages: [...prev.messages, response3],
        isLoading: false
      }));
    }
  };

  // Function to select appropriate voice - modified to always use Heera
  const selectVoice = (text: string) => {
    const voices = voicesRef.current;
    
    if (voices.length > 0) {
      // Always look for Microsoft Heera voice regardless of text content
      const heeraVoice = voices.find(voice => 
        voice.name.includes('Heera') && voice.lang.includes('hi')
      );
      
      return heeraVoice || null;
    }
    
    return null;
  };

  // Function to handle text-to-speech for a message using Web Speech API directly
  const handleTextToSpeech = async (messageId: string, text: string) => {
    // If this message is already being spoken, stop it
    if (speakingMessageId === messageId) {
      try {
        // Stop the speech synthesis
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        
        // Call backend to stop speech (optional)
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
        const stopEndpoint = window.location.hostname === 'localhost' ? `${baseUrl}/stop-speech` : '/api/stop-speech';
        
        await fetch(stopEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messageId }),
        });
      } catch (error) {
        console.error("Error stopping speech:", error);
      }
      setSpeakingMessageId(null);
      return;
    }

    // If another message is being spoken, stop it first
    if (speakingMessageId) {
      try {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
        const stopEndpoint = window.location.hostname === 'localhost' ? `${baseUrl}/stop-speech` : '/api/stop-speech';
        
        await fetch(stopEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messageId: speakingMessageId }),
        });
      } catch (error) {
        console.error("Error stopping previous speech:", error);
      }
    }

    // Set this message as the one currently being spoken
    setSpeakingMessageId(messageId);

    try {
      // First, get the speech data from the backend
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const ttsEndpoint = window.location.hostname === 'localhost' ? `${baseUrl}/text-to-speech` : '/api/text-to-speech';
      
      const response = await fetch(ttsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          messageId: messageId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Use Web Speech API directly
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Always use Hindi language and Heera voice for all text
        utterance.lang = 'hi-IN';
        
        // Select Heera voice (this will always be used now)
        const preferredVoice = selectVoice(text);
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        // Set speech properties for better quality
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Event handlers
        utterance.onend = () => {
          setSpeakingMessageId(null);
        };
        
        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          setSpeakingMessageId(null);
        };
        
        // Speak the text
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback if Web Speech API is not supported
        console.error("Web Speech API is not supported in this browser");
        setSpeakingMessageId(null);
      }
    } catch (error) {
      console.error("Error starting speech:", error);
      setSpeakingMessageId(null);
    }
  };

  // Function to translate a message
  const translateMessage = async (messageId: string, targetLanguage: 'en' | 'hi' | 'mr', modelName: 'model1' | 'model2' | 'model3') => {
    // Get the appropriate model state
    let modelState: ModelState;
    let setModelState: React.Dispatch<React.SetStateAction<ModelState>>;
    
    switch (modelName) {
      case 'model1':
        modelState = model1;
        setModelState = setModel1;
        break;
      case 'model2':
        modelState = model2;
        setModelState = setModel2;
        break;
      case 'model3':
        modelState = model3;
        setModelState = setModel3;
        break;
      default:
        return;
    }

    const messageIndex = modelState.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const message = modelState.messages[messageIndex];
    if (!message || message.role !== "assistant") return;

    // Check if already translated
    const translatedContent = (message as any).translatedContent || {};
    if (translatedContent[targetLanguage]) {
      // Update current language
      const updatedMessages = [...modelState.messages];
      (updatedMessages[messageIndex] as any).currentLanguage = targetLanguage;
      setModelState(prev => ({
        ...prev,
        messages: updatedMessages
      }));
      return;
    }

    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const endpoint = window.location.hostname === 'localhost' ? `${baseUrl}/translate` : '/api/translate';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message.content,
          target_language: targetLanguage,
          source_language: 'en'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.translated_text;

      // Update message with translated content
      const updatedMessages = [...modelState.messages];
      (updatedMessages[messageIndex] as any).translatedContent = {
        ...translatedContent,
        [targetLanguage]: translatedText
      };
      (updatedMessages[messageIndex] as any).currentLanguage = targetLanguage;
      
      setModelState(prev => ({
        ...prev,
        messages: updatedMessages
      }));
    } catch (error) {
      console.error("Error translating message:", error);
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <LayoutDashboard className="text-foreground h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Chat",
      href: "/chat",
      icon: (
        <MessageSquare className="text-foreground h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Arena",
      href: "/arena",
      icon: (
        <ArrowLeftRight className="text-foreground h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <Settings className="text-foreground h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <LogOut className="text-foreground h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Dr. Vaani",
                href: "#",
                icon: (
                  <div className="h-7 w-7 flex-shrink-0 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-bold">DV</span>
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
        {/* Header with scroll sync toggle */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <ArrowLeftRight className="h-6 w-6 text-primary" />
              AI Doctor Arena
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Compare medical AI responses in real-time</p>
          </div>
          <div className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-2">
            <Label htmlFor="scroll-sync" className="text-sm font-medium text-foreground cursor-pointer">
              Sync Scroll
            </Label>
            <Switch
              id="scroll-sync"
              checked={scrollSync}
              onCheckedChange={setScrollSync}
            />
          </div>
        </motion.div>

        {/* Three-column layout with single scrollbar */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-w-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="min-h-full"
            >
              <ArenaColumn
                model={model1}
                scrollSync={scrollSync}
                syncGroup="arena-scroll"
                onTextToSpeech={handleTextToSpeech}
                speakingMessageId={speakingMessageId}
                onTranslate={(messageId, targetLanguage) => translateMessage(messageId, targetLanguage, 'model1')}
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="min-h-full border-l border-border"
            >
              <ArenaColumn
                model={model2}
                scrollSync={scrollSync}
                syncGroup="arena-scroll"
                onTextToSpeech={handleTextToSpeech}
                speakingMessageId={speakingMessageId}
                onTranslate={(messageId, targetLanguage) => translateMessage(messageId, targetLanguage, 'model2')}
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="min-h-full border-l border-border"
            >
              <ArenaColumn
                model={model3}
                scrollSync={scrollSync}
                syncGroup="arena-scroll"
                onTextToSpeech={handleTextToSpeech}
                speakingMessageId={speakingMessageId}
                onTranslate={(messageId, targetLanguage) => translateMessage(messageId, targetLanguage, 'model3')}
              />
            </motion.div>
          </div>
        </div>

        {/* AI Input with enhanced styling */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border-t border-border bg-gradient-to-b from-card/50 to-card backdrop-blur-sm p-4 shadow-lg"
        >
          <AIInput
            placeholder="Ask a medical question to compare all AI models..."
            onSubmit={handleSendMessage}
            maxHeight={200}
          />
        </motion.div>
      </div>
    </div>
  );
}