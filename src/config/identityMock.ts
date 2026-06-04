import type { IdentityDataResponse, StartIdentityResponse } from "@/api/identity";

/** Toggle in code — QA PACI mock responses without Sharper/Hawyti (pairs with backend identity.mock.json). */
export const MOCK_IDENTITY_QA_ENABLED = true;

export const QA_PACI_ONLY_HIS_NOT_FOUND_CIVIL_ID = "286101702332";

export const QA_BOOKING_FAILURE_CIVIL_ID = "286101702331";

type MockIdentityProfile = {
  civilId: string;
  name: { english: string; arabic: string };
  sex: string;
  dateOfBirth: string;
  nationality: {
    iso3Letter: string;
    iso2Letter: string;
    name: { english: string; arabic: string };
    demonym: { english: string; arabic: string };
  };
  registration: { passport: string };
  address: {
    uniqueKey: string;
    governorate: { english: string; arabic: string };
  };
};

const QA_MOCK_PROFILES: Record<string, MockIdentityProfile> = {
  [QA_PACI_ONLY_HIS_NOT_FOUND_CIVIL_ID]: {
    civilId: QA_PACI_ONLY_HIS_NOT_FOUND_CIVIL_ID,
    name: { english: "PACI ONLY QA PATIENT", arabic: "مريض اختبار هوية PACI" },
    sex: "F",
    dateOfBirth: "1985-03-20T00:00:00",
    nationality: {
      iso3Letter: "KWT",
      iso2Letter: "KW",
      name: { english: "Kuwait", arabic: "الكويت" },
      demonym: { english: "Kuwaiti", arabic: "كويتي" },
    },
    address: {
      uniqueKey: "mock-address-paci-only",
      governorate: { english: "Capital", arabic: "العاصمة" },
    },
    registration: { passport: "MOCK-PASSPORT-PACI-ONLY" },
  },
  [QA_BOOKING_FAILURE_CIVIL_ID]: {
    civilId: QA_BOOKING_FAILURE_CIVIL_ID,
    name: { english: "TEST PATIENT MOCK", arabic: "مريض تجريبي" },
    sex: "M",
    dateOfBirth: "1990-01-15T00:00:00",
    nationality: {
      iso3Letter: "KWT",
      iso2Letter: "KW",
      name: { english: "Kuwait", arabic: "الكويت" },
      demonym: { english: "Kuwaiti", arabic: "كويتي" },
    },
    address: {
      uniqueKey: "mock-address",
      governorate: { english: "Hawalli", arabic: "حولي" },
    },
    registration: { passport: "MOCK-PASSPORT-001" },
  },
};

const normalizeCivilId = (value: string) => value.replace(/\D/g, "").trim();

export const isQaMockCivilId = (civilId: string): boolean => {
  if (!MOCK_IDENTITY_QA_ENABLED) return false;
  const id = normalizeCivilId(civilId);
  return /^\d{12}$/.test(id) && id in QA_MOCK_PROFILES;
};

const buildMockRaw = (profile: MockIdentityProfile) => ({
  success: true,
  civilId: profile.civilId,
  name: profile.name,
  sex: profile.sex,
  dateOfBirth: profile.dateOfBirth,
  nationality: profile.nationality,
  bloodType: "O+",
  address: profile.address,
  registration: profile.registration,
});

/** Instant PACI verify (no Hawyti wait) — mirrors backend buildMockStartResult. */
export const getQaMockStartResponse = (civilId: string): StartIdentityResponse | null => {
  const id = normalizeCivilId(civilId);
  const profile = QA_MOCK_PROFILES[id];
  if (!profile) return null;

  const raw = buildMockRaw(profile);
  return {
    operationId: null,
    status: "verified",
    verified: true,
    skippedStart: true,
    dataSource: "mock",
    civilId: id,
    personName: profile.name,
    raw,
  };
};

/** PACI identity data — mirrors backend buildMockDataResult / GET identity/data. */
export const getQaMockIdentityData = (civilId: string): IdentityDataResponse | null => {
  const id = normalizeCivilId(civilId);
  const profile = QA_MOCK_PROFILES[id];
  if (!profile) return null;

  const raw = buildMockRaw(profile);
  return {
    verified: true,
    civilId: id,
    personName: profile.name,
    identityData: raw,
    raw,
    skippedStart: true,
    dataSource: "mock",
  };
};
