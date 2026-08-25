export interface ManagementMember {
  id: string;
  name: string;
  role: string;
  email: string;
  image: string;
}

export interface ManagementGroup {
  id: string;
  title: string;
  members: ManagementMember[];
}

export const managementGroups: ManagementGroup[] = [
  {
    id: "pengurus-inti",
    title: "Pengurus Inti",
    members: [
      {
        id: "member-1",
        name: "Dr. Ahmad Fauzi, M.Si.",
        role: "Ketua",
        email: "ahmad.fauzi@example.com",
        image: "/images/management/ahmad-fauzi.jpg",
      },
      {
        id: "member-2",
        name: "Dr. Siti Rahayu, M.Sc.",
        role: "Wakil Ketua",
        email: "siti.rahayu@example.com",
        image: "/images/management/siti-rahayu.jpg",
      },
      {
        id: "member-3",
        name: "Budi Santoso, M.T.",
        role: "Sekretaris",
        email: "budi.santoso@example.com",
        image: "/images/management/budi-santoso.jpg",
      },
    ],
  },
  {
    id: "bidang-riset-publikasi",
    title: "Bidang Riset dan Publikasi",
    members: [
      {
        id: "member-4",
        name: "Dr. Rina Kusuma, M.Si.",
        role: "Koordinator",
        email: "rina.kusuma@example.com",
        image: "/images/management/rina-kusuma.jpg",
      },
      {
        id: "member-5",
        name: "Andi Prasetyo, M.Sc.",
        role: "Anggota",
        email: "andi.prasetyo@example.com",
        image: "/images/management/andi-prasetyo.jpg",
      },
    ],
  },
  {
    id: "bidang-hubungan-masyarakat",
    title: "Bidang Hubungan Masyarakat",
    members: [
      {
        id: "member-6",
        name: "Dewi Anggraini, S.Si.",
        role: "Koordinator",
        email: "dewi.anggraini@example.com",
        image: "/images/management/dewi-anggraini.jpg",
      },
      {
        id: "member-7",
        name: "Fajar Nugroho, S.Pd.",
        role: "Anggota",
        email: "fajar.nugroho@example.com",
        image: "/images/management/fajar-nugroho.jpg",
      },
    ],
  },
];