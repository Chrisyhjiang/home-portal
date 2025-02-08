import {
  FaReact,
  FaNodeJs,
  FaVuejs,
  FaAngular,
  FaPython,
} from "react-icons/fa";
import {
  SiTypescript,
  SiJavascript,
  SiExpress,
  SiDjango,
} from "react-icons/si";

// Add company logos from a reliable CDN
const COMPANY_LOGOS = {
  TECH_CORP:
    "https://raw.githubusercontent.com/github/explore/d73b58ded658144cd29547485b8537306012eb86/topics/javascript/javascript.png",
  STARTUP:
    "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png",
  INNOVATION:
    "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/python/python.png",
};

export const profile = {
  name: "Christopher Jiang",
  role: "Software Developer",
  description: "Computer Science Student at the University of Waterloo.",
};

export const social = [
  { name: "GitHub", link: "https://github.com/Chrisyhjiang" },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/in/christopher-jiang-3b8a30223/",
  },
];

export const brand = "CJ";

export const greeting = {
  title: "Hi there 👋",
  logo_name: "christopher.j()",
  full_name: "Christopher Jiang",
  subTitle:
    "Computer Science Student at the University of Waterloo. Open to collaborating on projects and internships.",
};

export const work = [
  {
    name: "Sample Project 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    stack: [
      { icon: FaReact, name: "React" },
      { icon: SiTypescript, name: "TypeScript" },
      { icon: FaNodeJs, name: "Node.js" },
    ],
    linkProject: "https://example.com/project1",
    linkGithub: "https://github.com/example/project1",
  },
  {
    name: "Sample Project 2",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    stack: [
      { icon: FaVuejs, name: "Vue.js" },
      { icon: SiJavascript, name: "JavaScript" },
      { icon: SiExpress, name: "Express" },
    ],
    linkProject: "https://example.com/project2",
    linkGithub: "https://github.com/example/project2",
  },
  {
    name: "Sample Project 3",
    description:
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
    stack: [
      { icon: FaAngular, name: "Angular" },
      { icon: FaPython, name: "Python" },
      { icon: SiDjango, name: "Django" },
    ],
    linkProject: "https://example.com/project3",
    linkGithub: "https://github.com/example/project3",
  },
];

export const stack = [
  {
    name: "Front End",
    items: [
      { name: "HTML" },
      { name: "CSS" },
      { name: "Javascript" },
      { name: "Typescript" },
      { name: "React" },
      { name: "Angular" },
    ],
  },
  {
    name: "Back End",
    items: [
      { name: "NodeJS" },
      { name: "MongoDB" },
      { name: "MySQL" },
      { name: "Python" },
      { name: "Kotlin" },
      { name: "Golang" },
      { name: "Java" },
    ],
  },
  {
    name: "Tools",
    items: [
      { name: "Git" },
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "Postman" },
      { name: "Azure" },
      { name: "Google Cloud" },
      { name: "AWS" },
    ],
  },
];

export const experiences = [
  {
    Company: "Tech Corp Inc.",
    Role: "Senior Software Engineer",
    Location: "San Francisco, CA",
    StartDate: "Jan 2022",
    EndDate: "Present",
    Description: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      "Ut enim ad minim veniam, quis nostrud exercitation",
    ],
    Icon: COMPANY_LOGOS.TECH_CORP,
  },
  {
    Company: "Startup Solutions",
    Role: "Full Stack Developer",
    Location: "New York, NY",
    StartDate: "Jun 2020",
    EndDate: "Dec 2021",
    Description: [
      "Duis aute irure dolor in reprehenderit in voluptate",
      "Excepteur sint occaecat cupidatat non proident",
      "Sunt in culpa qui officia deserunt mollit anim",
    ],
    Icon: COMPANY_LOGOS.STARTUP,
  },
  {
    Company: "Innovation Labs",
    Role: "Software Developer",
    Location: "Boston, MA",
    StartDate: "Jan 2019",
    EndDate: "May 2020",
    Description: [
      "Ut enim ad minima veniam, quis nostrum exercitationem",
      "Quis autem vel eum iure reprehenderit qui in ea",
      "Nemo enim ipsam voluptatem quia voluptas",
    ],
    Icon: COMPANY_LOGOS.INNOVATION,
  },
];

export const contact = {
  description:
    "For any opportunities or questions, please feel free to contact me.",
  email: "christopher.jiang@uwaterloo.ca",
};
