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
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export interface MissionPoint {
  id: string;
  text: string;
}

export const missionPoints: MissionPoint[] = [
  { id: "mission-1", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: "mission-2", text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { id: "mission-3", text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." },
];

export interface ValueItem {
  id: string;
  title: string;
  description: string;
}

export const values: ValueItem[] = [
  { id: "value-1", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur." },
  { id: "value-2", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur." },
  { id: "value-3", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur." },
  { id: "value-4", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur." },
];
