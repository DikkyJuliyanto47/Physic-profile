/*
 * @Author: galhkoernia 
 * @Date: 2026-08-06 18:24:23 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-07 18:25:09
 */

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export const milestones: Milestone[] = [
  {
    id: "milestone-1",
    year: "2010",
    title: "Lorem Ipsum",
    description: "Dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "milestone-2",
    year: "2015",
    title: "Lorem Ipsum",
    description: "Dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "milestone-3",
    year: "2022",
    title: "Lorem Ipsum",
    description: "Dolor sit amet, consectetur adipiscing elit.",
  },
];

export const visionText =
  "Menjadi wadah profesional bagi insan fisika untuk mengembangkan ilmu pengetahuan, pendidikan, inovasi, dan kolaborasi yang memberikan kontribusi bagi masyarakat dan kemajuan Indonesia."
export interface MissionPoint {
  id: string;
  text: string;
}

export const missionPoints: MissionPoint[] = [
  { id: "mission-1", text: "Mengembangkan pendidikan dan pembelajaran fisika melalui peningkatan kualitas, inovasi, dan pengembangan kompetensi." },
  { id: "mission-2", text: "Mendorong penelitian dan publikasi ilmiah serta memperkuat kolaborasi antarinsan fisika dan perguruan tingg." },
  { id: "mission-3", text: "Membangun kerja sama dan jejaring dengan perguruan tinggi, industri, pemerintah, dan masyarakat." },
  { id: "mission-4", text: "Meningkatkan kontribusi ilmu fisika dalam menjawab kebutuhan dan tantangan masyarakat"},
];

