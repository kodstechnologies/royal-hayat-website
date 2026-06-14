import api from "./axiosInstance";
export interface AvailabilityParams {
  specialitycode: string;
  providercode: string;
  servicecode: string;
  datefrom: string;
  dateto?: string;
  timefrom?: string;
  timeto?: string;
  dow?: string;
}
export interface Slot {
  slot_booking_id: string;
  slot_from_time: string;
  slot_to_time: string;
  slot_date: string;
}
export interface AvailabilityResponse {
  success: boolean;
  message: string;
  data: {
    slot_list: Slot[];
    truncated: boolean;
  };
}
export interface BookAppointmentPayload {
  patientId: string;
  slotBookingId: string;
  /** Optional context for QA forced-failure matching on the server. */
  doctorId?: string;
  date?: string;
  slotTime?: string;
}
export const getAvailability = async (params: AvailabilityParams): Promise<AvailabilityResponse> => {
  const response = await api.get("/api/v1/royal-hayat/availability", { params });
  return response.data;
};
export const getSpecialities = async (hospitalCode: string) => {
  const response = await api.get("/api/v1/royal-hayat/specialities", {
    params: { hospitalCode }
  });
  return response.data;
};
export const getCareProviders = async (specialityCode: string) => {
  const response = await api.get("/api/v1/royal-hayat/care-providers", {
    params: { specialityCode }
  });
  return response.data;
};
export const bookAppointment = async (payload: BookAppointmentPayload) => {
  const response = await api.post("/api/v1/royal-hayat/appointments/book", payload);
  return response.data;
};
export interface PatientLookupResponse {
  success: boolean;
  message: string;
  data?: {
    patient?: Record<string, unknown>;
    raw?: Record<string, unknown>;
  };
}
export const getPatient = async (params: {
  nationalid?: string;
  urn?: string;
}): Promise<PatientLookupResponse> => {
  try {
    const response = await api.get("/api/v1/royal-hayat/patients", { params });
    const data = response.data as PatientLookupResponse;
    if (!data?.success) {
      throw Object.assign(new Error(data?.message || "Patient lookup failed"), {
        response: { status: response.status, data },
      });
    }
    return data;
  } catch (error: unknown) {
    const axiosErr = error as {
      response?: { status?: number; data?: PatientLookupResponse & { meta?: unknown } };
      message?: string;
    };
    if (axiosErr?.response?.data) {
      throw Object.assign(
        new Error(axiosErr.response.data?.message || axiosErr.message || "Patient lookup failed"),
        { response: axiosErr.response },
      );
    }
    throw error;
  }
};
