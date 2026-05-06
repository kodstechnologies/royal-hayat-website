import { doctorsWithClinicCodes, DoctorWithClinicCode } from './doctorsWithClinicCodes';

export interface DepartmentWithDoctors {
  name: string;
  nameAr: string;
  clinicCode?: string;
  doctors: DoctorWithClinicCode[];
  doctorCount: number;
}

export const departmentsWithDoctors: DepartmentWithDoctors[] = [
  {
    name: 'Internal Medicine',
    nameAr: 'الطب الباطني',
    clinicCode: 'R01ERC',
    doctors: doctorsWithClinicCodes.filter(doctor => doctor.department === 'Internal Medicine'),
    doctorCount: doctorsWithClinicCodes.filter(doctor => doctor.department === 'Internal Medicine').length
  },
  {
    name: 'General Surgery',
    nameAr: 'الجراحة العامة',
    clinicCode: 'GI 1',
    doctors: doctorsWithClinicCodes.filter(doctor => doctor.department === 'General Surgery'),
    doctorCount: doctorsWithClinicCodes.filter(doctor => doctor.department === 'General Surgery').length
  },
  {
    name: 'Pediatrics',
    nameAr: 'طب الأطفال',
    clinicCode: 'R002PED',
    doctors: doctorsWithClinicCodes.filter(doctor => doctor.department === 'Pediatrics'),
    doctorCount: doctorsWithClinicCodes.filter(doctor => doctor.department === 'Pediatrics').length
  },
  {
    name: 'Neonatal',
    nameAr: 'حديثي الولادة',
    clinicCode: 'R01NEO',
    doctors: doctorsWithClinicCodes.filter(doctor => doctor.department === 'Neonatal'),
    doctorCount: doctorsWithClinicCodes.filter(doctor => doctor.department === 'Neonatal').length
  },
  {
    name: 'Clinical Pharmacy',
    nameAr: 'الصيدلة الأكلينيكية',
    clinicCode: undefined,
    doctors: doctorsWithClinicCodes.filter(doctor => doctor.department === 'Clinical Pharmacy'),
    doctorCount: doctorsWithClinicCodes.filter(doctor => doctor.department === 'Clinical Pharmacy').length
  }
];

// Helper function to get department by name
export const getDepartmentByName = (departmentName: string): DepartmentWithDoctors | undefined => {
  return departmentsWithDoctors.find(dept => dept.name === departmentName);
};

// Helper function to get department by clinic code
export const getDepartmentByClinicCode = (clinicCode: string): DepartmentWithDoctors | undefined => {
  return departmentsWithDoctors.find(dept => dept.clinicCode === clinicCode);
};

// Helper function to get all departments with clinic codes
export const getDepartmentsWithClinicCodes = (): DepartmentWithDoctors[] => {
  return departmentsWithDoctors.filter(dept => dept.clinicCode !== undefined);
};

// Helper function to get departments without clinic codes
export const getDepartmentsWithoutClinicCodes = (): DepartmentWithDoctors[] => {
  return departmentsWithDoctors.filter(dept => dept.clinicCode === undefined);
};
