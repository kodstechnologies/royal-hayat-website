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
  dataSource?: "data" | "start" | "mock";
  paciRequestId?: string | null;
  statusUrl?: string | null;
  callbackUrl?: string;
  civilId?: string;
  personName?: IdentityName;
  raw?: IdentityRawPayload;
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
  dataSource?: "data" | "mock";
};
type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};
export const startIdentityVerification = async (payload: StartIdentityPayload): Promise<StartIdentityResponse> => {
  const response = await api.post("/api/v1/identity/start", payload);
  const envelope = response.data as ApiEnvelope<StartIdentityResponse>;
  if (envelope?.success === false) {
    return {
      operationId: null,
      success: false,
      message: envelope.message,
      meta: (envelope as { meta?: StartIdentityResponse["meta"] }).meta,
    };
  }
  return envelope?.data;
};
export const getIdentityStatus = async (operationId: string): Promise<IdentityStatusResponse> => {
  const response = await api.get(`/api/v1/identity/status/${encodeURIComponent(operationId)}`);
  return (response.data as ApiEnvelope<IdentityStatusResponse>)?.data;
};
export const getIdentityData = async (civilId: string): Promise<IdentityDataResponse> => {
  const normalizedCivilId = civilId.trim();
  const response = await api.get(`/api/v1/identity/data/${encodeURIComponent(normalizedCivilId)}`);
  const data = (response.data as ApiEnvelope<IdentityDataResponse>)?.data;
  return {
    ...data,
    dataSource: "data"
  };
};
