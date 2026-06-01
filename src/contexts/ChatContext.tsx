import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type ChatHelpStage = "topics" | "guided" | "whatsapp";

interface ChatContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  input: string;
  setInput: (value: string) => void;
  isTyping: boolean;
  setIsTyping: (value: boolean) => void;
  helpStage: ChatHelpStage;
  setHelpStage: (stage: ChatHelpStage) => void;
  selectedTopicId: string | null;
  setSelectedTopicId: (id: string | null) => void;
  resetChat: () => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [helpStage, setHelpStage] = useState<ChatHelpStage>("topics");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const wasOpenRef = useRef(false);
  const prevLangRef = useRef(lang);

  const resetChat = useCallback(() => {
    setHelpStage("topics");
    setSelectedTopicId(null);
    setMessages([{ role: "assistant", content: t("chatWelcome") }]);
    setInput("");
    setIsTyping(false);
  }, [t]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    resetChat();
  }, [resetChat]);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      resetChat();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, resetChat]);

  useEffect(() => {
    if (prevLangRef.current === lang) return;
    prevLangRef.current = lang;
    if (isOpen) resetChat();
  }, [lang, isOpen, resetChat]);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        setMessages,
        input,
        setInput,
        isTyping,
        setIsTyping,
        helpStage,
        setHelpStage,
        selectedTopicId,
        setSelectedTopicId,
        resetChat,
        closeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return ctx;
}
