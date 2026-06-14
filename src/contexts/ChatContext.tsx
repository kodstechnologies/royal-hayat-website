import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ensureChatSession } from "@/api/chat";
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
      void ensureChatSession().catch((err) => {
        console.error("Failed to initialize chat session:", err);
      });
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, resetChat]);
  useEffect(() => {
    if (prevLangRef.current === lang) return;
    prevLangRef.current = lang;
    if (isOpen) resetChat();
  }, [lang, isOpen, resetChat]);
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const { body, documentElement } = document;
    const prevBody = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      overflow: body.style.overflow,
      width: body.style.width,
    };
    const prevHtmlOverflow = documentElement.style.overflow;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.position = prevBody.position;
      body.style.top = prevBody.top;
      body.style.left = prevBody.left;
      body.style.right = prevBody.right;
      body.style.overflow = prevBody.overflow;
      body.style.width = prevBody.width;
      documentElement.style.overflow = prevHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);
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
