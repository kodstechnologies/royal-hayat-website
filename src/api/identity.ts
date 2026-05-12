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
  // Present when the backend returns success: false
  success?: boolean;
  message?: string;
  meta?: {
    type?: string;
    title?: string;
    status?: number;
    waitSeconds?: number;
    [key: string]: unknown;
  };
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

export type IdentityDataResponse = {
  verified: boolean;
  civilId?: string | null;
  personName?: IdentityName;
  identityData?: IdentityRawPayload | null;
  raw?: IdentityRawPayload | null;
  skippedStart?: boolean;
  dataSource?: "data";
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
  const envelope = response.data as ApiEnvelope<StartIdentityResponse>;
  // Surface error info so callers can inspect success/meta
  if (envelope?.success === false) {
    return {
      operationId: null,
      success: false,
      message: envelope.message,
      meta: (envelope as any).meta,
    };
  }
  return envelope?.data;
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

export const getIdentityData = async (civilId: string): Promise<IdentityDataResponse> => {
  const normalizedCivilId = civilId.trim();

  if (normalizedCivilId === "284102401152") {
    const mockRaw: IdentityRawPayload = {
      success: true,
      civilId: normalizedCivilId,
      name: {
        english: "YEHIA KHAFAJA",
        arabic: "يحيى عفيف حسين خفاجه"
      }
    };

    return {
      verified: true,
      civilId: normalizedCivilId,
      personName: mockRaw.name,
      identityData: mockRaw,
      raw: mockRaw,
      skippedStart: true,
      dataSource: "data"
    };
  }

  const response = await api.get(`/api/v1/identity/data/${encodeURIComponent(normalizedCivilId)}`);
  const data = (response.data as ApiEnvelope<IdentityDataResponse>)?.data;
  return {
    ...data,
    dataSource: "data"
  };
};
