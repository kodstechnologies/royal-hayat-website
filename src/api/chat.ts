import api from "./axiosInstance";
import { getBackendApiBase } from "./backendBase";
export type ChatMessagePayload = {
  role: "user" | "assistant";
  content: string;
};
type PostChatResponse = {
  success: boolean;
  message: string;
  data: { reply: string };
};
export type ChatErrorCode = "MODEL_OVERLOADED" | "SERVICE_UNAVAILABLE" | "GENERIC";
export class ChatStreamError extends Error {
  code: ChatErrorCode;
  constructor(code: ChatErrorCode, message?: string) {
    super(message ?? code);
    this.name = "ChatStreamError";
    this.code = code;
  }
}
type StreamEvent =
  | { type: "start" }
  | { type: "chunk"; text: string }
  | { type: "done"; reply: string }
  | { type: "error"; message: string; code?: string };
function parseSseEvents(buffer: string): { events: StreamEvent[]; rest: string } {
  const events: StreamEvent[] = [];
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";
  for (const part of parts) {
    for (const line of part.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload) continue;
      try {
        events.push(JSON.parse(payload) as StreamEvent);
      } catch {
      }
    }
  }
  return { events, rest };
}
const CHAT_SESSION_ID_KEY = "rh_chat_session_id";
const CHAT_REFERENCE_ID_KEY = "rh_chat_reference_id";

type ChatSessionData = {
  sessionId: string;
  referenceId: string;
};

let sessionInitPromise: Promise<ChatSessionData> | null = null;

function readCachedChatSession(): ChatSessionData | null {
  try {
    const sessionId = sessionStorage.getItem(CHAT_SESSION_ID_KEY)?.trim() ?? "";
    const referenceId = sessionStorage.getItem(CHAT_REFERENCE_ID_KEY)?.trim() ?? "";
    if (!sessionId) return null;
    return { sessionId, referenceId };
  } catch {
    return null;
  }
}

function cacheChatSession(data: ChatSessionData): ChatSessionData {
  try {
    sessionStorage.setItem(CHAT_SESSION_ID_KEY, data.sessionId);
    if (data.referenceId) {
      sessionStorage.setItem(CHAT_REFERENCE_ID_KEY, data.referenceId);
    }
  } catch {
    // ignore storage failures
  }
  return data;
}

export async function ensureChatSession(): Promise<ChatSessionData> {
  const cached = readCachedChatSession();
  if (cached) return cached;

  if (!sessionInitPromise) {
    sessionInitPromise = api
      .get<{ success: boolean; data: ChatSessionData }>("/api/v1/chat/session")
      .then((response) => cacheChatSession(response.data.data))
      .catch((err) => {
        sessionInitPromise = null;
        throw err;
      });
  }

  return sessionInitPromise;
}

export function getChatReferenceId(): string {
  return readCachedChatSession()?.referenceId ?? "";
}

export async function postChatLog(
  messages: ChatMessagePayload[],
  lang: "en" | "ar",
  assistantReply: string,
  topicId?: string,
): Promise<void> {
  const { sessionId } = await ensureChatSession();
  await api.post("/api/v1/chat/log", {
    messages,
    lang,
    sessionId,
    assistantReply,
    topicId,
  });
}

export async function postChat(messages: ChatMessagePayload[], lang: "en" | "ar") {
  const { sessionId } = await ensureChatSession();
  const response = await api.post<PostChatResponse>("/api/v1/chat", {
    messages,
    lang,
    sessionId,
  });
  return response.data.data.reply;
}
export async function postChatStream(
  messages: ChatMessagePayload[],
  lang: "en" | "ar",
  onDelta: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const { sessionId } = await ensureChatSession();
  const base = getBackendApiBase();
  const response = await fetch(`${base}/api/v1/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, lang, sessionId }),
    signal,
  });
  if (!response.ok) {
    let message = "Chat request failed";
    let code: ChatErrorCode = "GENERIC";
    try {
      const errJson = await response.json();
      message = errJson?.message || message;
      const metaCode = errJson?.meta?.code;
      if (metaCode === "MODEL_OVERLOADED" || metaCode === "SERVICE_UNAVAILABLE") {
        code = metaCode;
      } else if (response.status === 503 || response.status === 429) {
        code = "MODEL_OVERLOADED";
      }
    } catch {
      if (response.status === 503 || response.status === 429) {
        code = "MODEL_OVERLOADED";
      }
    }
    throw new ChatStreamError(code, message);
  }
  if (!response.body) {
    throw new Error("Streaming is not supported in this browser");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullReply = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const { events, rest } = parseSseEvents(buffer);
    buffer = rest;
    for (const event of events) {
      if (event.type === "chunk" && event.text) {
        fullReply += event.text;
        onDelta(event.text);
      } else if (event.type === "done" && event.reply) {
        fullReply = event.reply;
      } else if (event.type === "error") {
        throw new ChatStreamError(
          (event.code as ChatErrorCode) || "GENERIC",
          event.message || "Stream failed",
        );
      }
    }
  }
  if (buffer.trim()) {
    const { events } = parseSseEvents(`${buffer}\n\n`);
    for (const event of events) {
      if (event.type === "chunk" && event.text) {
        fullReply += event.text;
        onDelta(event.text);
      } else if (event.type === "done" && event.reply) {
        fullReply = event.reply;
      } else if (event.type === "error") {
        throw new ChatStreamError(
          (event.code as ChatErrorCode) || "GENERIC",
          event.message || "Stream failed",
        );
      }
    }
  }
  const trimmed = fullReply.trim();
  if (!trimmed) {
    throw new ChatStreamError("GENERIC", "Empty response from assistant");
  }
  return trimmed;
}
