export interface Member {
  id: string;
  name: string;
  email: string;
  field: string;
  institution: string;
  institutionSlug?: string;
  photo?: string | null;
}
