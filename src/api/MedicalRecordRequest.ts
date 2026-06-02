import api from "./axiosInstance";

const BASE = "/api/v1/medical-record-requests";


// ================= CREATE MEDICAL RECORD REQUEST =================

export type CreateMedicalRecordRequestPayload = {
  patientFullName: string;
  civilId: string;

  passportOrGovernmentId: File;

  patientFileNo: string;

  dateOfBirth: string;

  specificAuthorization:
    | "Discharge Summary"
    | "Discharge Summary with a specific date of service";

  specificDateOfService?: string;

  recipientName: string;

  recipientEmailAddress: string;

  recipientContactNumber: string;

  purposeOfDisclosure:
    | "Continuing Care"
    | "Insurance Filing"
    | "Others";

  otherPurpose?: string;

  requestedBy:
    | "Patient"
    | "Legal Representative";

  patientNameConfirmation?: string;
};


export const createRequest = async (
  data: CreateMedicalRecordRequestPayload
) => {

  const formData = new FormData();

  formData.append(
    "patientFullName",
    data.patientFullName
  );

  formData.append(
    "civilId",
    data.civilId
  );

  formData.append(
    "passportOrGovernmentId",
    data.passportOrGovernmentId
  );

  formData.append(
    "patientFileNo",
    data.patientFileNo
  );

  formData.append(
    "dateOfBirth",
    data.dateOfBirth
  );

  formData.append(
    "specificAuthorization",
    data.specificAuthorization
  );

  if (data.specificDateOfService) {

    formData.append(
      "specificDateOfService",
      data.specificDateOfService
    );
  }

  formData.append(
    "recipientName",
    data.recipientName
  );

  formData.append(
    "recipientEmailAddress",
    data.recipientEmailAddress
  );

  formData.append(
    "recipientContactNumber",
    data.recipientContactNumber
  );

  formData.append(
    "purposeOfDisclosure",
    data.purposeOfDisclosure
  );

  if (data.otherPurpose) {

    formData.append(
      "otherPurpose",
      data.otherPurpose
    );
  }

  formData.append(
    "requestedBy",
    data.requestedBy
  );

  if (data.patientNameConfirmation) {

    formData.append(
      "patientNameConfirmation",
      data.patientNameConfirmation
    );
  }

  const response = await api.post(
    `${BASE}/create`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};