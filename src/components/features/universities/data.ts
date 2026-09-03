
export interface University {
  id: string;
  slug: string | null;
  name: string;
  shortName: string | null;
  logoUrl: string | null;
  address: string | null;
  websiteUrl: string | null;
  _count: {
    members: number;
  };
}

export function getUniversityId(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
