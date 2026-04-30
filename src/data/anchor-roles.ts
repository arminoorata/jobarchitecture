export type AnchorRole = {
  id: string;
  title: string;
  function: string;
  family: string;
  track: string;
  level: string;
  titleExample: string;
  marketMatch: string;
};

export const anchorRoles: AnchorRole[] = [
  {
    id: "platform-eng",
    title: "Senior Platform Engineer",
    function: "Engineering",
    family: "Software Engineering, Platform",
    track: "Individual contributor",
    level: "P5 Expert",
    titleExample: "Senior Platform Engineer",
    marketMatch: "Radford SWE - Platform / Senior",
  },
  {
    id: "fpa-mgr",
    title: "Senior Manager, FP&A",
    function: "Finance",
    family: "Financial Planning & Analysis",
    track: "People manager",
    level: "M4 Senior Manager",
    titleExample: "Senior Manager, Financial Planning",
    marketMatch: "Radford Finance - FP&A / Senior Manager",
  },
  {
    id: "regional-vp",
    title: "Regional VP, Sales",
    function: "Sales",
    family: "Sales Leadership",
    track: "Executive",
    level: "E2 Regional VP",
    titleExample: "Regional Vice President, Americas",
    marketMatch: "Radford Sales Leadership - Regional VP",
  },
];
