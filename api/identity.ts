import api from "./axiosInstance";

type BilingualText = {
  ar: string;
  en: string;
};

type StartIdentityPayload = {
  civilId: string;
  callbackUrl?: string;
  serviceName?: BilingualText;
  reason?: BilingualText;
};

export const startIdentityVerification = async (payload: StartIdentityPayload) => {
  const response = await api.post("/api/v1/identity/start", payload);
  return response.data?.data;
};

export const getIdentityStatus = async (operationId: string) => {
  const response = await api.get(`/api/v1/identity/status/${encodeURIComponent(operationId)}`);
  return response.data?.data;
};

