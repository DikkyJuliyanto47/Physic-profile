export interface ManagementMember {
  id: string;
  name: string;
  role: string;
  email: string | null;
  image: string;
}

export interface ManagementGroup {
  id: string;
  title: string;
  members: ManagementMember[];
}
