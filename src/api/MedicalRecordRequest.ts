import api from "./axiosInstance";

const BASE = "/api/v1/medical-record-requests";

export type SpecificDocumentType = "Lab Results" | "Imaging Reports" | "Others";

export type CreateMedicalRecordRequestPayload = {
  patientFullName: string;
  patientFileNo: string;
  dateOfBirth: string;

  validIdentification: "civilId" | "passportORGovtId";
  civilIdNumber?: string;
  civilIdAttachment?: File;
  passportOrGovernmentIdAttachment?: File;

  specificAuthorization: "Discharge Summary" | "specific documents";
  specificFromDate?: string;
  specificToDate?: string;
  specialRequest?: string;
  specificDocumentTypes?: SpecificDocumentType[];
  specificDocumentsOther?: string;

  recipientName: string;
  recipientEmailAddress: string;
  recipientContactNumber: string;

  purposeOfDisclosure: "Continuing Care" | "Insurance Filing" | "Others";
  otherPurpose?: string;

  requestedBy: "Patient" | "Legal Representative";
  patientNameConfirmation?: string;
  legalRepresentativeFullName?: string;
  relationshipWithPatient?: string;
  validProof?: File;
};

export type CreateMedicalRecordRequestResponse = {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
};

/** POST /api/v1/medical-record-requests/create — multipart form with optional file uploads */
export const createMedicalRecordRequest = async (
  data: CreateMedicalRecordRequestPayload,
): Promise<CreateMedicalRecordRequestResponse> => {
  const formData = new FormData();

  formData.append("patientFullName", data.patientFullName);
  formData.append("patientFileNo", data.patientFileNo);
  formData.append("dateOfBirth", data.dateOfBirth);
  formData.append("validIdentification", data.validIdentification);

  if (data.validIdentification === "civilId") {
    if (data.civilIdNumber) formData.append("civilIdNumber", data.civilIdNumber);
    if (data.civilIdAttachment) {
      formData.append("civilIdAttachment", data.civilIdAttachment);
    }
  } else if (data.passportOrGovernmentIdAttachment) {
    formData.append(
      "passportOrGovernmentIdAttachment",
      data.passportOrGovernmentIdAttachment,
    );
  }

  formData.append("specificAuthorization", data.specificAuthorization);

  if (data.specificFromDate) {
    formData.append("specificFromDate", data.specificFromDate);
  }
  if (data.specificToDate) {
    formData.append("specificToDate", data.specificToDate);
  }
  if (data.specialRequest) {
    formData.append("specialRequest", data.specialRequest);
  }
  if (data.specificDocumentTypes?.length) {
    formData.append(
      "specificDocumentTypes",
      JSON.stringify(data.specificDocumentTypes),
    );
  }
  if (data.specificDocumentsOther) {
    formData.append("specificDocumentsOther", data.specificDocumentsOther);
  }

  formData.append("recipientName", data.recipientName);
  formData.append("recipientEmailAddress", data.recipientEmailAddress);
  formData.append("recipientContactNumber", data.recipientContactNumber);
  formData.append("purposeOfDisclosure", data.purposeOfDisclosure);

  if (data.otherPurpose) {
    formData.append("otherPurpose", data.otherPurpose);
  }

  formData.append("requestedBy", data.requestedBy);

  if (data.patientNameConfirmation) {
    formData.append("patientNameConfirmation", data.patientNameConfirmation);
  }
  if (data.legalRepresentativeFullName) {
    formData.append("legalRepresentativeFullName", data.legalRepresentativeFullName);
  }
  if (data.relationshipWithPatient) {
    formData.append("relationshipWithPatient", data.relationshipWithPatient);
  }
  if (data.validProof) {
    formData.append("validProof", data.validProof);
  }

  const response = await api.post<CreateMedicalRecordRequestResponse>(
    `${BASE}/create`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return response.data;
};

/** @deprecated Use createMedicalRecordRequest */
export const createRequest = createMedicalRecordRequest;
