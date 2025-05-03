// prisma/seeds/techStacks.ts

const techStackData = [
    {
      name: "JavaScript",
      icon: "IoLogoJavascript",
      category: "Frontend",
      proficiency: 90,
      color: "yellow-400",
      description: "Core language for web development with extensive experience in ES6+ features, async programming, and DOM manipulation.",
      years: 5,
      projects: 15
    },
    {
      name: "TypeScript",
      icon: "SiTypescript",
      category: "Frontend",
      proficiency: 85,
      color: "blue-500",
      description: "Strongly typed programming language that builds on JavaScript, providing better tooling and error prevention.",
      years: 3,
      projects: 8
    },
    {
      name: "React",
      icon: "FaReact",
      category: "Frontend",
      proficiency: 95,
      color: "blue-400",
      description: "Library for building user interfaces with a component-based architecture, including hooks, context API, and state management.",
      years: 4,
      projects: 12
    },
    {
      name: "Next.js",
      icon: "SiNextdotjs",
      category: "Frontend",
      proficiency: 85,
      color: "gray-800",
      description: "React framework for production with server-side rendering, static site generation, and API routes.",
      years: 3,
      projects: 7
    },
    {
      name: "Node.js",
      icon: "FaNodeJs",
      category: "Backend",
      proficiency: 80,
      color: "green-600",
      description: "JavaScript runtime built on Chrome's V8 engine for building scalable server-side applications.",
      years: 4,
      projects: 9
    }
  ];
  
  module.exports = techStackData;