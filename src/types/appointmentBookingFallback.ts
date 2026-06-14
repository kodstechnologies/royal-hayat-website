export type AppointmentBookingFallbackState = {
  fullname: string;
  gender: "male" | "female" | "";
  genderDisplay?: string;
  civilId?: string;
  patientId?: string;
  doctorName: string;
  doctorNameAr?: string;
  departmentName: string;
  departmentNameAr?: string;
  formattedDate: string;
  selectedDate: string;
  selectedSlot: string;
  formattedTime: string;
  slotPeriod: "morning" | "afternoon";
  symptoms?: string[];
  bookingError?: string;
  suggestedDob?: string;
};
