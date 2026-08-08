/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 09:21:42 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 09:31:35
 */

export interface Member {
  id: string;
  name: string;
  institution: string;
  expertise: string;
  email: string;
  photo?: string;

  googleScholar?: string;
  scopus?: string;
  orcid?: string;

  slug: string;
}

export const members: Member[] = [
  {
    id: "member-01",
    name: "Lorem Ipsum",
    institution: "Universitas Negeri Surabaya",
    expertise: "Fisika Material",
    email: "consectur@adipiscing.ac.id",
    googleScholar: "#",
    scopus: "#",
    orcid: "#",
    slug: "lorem-ipsum-01",
  },
  {
    id: "member-02",
    name: "Lorem Ipsum",
    institution: "Institut Teknologi Sepuluh Nopember",
    expertise: "Fisika Teoretis",
    email: "consectur@adipiscing.ac.id",
    googleScholar: "#",
    scopus: "#",
    orcid: "#",
    slug: "lorem-ipsum-02",
  },
  {
    id: "member-03",
    name: "Lorem Ipsum",
    institution: "Universitas Airlangga",
    expertise: "Fisika Medis",
    email: "consectur@adipiscing.ac.id",
    googleScholar: "#",
    scopus: "#",
    orcid: "#",
    slug: "lorem-ipsum-03",
  },
  {
    id: "member-04",
    name: "Lorem Ipsum",
    institution: "Universitas Negeri Surabaya",
    expertise: "Instrumentasi",
    email: "consectur@adipiscing.ac.id",
    googleScholar: "#",
    scopus: "#",
    orcid: "#",
    slug: "lorem-ipsum-04",
  }
];

export const institutions = [
  "Semua Universitas",
  ...Array.from(
    new Set(members.map((member) => member.institution)),
  ),
];

export const expertiseFields = [
  "Semua Bidang",
  ...Array.from(
    new Set(members.map((member) => member.expertise)),
  ),
];