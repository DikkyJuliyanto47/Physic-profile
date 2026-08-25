export interface Member {
  id: string;
  name: string;
  email: string;
  field: string;
  institution: string;
  institutionSlug?: string;
  photo?: string | null;
  detailUrl?: string | null;
}

export const members: Member[] = [
  {
    id: "member-1",
    name: "Dr. Ahmad Fauzi, M.Si.",
    email: "ahmad.fauzi@example.com",
    field: "Fisika Material",
    institution: "Universitas Airlangga",
    institutionSlug: "universitas-airlangga",
    photo: "/images/members/ahmad-fauzi.jpg",
  },
  {
    id: "member-2",
    name: "Dr. Siti Rahayu, M.Sc.",
    email: "siti.rahayu@example.com",
    field: "Fisika Teoretis",
    institution: "Universitas Airlangga",
    institutionSlug: "universitas-airlangga",
    photo: "/images/members/siti-rahayu.jpg",
  },
  {
    id: "member-3",
    name: "Budi Santoso, M.T.",
    email: "budi.santoso@example.com",
    field: "Instrumentasi Fisika",
    institution: "Universitas Airlangga",
    institutionSlug: "universitas-airlangga",
    photo: "/images/members/budi-santoso.jpg",
  },
  {
    id: "member-4",
    name: "Dr. Rina Kusuma, M.Si.",
    email: "rina.kusuma@example.com",
    field: "Fisika Komputasi",
    institution: "Institut Teknologi Sepuluh Nopember",
    institutionSlug: "institut-teknologi-sepuluh-nopember",
    photo: "/images/members/rina-kusuma.jpg",
  },
  {
    id: "member-5",
    name: "Andi Prasetyo, M.Sc.",
    email: "andi.prasetyo@example.com",
    field: "Fisika Material",
    institution: "Institut Teknologi Sepuluh Nopember",
    institutionSlug: "institut-teknologi-sepuluh-nopember",
    photo: "/images/members/andi-prasetyo.jpg",
  },
  {
    id: "member-6",
    name: "Dewi Anggraini, S.Si.",
    email: "dewi.anggraini@example.com",
    field: "Fisika Medis",
    institution: "Universitas Negeri Surabaya",
    institutionSlug: "universitas-negeri-surabaya",
    photo: "/images/members/dewi-anggraini.jpg",
  },
  {
    id: "member-7",
    name: "Fajar Nugroho, S.Pd.",
    email: "fajar.nugroho@example.com",
    field: "Pendidikan Fisika",
    institution: "Universitas Negeri Surabaya",
    institutionSlug: "universitas-negeri-surabaya",
    photo: "/images/members/fajar-nugroho.jpg",
  },
  {
    id: "member-8",
    name: "Maya Putri, M.Si.",
    email: "maya.putri@example.com",
    field: "Fisika Lingkungan",
    institution: "Universitas Negeri Surabaya",
    institutionSlug: "universitas-negeri-surabaya",
    photo: "/images/members/maya-putri.jpg",
  },
  {
    id: "member-9",
    name: "Rizky Hidayat, M.Sc.",
    email: "rizky.hidayat@example.com",
    field: "Astrofisika",
    institution: "Universitas Brawijaya",
    institutionSlug: "universitas-brawijaya",
    photo: "/images/members/rizky-hidayat.jpg",
  },
  {
    id: "member-10",
    name: "Nadia Permata, S.Si., M.Si.",
    email: "nadia.permata@example.com",
    field: "Fisika Terapan",
    institution: "Universitas Brawijaya",
    institutionSlug: "universitas-brawijaya",
    photo: "/images/members/nadia-permata.jpg",
  },
];