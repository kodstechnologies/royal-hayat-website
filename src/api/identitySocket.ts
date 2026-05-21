import { io, type Socket } from "socket.io-client";
import type { IdentityStatusResponse } from "./identity";

const getSocketBaseUrl = (): string => {
  if (import.meta.env.DEV) {
    return typeof window !== "undefined" ? window.location.origin : "";
  }
  const raw = import.meta.env.VITE_BACKEND_API_URL;
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  return trimmed !== "" ? trimmed.replace(/\/+$/, "") : "";
};

export type IdentitySocketSubscription = {
  socket: Socket;
  unsubscribe: () => void;
};

export const subscribeToIdentityVerification = (
  operationId: string,
  onComplete: (data: IdentityStatusResponse) => void
): IdentitySocketSubscription => {
  const socket = io(getSocketBaseUrl(), {
    path: "/api/socket.io",
    transports: ["websocket"],
    upgrade: false,
    withCredentials: true,
    autoConnect: true,
    reconnectionAttempts: 8,
  });

  const handleComplete = (data: IdentityStatusResponse) => {
    onComplete(data);
  };

  socket.on("connect", () => {
    socket.emit("identity:subscribe", { operationId });
  });

  socket.on("identity:complete", handleComplete);

  socket.on("connect_error", (err) => {
    console.error("[identity] socket connect_error", err.message);
  });

  if (socket.connected) {
    socket.emit("identity:subscribe", { operationId });
  }

  const unsubscribe = () => {
    socket.off("identity:complete", handleComplete);
    socket.emit("identity:unsubscribe", { operationId });
    socket.disconnect();
  };

  return { socket, unsubscribe };
};
