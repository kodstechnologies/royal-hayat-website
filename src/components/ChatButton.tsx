import { MessageCircle, X, Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useMemo, type ReactNode, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useChat } from "@/contexts/ChatContext";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=96525360000&text=chat%20with%20patient%20care";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type ChatTopic = {
  id: string;
  labelKey: string;
  introKey: string;
  stepKeys: string[];
  href: string;
};

const knowledgeBase: { keywords: string[]; response: string }[] = [
  {
    keywords: ["hello", "hi", "hey", "good morning", "good evening", "assalam", "مرحبا", "السلام"],
    response:
      "Hello! I'm your **Royale Hayat AI Health Assistant**.\n\nHow can I help you today? You can ask about appointments, departments, doctors, insurance, or describe your symptoms.",
  },
  {
    keywords: ["appointment", "book", "booking", "schedule", "reserve", "موعد", "حجز"],
    response:
      "I'd be happy to help you book an appointment! You can:\n\n1. **Online Booking** — [Book Appointment](/book-appointment)\n2. **Phone** — **+965 2536 0000**\n3. **Walk-in** — Visit reception for same-day availability",
  },
  {
    keywords: ["safwa", "Al Safwa HealthCare", "الصفوة", "صفوة"],
    response:
      "The **Al Safwa Healthcare Program** offers personalized elite medical care.\n\nLearn more on our [Al Safwa](/al-safwa) page.",
  },
  {
    keywords: ["job", "jobs", "career", "vacancy", "work with us", "وظيف", "وظائف"],
    response:
      "View open positions on [Work With Us](/work-with-us?section=positions) and apply online.",
  },
  {
    keywords: ["home health", "royale home", "رعاية منزلية", "منزلية"],
    response:
      "**Royale Home Health** provides nursing, physiotherapy, and post-operative care at home.\n\nVisit [Royale Home Health](/home-health) for details.",
  },
  {
    keywords: ["department", "departments", "specialt", "services", "قسم", "أقسام"],
    response:
      "Royale Hayat Hospital has **specialized departments**. Browse [Medical Services](/medical-services) to find the right specialty.",
  },
  {
    keywords: ["doctor", "doctors", "physician", "طبيب", "أطباء"],
    response:
      "Browse our [Doctors](/doctors) page or describe your symptoms for a recommendation.",
  },
  {
    keywords: ["thank", "thanks", "bye", "goodbye", "شكر", "مع السلامة"],
    response: "You're welcome! Thank you for choosing Royale Hayat Hospital.\n\n📞 **+965 2536 0000**",
  },
];

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const item of knowledgeBase) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.response;
    }
  }
  return "Thank you for your question! Choose a topic below for guided steps, or call **+965 2536 0000** for assistance.";
}

const CHAT_TOPICS: ChatTopic[] = [
  {
    id: "appointment",
    labelKey: "chatBookAppt",
    introKey: "chatTopicAppt",
    stepKeys: ["chatStepAppt1", "chatStepAppt2", "chatStepAppt3"],
    href: "/book-appointment",
  },
  {
    id: "safwa",
    labelKey: "chatAlSafwa",
    introKey: "chatTopicSafwa",
    stepKeys: ["chatStepSafwa1", "chatStepSafwa2", "chatStepSafwa3"],
    href: "/al-safwa",
  },
  {
    id: "jobs",
    labelKey: "chatJobs",
    introKey: "chatTopicJobs",
    stepKeys: ["chatStepJobs1", "chatStepJobs2", "chatStepJobs3"],
    href: "/work-with-us?section=positions",
  },
  {
    id: "home-health",
    labelKey: "chatRoyalHomeHealth",
    introKey: "chatTopicHomeHealth",
    stepKeys: ["chatStepHomeHealth1", "chatStepHomeHealth2", "chatStepHomeHealth3"],
    href: "/home-health",
  },
];

function buildGuidedChatMessage(topic: ChatTopic, t: (key: string) => string): string {
  const intro = t(topic.introKey);
  const steps = topic.stepKeys.map((key, i) => `${i + 1}. ${t(key)}`).join("\n");
  const linkLabel = t(topic.labelKey);
  return `${intro}\n\n${steps}\n\n[${linkLabel} →](${topic.href})`;
}

