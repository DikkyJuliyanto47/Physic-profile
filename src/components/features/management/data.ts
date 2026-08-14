/*
 * @Author: galhkoernia
 * @Date: 2026-08-08
 */

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

export const managementGroups: ManagementGroup[] = [
  {
    id: "chairman",
    title: "Ketua Cabang",
    members: [
      {
        id: "mg-001",
        name: "Prof. Dr. Munasir, S.Si., M.Si.",
        role: "Ketua",
        description: "Universitas Negeri Surabaya (UNESA)",
      },
    ],
  },

  {
    id: "secretariat",
    title: "Sekretariat",
    members: [
      {
        id: "mg-002",
        name: "Mita Anggaryani, M.Pd., Ph.D.",
        role: "Sekretaris",
        description: "Universitas Negeri Surabaya (UNESA)",
      },
      {
        id: "mg-003",
        name: "Primasari Cahya Wardhani, S.Si., M.Sc.",
        role: "Bendahara",
        description:
          "Universitas Pembangunan Nasional Veteran Jawa Timur (UPN)",
      },
    ],
  },

  {
    id: "education",
    title: "Bidang Pendidikan dan Pengajaran",
    members: [
      {
        id: "mg-004",
        name: "Prof. Dr. Mashuri, M.Si.",
        role: "Koordinator",
        description: "Institut Teknologi Sepuluh Nopember (ITS)",
      },
      {
        id: "mg-005",
        name: "Dr. Muhammad Satriawan, M.Pd.",
        role: "Anggota",
        description: "Universitas Negeri Surabaya (UNESA)",
      },
      {
        id: "mg-006",
        name: "Dr. Nuril Ukrowiyah, M.Si.",
        role: "Anggota",
        description: "Universitas Airlangga (UNAIR)",
      },
      {
        id: "mg-007",
        name: "Dr. Jane Koswojo, M.Pd.",
        role: "Anggota",
        description: "Universitas Katolik Widya Mandala Surabaya (UKWMS)",
      },
      {
        id: "mg-008",
        name: "Dr. Titin Sunarti, M.S.",
        role: "Anggota",
        description: "Universitas Negeri Surabaya (UNESA)",
      },
      {
        id: "mg-009",
        name: "Dr. Sri Yani Purwaningsih",
        role: "Anggota",
        description: "Institut Teknologi Sepuluh Nopember (ITS)",
      },
      {
        id: "mg-010",
        name: "Ike Lusi Melina, S.Pd., M.Pd.",
        role: "Anggota",
        description: "Universitas Jember (UNEJ)",
      },
      {
        id: "mg-011",
        name: "Nenni Mona Aruan, S.Pd., M.Si.",
        role: "Anggota",
        description:
          "Universitas Pembangunan Nasional Veteran Jawa Timur (UPN)",
      },
    ],
  },

  {
    id: "research",
    title: "Bidang Penelitian dan Publikasi",
    members: [
      {
        id: "mg-012",
        name: "Prof. Dr. Suryani Dyah Astuti, M.Si.",
        role: "Koordinator",
        description: "Universitas Airlangga (UNAIR)",
      },
      {
        id: "mg-013",
        name: "Prof. Endarko, Ph.D.",
        role: "Anggota",
        description: "Institut Teknologi Sepuluh Nopember (ITS)",
      },
      {
        id: "mg-014",
        name: "Berjitta Dwi Annawati, M.Sc., Ph.D.",
        role: "Anggota",
        description: "Universitas Katolik Widya Mandala Surabaya (UKWMS)",
      },
      {
        id: "mg-015",
        name: "Dr. Nugrahani Primari Putri, M.Si.",
        role: "Anggota",
        description: "Universitas Negeri Surabaya (UNESA)",
      },
      {
        id: "mg-016",
        name: "Dr. Eng. Evi Suebah, M.Si., M.Sc.",
        role: "Anggota",
        description: "Universitas Negeri Surabaya (UNESA)",
      },
      {
        id: "mg-017",
        name: "Niswatul Karimah, S.Si., M.Si.",
        role: "Anggota",
        description: "Universitas Jember (UNEJ)",
      },
      {
        id: "mg-018",
        name: "Akbar Sujiwa, S.Si., M.Si.",
        role: "Anggota",
        description:
          "Universitas Pembangunan Nasional Veteran Jawa Timur (UPN)",
      },
    ],
  },

  {
    id: "partnership",
    title: "Bidang Kerjasama dan Hubungan Masyarakat",
    members: [
      {
        id: "mg-019",
        name: "Dr. Siswanto, M.Si.",
        role: "Koordinator",
        description: "Universitas Airlangga (UNAIR)",
      },
      {
        id: "mg-020",
        name: "Dr. Suyatno",
        role: "Anggota",
        description: "Institut Teknologi Sepuluh Nopember (ITS)",
      },
      {
        id: "mg-021",
        name: "Dr. Tri Lestari, M.Pd.",
        role: "Anggota",
        description: "Universitas Katolik Widya Mandala Surabaya (UKWMS)",
      },
      {
        id: "mg-022",
        name: "Dr. Diah Hari Kusumawati, M.Si.",
        role: "Anggota",
        description: "Universitas Negeri Surabaya (UNESA)",
      },
      {
        id: "mg-023",
        name: "Dr. Oka Saputra, M.Pd.",
        role: "Anggota",
        description: "Universitas Negeri Surabaya (UNESA)",
      },
      {
        id: "mg-024",
        name: "Chilwatun Nasiroh, S.Pd., M.Si.",
        role: "Anggota",
        description: "Universitas Jember (UNEJ)",
      },
      {
        id: "mg-025",
        name: "Reffany Choirur Rizkiarna, S.Si., M.Sc.",
        role: "Anggota",
        description:
          "Universitas Pembangunan Nasional Veteran Jawa Timur (UPN)",
      },
    ],
  },

  {
    id: "it",
    title: "Bidang Sistem dan Teknologi Informasi",
    members: [
      {
        id: "mg-026",
        name: "Dr. Endah Rahmawati, S.T., M.Si.",
        role: "Koordinator",
        description: "Universitas Negeri Surabaya (UNESA)",
      },
      {
        id: "mg-027",
        name: "Dr. Muhimmatul Khoiro, S.Si.",
        role: "Anggota",
        description: "Universitas Negeri Surabaya (UNESA)",
      },
      {
        id: "mg-028",
        name: "Muhammad Habibbuloh, S.Pd., M.Pd.",
        role: "Anggota",
        description: "Universitas Negeri Surabaya (UNESA)",
      },
    ],
  },

  {
    id: "campus-coordinator",
    title: "Koordinator Anggota",
    members: [
      {
        id: "mg-029",
        name: "Dr. Lila Yuwana, M.Si.",
        role: "Koordinator ITS",
        description: "Institut Teknologi Sepuluh Nopember (ITS)",
      },
      {
        id: "mg-030",
        name: "Febdian Rusydi, M.Sc., Ph.D.",
        role: "Koordinator UNAIR",
        description: "Universitas Airlangga (UNAIR)",
      },
      {
        id: "mg-031",
        name: "Lailatul Nuraini, S.Pd., M.Pd.",
        role: "Koordinator UNEJ",
        description: "Universitas Jember (UNEJ)",
      },
      {
        id: "mg-032",
        name: "Prof. Dr. Madlazim, M.Si.",
        role: "Koordinator UNESA",
        description: "Universitas Negeri Surabaya (UNESA)",
      },
      {
        id: "mg-033",
        name: "Dr. Nur Aini Fauziyah, S.Pd., M.Si.",
        role: "Koordinator UPN",
        description:
          "Universitas Pembangunan Nasional Veteran Jawa Timur (UPN)",
      },
      {
        id: "mg-034",
        name: "Herwinarso, S.Pd., M.Si.",
        role: "Koordinator UKWMS",
        description: "Universitas Katolik Widya Mandala Surabaya (UKWMS)",
      },
      {
        id: "mg-035",
        name: "Ulfa Mahfudli Fadli, S.Si., M.Si.",
        role: "Koordinator Universitas Bahaudin Mudhary Madura",
        description: "Universitas Bahaudin Mudhary Madura",
      },
      {
        id: "mg-036",
        name: "Uswatun Chasanah, M.Si.",
        role: "Koordinator Universitas Muhammadiyah Lamongan",
        description: "Universitas Muhammadiyah Lamongan",
      },
      {
        id: "mg-037",
        name: "Suprianto, S.Pd., M.Si.",
        role: "Koordinator Universitas Islam Madura",
        description: "Universitas Islam Madura (UIM)",
      },
    ],
  },
];