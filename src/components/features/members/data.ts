export interface Member {
  id: string;
  name: string;
  email: string | null;
  field: string;
  institution: string;
  institutionSlug?: string | null;
  photo?: string | null;
  detailUrl?: string | null;
  emailPublic?: string | null;
}