const ChatButton = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const isAr = lang === "ar";
  const {
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
    closeChat,
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherTopics = useMemo(
    () => CHAT_TOPICS.filter((topic) => topic.id !== selectedTopicId),
    [selectedTopicId],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, helpStage]);

  const handleInternalLinkClick = (e: MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }
    e.preventDefault();
    navigate(href);
  };

  const handleTopicSelect = (topic: ChatTopic) => {
    const label = t(topic.labelKey);
    setSelectedTopicId(topic.id);
    setHelpStage("guided");
    setMessages((prev) => [...prev, { role: "user", content: label }]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: buildGuidedChatMessage(topic, t) },
      ]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    setHelpStage("topics");
    setSelectedTopicId(null);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: getResponse(trimmed) }]);
      setIsTyping(false);
    }, 700);
  };

  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      const processed = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(
          /\[(.*?)\]\((.*?)\)/g,
          '<a href="$2" class="text-accent underline hover:text-accent/80 font-medium">$1</a>',
        );
      if (/^\d+\.\s/.test(line)) {
        return <p key={i} className="ps-1" dangerouslySetInnerHTML={{ __html: processed }} />;
      }
      if (line.startsWith("•")) {
        return (
          <li
            key={i}
            className="ml-4 list-disc"
            dangerouslySetInnerHTML={{ __html: processed.replace("•", "") }}
          />
        );
      }
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  const pillBase =
    "inline-flex shrink-0 items-center whitespace-nowrap text-xs font-body px-3 py-1.5 rounded-full border transition-all";

  const CapsuleButton = ({ topic, onClick }: { topic: ChatTopic; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`${pillBase} border-border hover:bg-secondary/30 hover:border-accent text-muted-foreground hover:text-foreground`}
    >
      {t(topic.labelKey)}
    </button>
  );

  const ActionButton = ({
    children,
    onClick,
    variant = "default",
  }: {
    children: ReactNode;
    onClick?: () => void;
    variant?: "default" | "whatsapp";
  }) => {
    const styles =
      variant === "whatsapp"
        ? "border-[#25D366]/40 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 font-medium"
        : "border-border hover:bg-secondary/30 hover:border-accent text-muted-foreground hover:text-foreground";
    if (variant === "whatsapp" && !onClick) {
      return (
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap text-sm font-body font-semibold px-5 py-3 min-h-[44px] rounded-xl border shadow-sm transition-all ${styles}`}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
            <WhatsAppIcon className="h-4 w-4" />
          </span>
          {children}
        </a>
      );
    }
    return (
      <button type="button" onClick={onClick} className={`${pillBase} ${styles}`}>
        {children}
      </button>
    );
  };

  const isRtl = isAr;
  const positionClass = isRtl ? "left-6" : "right-6";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`fixed bottom-20 md:bottom-24 ${isRtl ? "left-4 md:left-6" : "right-4 md:right-6"} z-50 w-[calc(100vw-32px)] md:w-[400px] max-h-[70vh] md:max-h-[580px] bg-background rounded-2xl shadow-2xl border border-border/50 flex flex-col overflow-hidden`}
          >
            <div className="bg-primary px-5 py-4 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-primary-foreground font-serif text-sm font-semibold">
                  {t("chatAssistantName")}
                </p>
                <p className="text-primary-foreground/60 text-xs font-body">
                  {t("aiHealthConcierge")}
                </p>
              </div>
              <button
                type="button"
                onClick={closeChat}
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    role="presentation"
                    onClick={msg.role === "assistant" ? handleInternalLinkClick : undefined}
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary/30 text-foreground rounded-bl-md"
                    }`}
                  >
                    {renderContent(msg.content)}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-secondary/30 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </motion.div>
              )}

              {!isTyping && (
                <div className="pt-1 space-y-2.5">
                  {helpStage === "topics" && (
                    <div className="flex flex-wrap items-start gap-2">
                      {CHAT_TOPICS.map((topic) => (
                        <CapsuleButton
                          key={topic.id}
                          topic={topic}
                          onClick={() => handleTopicSelect(topic)}
                        />
                      ))}
                    </div>
                  )}

                  {helpStage === "guided" && (
                    <div className="flex flex-wrap items-start gap-2">
                      <ActionButton onClick={() => setHelpStage("need-help")}>
                        {t("chatNeedHelp")}
                      </ActionButton>
                    </div>
                  )}

                  {helpStage === "need-help" && (
                    <>
                      <div className="flex flex-wrap items-start gap-2">
                        {otherTopics.map((topic) => (
                          <CapsuleButton
                            key={topic.id}
                            topic={topic}
                            onClick={() => handleTopicSelect(topic)}
                          />
                        ))}
                      </div>
                      <div className="flex flex-wrap items-start gap-2">
                        <ActionButton onClick={() => setHelpStage("whatsapp")}>
                          {t("chatNeedMoreHelp")}
                        </ActionButton>
                      </div>
                    </>
                  )}

                  {helpStage === "whatsapp" && (
                    <div className="flex w-full justify-center items-center pt-2 pb-1">
                      <ActionButton variant="whatsapp">{t("chatContinueWhatsApp")}</ActionButton>
                    </div>
                  )}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-border/50 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("chatPlaceholder")}
                  className="flex-1 bg-secondary/20 rounded-xl px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={`fixed bottom-6 ${positionClass} z-50 w-14 h-14 rounded-full bg-primary shadow-xl flex items-center justify-center hover:bg-primary/90 transition-colors duration-300`}
        aria-label="Chat with us"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default ChatButton;
