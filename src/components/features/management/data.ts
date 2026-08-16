export interface ManagementMember {
  id: string;
  name: string;
  role: string;
  description: string;
}

export interface ManagementGroup {
  id: string;
  title: string;
  members: ManagementMember[];
}
