export interface DepartmentDetailSection {
  title: string;
  titleAr?: string;
  content?: string;
  contentAr?: string;
  items?: string[];
  itemsAr?: string[];
  subsections?: {
    title: string;
    titleAr?: string;
    content?: string;
    contentAr?: string;
    items?: string[];
    itemsAr?: string[];
  }[];
}

export interface DepartmentDetail {
  slug: string;
  name: string;
  nameAr: string;
  intro: string;
  introAr?: string;
  sections: DepartmentDetailSection[];
  subDepartments?: {
    slug: string;
    name: string;
    nameAr: string;
    intro: string;
    introAr?: string;
    sections: DepartmentDetailSection[];
    subspecialityId?: string;
  }[];
}
