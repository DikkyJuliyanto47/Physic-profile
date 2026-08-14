/*
 * @Author: galhkoernia
 * @Date: 2026-08-08 09:21:42
 * @Last Modified by: galhkoernia
 */

export interface Member {
  id: string;
  name: string;
  institution: string;
  role: string;
  slug: string;
  photo?: string;
}

export interface MemberGroup {
  id: string;
  title: string;
  members: Member[];
}

export const memberGroups: MemberGroup[] = [
  {
    id: "leadership",
    title: "Pimpinan",
    members: [
      {
        id: "m-001",
        name: "Prof. Dr. Munasir, S.Si., M.Si.",
        institution: "Universitas Negeri Surabaya (UNESA)",
        role: "Ketua",
        slug: "prof-dr-munasir",
      },
      {
        id: "m-002",
        name: "Mita Anggaryani, M.Pd., Ph.D.",
        institution: "Universitas Negeri Surabaya (UNESA)",
        role: "Sekretaris",
        slug: "mita-anggaryani",
      },
      {
        id: "m-003",
        name: "Primasari Cahya Wardhani, S.Si., M.Sc.",
        institution:
          "Universitas Pembangunan Nasional Veteran Jawa Timur (UPN)",
        role: "Bendahara",
        slug: "primasari-cahya-wardhani",
      },
    ],
  },

  {
    id: "education",
    title: "Bidang Pendidikan dan Pengajaran",
    members: [
      {
        id: "m-004",
        name: "Prof. Dr. Mashuri, M.Si.",
        institution: "Institut Teknologi Sepuluh Nopember (ITS)",
        role: "Koordinator",
        slug: "prof-dr-mashuri",
      },
      {
        id: "m-005",
        name: "Dr. Muhammad Satriawan, M.Pd.",
        institution: "Universitas Negeri Surabaya (UNESA)",
        role: "Anggota",
        slug: "dr-muhammad-satriawan",
      },
      {
        id: "m-006",
        name: "Dr. Nuril Ukrowiyah, M.Si.",
        institution: "Universitas Airlangga (UNAIR)",
        role: "Anggota",
        slug: "dr-nuril-ukrowiyah",
      },
      {
        id: "m-007",
        name: "Dr. Jane Koswojo, M.Pd.",
        institution: "Universitas Katolik Widya Mandala Surabaya (UKWMS)",
        role: "Anggota",
        slug: "dr-jane-koswojo",
      },
      {
        id: "m-008",
        name: "Dr. Titin Sunarti, M.S.",
        institution: "Universitas Negeri Surabaya (UNESA)",
        role: "Anggota",
        slug: "dr-titin-sunarti",
      },
      {
        id: "m-009",
        name: "Dr. Sri Yani Purwaningsih",
        institution: "Institut Teknologi Sepuluh Nopember (ITS)",
        role: "Anggota",
        slug: "dr-sri-yani-purwaningsih",
      },
      {
        id: "m-010",
        name: "Ike Lusi Melina, S.Pd., M.Pd.",
        institution: "Universitas Jember (UNEJ)",
        role: "Anggota",
        slug: "ike-lusi-melina",
      },
      {
        id: "m-011",
        name: "Nenni Mona Aruan, S.Pd., M.Si.",
        institution:
          "Universitas Pembangunan Nasional Veteran Jawa Timur (UPN)",
        role: "Anggota",
        slug: "nenni-mona-aruan",
      },
    ],
  },

  {
    id: "research",
    title: "Bidang Penelitian dan Publikasi",
    members: [
      {
        id: "m-012",
        name: "Prof. Dr. Suryani Dyah Astuti, M.Si.",
        institution: "Universitas Airlangga (UNAIR)",
        role: "Koordinator",
        slug: "prof-dr-suryani-dyah-astuti",
      },
      {
        id: "m-013",
        name: "Prof. Endarko, Ph.D.",
        institution: "Institut Teknologi Sepuluh Nopember (ITS)",
        role: "Anggota",
        slug: "prof-endarko",
      },
      {
        id: "m-014",
        name: "Berjitta Dwi Annawati, M.Sc., Ph.D.",
        institution: "Universitas Katolik Widya Mandala Surabaya (UKWMS)",
        role: "Anggota",
        slug: "berjitta-dwi-annawati",
      },
      {
        id: "m-015",
        name: "Dr. Nugrahani Primari Putri, M.Si.",
        institution: "Universitas Negeri Surabaya (UNESA)",
        role: "Anggota",
        slug: "dr-nugrahani-primari-putri",
      },
      {
        id: "m-016",
        name: "Dr. Eng. Evi Suebah, M.Si., M.Sc.",
        institution: "Universitas Negeri Surabaya (UNESA)",
        role: "Anggota",
        slug: "dr-eng-evi-suebah",
      },
      {
        id: "m-017",
        name: "Niswatul Karimah, S.Si., M.Si.",
        institution: "Universitas Jember (UNEJ)",
        role: "Anggota",
        slug: "niswatul-karimah",
      },
      {
        id: "m-018",
        name: "Akbar Sujiwa, S.Si., M.Si.",
        institution:
          "Universitas Pembangunan Nasional Veteran Jawa Timur (UPN)",
        role: "Anggota",
        slug: "akbar-sujiwa",
      },
    ],
  },

  {
    id: "partnership",
    title: "Bidang Kerjasama dan Hubungan Masyarakat",
    members: [
      {
        id: "m-019",
        name: "Dr. Siswanto, M.Si.",
        institution: "Universitas Airlangga (UNAIR)",
        role: "Koordinator",
        slug: "dr-siswanto",
      },
      {
        id: "m-020",
        name: "Dr. Suyatno",
        institution: "Institut Teknologi Sepuluh Nopember (ITS)",
        role: "Anggota",
        slug: "dr-suyatno",
      },
      {
        id: "m-021",
        name: "Dr. Tri Lestari, M.Pd.",
        institution: "Universitas Katolik Widya Mandala Surabaya (UKWMS)",
        role: "Anggota",
        slug: "dr-tri-lestari",
      },
      {
        id: "m-022",
        name: "Dr. Diah Hari Kusumawati, M.Si.",
        institution: "Universitas Negeri Surabaya (UNESA)",
        role: "Anggota",
        slug: "dr-diah-hari-kusumawati",
      },
      {
        id: "m-023",
        name: "Dr. Oka Saputra, M.Pd.",
        institution: "Universitas Negeri Surabaya (UNESA)",
        role: "Anggota",
        slug: "dr-oka-saputra",
      },
      {
        id: "m-024",
        name: "Chilwatun Nasiroh, S.Pd., M.Si.",
        institution: "Universitas Jember (UNEJ)",
        role: "Anggota",
        slug: "chilwatun-nasiroh",
      },
      {
        id: "m-025",
        name: "Reffany Choirur Rizkiarna, S.Si., M.Sc.",
        institution:
          "Universitas Pembangunan Nasional Veteran Jawa Timur (UPN)",
        role: "Anggota",
        slug: "reffany-choirur-rizkiarna",
      },
    ],
  },

  {
    id: "technology",
    title: "Bidang Sistem dan Teknologi Informasi",
    members: [
      {
        id: "m-026",
        name: "Dr. Endah Rahmawati, S.T., M.Si.",
        institution: "Universitas Negeri Surabaya (UNESA)",
        role: "Koordinator",
        slug: "dr-endah-rahmawati",
      },
      {
        id: "m-027",
        name: "Dr. Muhimmatul Khoiro, S.Si.",
        institution: "Universitas Negeri Surabaya (UNESA)",
        role: "Anggota",
        slug: "dr-muhimmatul-khoiro",
      },
      {
        id: "m-028",
        name: "Muhammad Habibbuloh, S.Pd., M.Pd.",
        institution: "Universitas Negeri Surabaya (UNESA)",
        role: "Anggota",
        slug: "muhammad-habibbuloh",
      },
    ],
  },

  {
    id: "campus-coordinator",
    title: "Koordinator Anggota",
    members: [
      {
        id: "m-029",
        name: "Dr. Lila Yuwana, M.Si.",
        institution: "Institut Teknologi Sepuluh Nopember (ITS)",
        role: "Koordinator ITS",
        slug: "dr-lila-yuwana",
      },
      {
        id: "m-030",
        name: "Febdian Rusydi, M.Sc., Ph.D.",
        institution: "Universitas Airlangga (UNAIR)",
        role: "Koordinator UNAIR",
        slug: "febdian-rusydi",
      },
      {
        id: "m-031",
        name: "Lailatul Nuraini, S.Pd., M.Pd.",
        institution: "Universitas Jember (UNEJ)",
        role: "Koordinator UNEJ",
        slug: "lailatul-nuraini",
      },
      {
        id: "m-032",
        name: "Prof. Dr. Madlazim, M.Si.",
        institution: "Universitas Negeri Surabaya (UNESA)",
        role: "Koordinator UNESA",
        slug: "prof-dr-madlazim",
      },
      {
        id: "m-033",
        name: "Dr. Nur Aini Fauziyah, S.Pd., M.Si.",
        institution:
          "Universitas Pembangunan Nasional Veteran Jawa Timur (UPN)",
        role: "Koordinator UPN",
        slug: "dr-nur-aini-fauziyah",
      },
      {
        id: "m-034",
        name: "Herwinarso, S.Pd., M.Si.",
        institution: "Universitas Katolik Widya Mandala Surabaya (UKWMS)",
        role: "Koordinator UKWMS",
        slug: "herwinarso",
      },
      {
        id: "m-035",
        name: "Ulfa Mahfudli Fadli, S.Si., M.Si.",
        institution: "Universitas Bahaudin Mudhary Madura",
        role: "Koordinator Universitas Bahaudin Mudhary Madura",
        slug: "ulfa-mahfudli-fadli",
      },
      {
        id: "m-036",
        name: "Uswatun Chasanah, M.Si.",
        institution: "Universitas Muhammadiyah Lamongan",
        role: "Koordinator Universitas Muhammadiyah Lamongan",
        slug: "uswatun-chasanah",
      },
      {
        id: "m-037",
        name: "Suprianto, S.Pd., M.Si.",
        institution: "Universitas Islam Madura (UIM)",
        role: "Koordinator Universitas Islam Madura",
        slug: "suprianto",
      },
    ],
  },
];

export const members: Member[] = memberGroups.flatMap((group) => group.members);

export const institutions = [
  "Semua Universitas",
  ...Array.from(new Set(members.map((member) => member.institution))),
];

export const roles = [
  "Semua Jabatan",
  ...Array.from(new Set(members.map((member) => member.role))),
];