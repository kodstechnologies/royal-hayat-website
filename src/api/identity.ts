import api from "./axiosInstance";

export type BilingualText = {
  ar: string;
  en: string;
};

export type IdentityName = {
  english?: string;
  arabic?: string;
  en?: string;
  ar?: string;
};

export type IdentityRawPayload = {
  success?: boolean;
  operationId?: string;
  civilId?: string;
  name?: IdentityName;
  [key: string]: unknown;
};

export type StartIdentityPayload = {
  civilId: string;
  callbackUrl?: string;
  serviceName?: BilingualText;
  reason?: BilingualText;
};

export type StartIdentityResponse = {
  operationId: string | null;
  status?: "pending" | "verified" | "not_verified";
  verified?: boolean | null;
  skippedStart?: boolean;
  dataSource?: "data" | "start";
  paciRequestId?: string | null;
  statusUrl?: string | null;
  callbackUrl?: string;
  civilId?: string;
  raw?: IdentityRawPayload;
};

export type IdentityStatusResponse = {
  operationId: string;
  status: "pending" | "verified" | "not_verified";
  verified: boolean | null;
  personName?: IdentityName;
  civilId?: string | null;
  identityData?: IdentityRawPayload | null;
  callbackReceived?: boolean;
  updatedAt?: string | null;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const startIdentityVerification = async (payload: StartIdentityPayload): Promise<StartIdentityResponse> => {
  // MOCK: For testing with specific National ID
  if (payload.civilId === "284102401152") {
    return {
      operationId: "mock-op-id-284102401152",
      status: "pending",
      verified: null,
      skippedStart: false,
      dataSource: "start",
      civilId: "284102401152"
    } as any;
  }

  const response = await api.post("/api/v1/identity/start", payload);
  return (response.data as ApiEnvelope<StartIdentityResponse>)?.data;
};

export const getIdentityStatus = async (operationId: string): Promise<IdentityStatusResponse> => {
  if (operationId === "mock-op-id-284102401152") {
    return {
      operationId,
      status: "verified",
      verified: true,
      personName: {
        english: "YEHIA KHAFAJA",
        arabic: "يحيى عفيف حسين خفاجه"
      },
      civilId: "284102401152",
      callbackReceived: true,
      updatedAt: new Date().toISOString()
    } as any;
  }
  const response = await api.get(`/api/v1/identity/status/${encodeURIComponent(operationId)}`);
  return (response.data as ApiEnvelope<IdentityStatusResponse>)?.data;
};
