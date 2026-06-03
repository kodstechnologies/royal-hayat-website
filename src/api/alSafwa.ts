import api from "./axiosInstance";

const BASE = "/api/v1/al-safwa";

export type AlSafwaEnrollmentPayload = {
  firstName: string;
  familyName: string;
  gender: "male" | "female";
  dateOfBirth: string;
  mobile: string;
  email: string;
  preferredAppointmentDate: string;
  previousMedicalCheckup: "less_than_1_year" | "more_than_1_year" | "never";
  diabetes: "yes" | "no" | "dont_know";
  highCholesterol: "yes" | "no" | "dont_know";
  bronchialAsthma: "yes" | "no" | "dont_know";
  hypertension: "yes" | "no" | "dont_know";
  heartDisease: "yes" | "no" | "dont_know";
  overweightObesity: "yes" | "no" | "dont_know";
  smoker: "yes" | "no";
  alcohol: "yes" | "no";
};

export const createAlSafwaEnrollment = async (
  payload: AlSafwaEnrollmentPayload,
) => {
  const response = await api.post(BASE, payload);
  return response.data;
};

