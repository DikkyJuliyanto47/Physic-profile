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
        id: "mgmt-1",
        name: "Prof. Dr. Munasir, S.Si., M.Si.",
        role: "Ketua",
        email: "munasir_physics@unesa.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-2",
        name: "Mita Anggaryani, M.Pd., Ph.D.",
        role: "Sekretaris",
        email: "mitaanggaryani@unesa.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-3",
        name: "Primasari Cahya Wardhani, S.Si., M.Sc.",
        role: "Bendahara",
        email: "primasari.cahya.fisika@upnjatim.ac.id",
        image: "/assets/members/profile.jpg",
      },
    ],
  },
  {
    id: "bidang-pendidikan-pengajaran",
    title: "Bidang Pendidikan dan Pengajaran",
    members: [
      {
        id: "mgmt-4",
        name: "Prof. Dr. Mashuri, M.Si.",
        role: "Koordinator",
        email: "mashuri@its.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-5",
        name: "Dr. Muhammad Satriawan, M.Pd.",
        role: "Anggota",
        email: "muhammadsatriawan@unesa.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-6",
        name: "Dr. Nuril Ukhrowiyah, M.Si.",
        role: "Anggota",
        email: "nurilukhrowiyah@fst.unair.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-7",
        name: "Dr. Jane Koswojo, M.Pd.",
        role: "Anggota",
        email: "janekoswojo@gmail.com",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-8",
        name: "Dr. Titin Sunarti, M.Si.",
        role: "Anggota",
        email: "titinsunarti@unesa.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-9",
        name: "Dr. Sri Yani Purwaningsih",
        role: "Anggota",
        email: "sriyani@its.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-10",
        name: "Ike Lusi Meilina, S.Pd., M.Pd.",
        role: "Anggota",
        email: "ikelusimeilina@gmail.com",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-11",
        name: "Nenni Mona Aruan, S.Pd., M.Si.",
        role: "Anggota",
        email: "nenni.mona.ft@upnjatim.ac.id",
        image: "/assets/members/profile.jpg",
      },
    ],
  },
  {
    id: "bidang-penelitian-publikasi",
    title: "Bidang Penelitian dan Publikasi",
    members: [
      {
        id: "mgmt-12",
        name: "Prof. Dr. Suryani Dyah Astuti, M.Si.",
        role: "Koordinator",
        email: "suryanidyah@fst.unair.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-13",
        name: "Prof. Endarko, Ph.D.",
        role: "Anggota",
        email: "endarko@its.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-14",
        name: "Bergitta Dwi Annawati, M.Sc., Ph.D.",
        role: "Anggota",
        email: "bergittadwi@ukwms.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-15",
        name: "Dr. Nugrahani Primary Putri, M.Si.",
        role: "Anggota",
        email: "nugrahaniprimary@unesa.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-16",
        name: "Dr. Eng. Evi Suebah, M.Si., M.Sc.",
        role: "Anggota",
        email: "evi.suebah@unesa.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-17",
        name: "Niswatul Kariimah, S.Si., M.Si.",
        role: "Anggota",
        email: "niswatul@unej.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-18",
        name: "Akbar Sujiwa, S.Si., M.Si.",
        role: "Anggota",
        email: "akbarsujiwa.ft@upnjatim.ac.id",
        image: "/assets/members/profile.jpg",
      },
    ],
  },
  {
    id: "bidang-kerjasama-humas",
    title: "Bidang Kerjasama dan Hubungan Masyarakat",
    members: [
      {
        id: "mgmt-19",
        name: "Dr. Siswanto, M.Si.",
        role: "Koordinator",
        email: "siswanto@fst.unair.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-20",
        name: "Dr. Suyatno",
        role: "Anggota",
        email: "suyatno@its.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-21",
        name: "Dr. Tri Lestari, M.Pd.",
        role: "Anggota",
        email: "trilestari@ukwms.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-22",
        name: "Dr. Diah Hari Kusumawati, M.Si.",
        role: "Anggota",
        email: "diahkusumawati@unesa.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-23",
        name: "Dr. Oka Saputra, M.Pd.",
        role: "Anggota",
        email: "oka.saputra@unesa.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-24",
        name: "Chilwatun Nasiroh, S.Pd., M.Si.",
        role: "Anggota",
        email: "chilwatun@unej.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-25",
        name: "Reffany Choiru Rizkiarna, S.Si., M.Sc.",
        role: "Anggota",
        email: "reffany@upnjatim.ac.id",
        image: "/assets/members/profile.jpg",
      },
    ],
  },
  {
    id: "bidang-sistem-teknologi-informasi",
    title: "Bidang Sistem dan Teknologi Informasi",
    members: [
      {
        id: "mgmt-26",
        name: "Dr. Endah Rahmawati, S.T., M.Si.",
        role: "Koordinator",
        email: "endahrahmawati@unesa.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-27",
        name: "Dr. Muhimmatul Khoiro, S.Si.",
        role: "Anggota",
        email: "muhimmatul@unesa.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-28",
        name: "Muhammad Habibbuloh, S.Pd., M.Pd.",
        role: "Anggota",
        email: "habibbuloh@unesa.ac.id",
        image: "/assets/members/profile.jpg",
      },
    ],
  },
  {
    id: "koordinator-anggota",
    title: "Koordinator Anggota",
    members: [
      {
        id: "mgmt-29",
        name: "Dr. Lila Yuwana, M.Si.",
        role: "Koordinator ITS",
        email: "lila.yuwana@its.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-30",
        name: "Febdian Rusydi, M.Sc., Ph.D.",
        role: "Koordinator UNAIR",
        email: "rusydi@fst.unair.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-31",
        name: "Lailatul Nuraini, S.Pd., M.Pd.",
        role: "Koordinator UNEJ",
        email: "lailatul.fkip@unej.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-32",
        name: "Prof. Dr. Madlazim, M.Si.",
        role: "Koordinator UNESA",
        email: "madlazim@unesa.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-33",
        name: "Dr. Nur Aini Fauziyah, S.Pd., M.Si.",
        role: "Koordinator UPN",
        email: "nur.aini.fisika@upnjatim.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-34",
        name: "Herwinarso, S.Pd., M.Si.",
        role: "Koordinator UKWMS",
        email: "herwinarso@ukwms.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-35",
        name: "Ulfa Mahfudli Fadli, S.Si., M.Si.",
        role: "Koordinator Universitas Billfath Lamongan",
        email: "ulfa@billfath.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-36",
        name: "Uswatun Chasanah, M.Si.",
        role: "Koordinator Universitas Muhammadiyah Lamongan",
        email: "uswatun@umla.ac.id",
        image: "/assets/members/profile.jpg",
      },
      {
        id: "mgmt-37",
        name: "Suprianto, S.Pd., M.Si.",
        role: "Koordinator Universitas Islam Madura",
        email: "suprianto@uim.ac.id",
        image: "/assets/members/profile.jpg",
      },
    ],
  },
];