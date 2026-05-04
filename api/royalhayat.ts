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

export const getPatient = async (params: { nationalid: string }) => {
  // MOCK: For testing with specific National ID
  if (params.nationalid === "284102401152") {
    return {
      success: true,
      message: "Patient data fetched successfully",
      data: {
        patient: {
          patient_id: "90611",
          name_en: "YEHIA KHAFAJA",
          civil_id: "284102401152"
        }
      }
    };
  }
  const response = await api.get("/api/v1/royal-hayat/patients", { params });
  return response.data;
};
