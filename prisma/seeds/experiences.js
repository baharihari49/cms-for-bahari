// prisma/seeds/experiences.js (ubah ekstensi file dari .ts menjadi .js)

const experienceData = [
  {
    title: "Product Owner for Octans Finance at PT Boxity Central Indonesia",
    list: [
      "Translated business requirements into technical specifications and user stories",
      "Designed responsive UI and managed database architecture for financial platform",
      "Integrated multiple payment gateways including Midtrans and Xendit",
      "Optimized system performance to handle high transaction volumes",
      "Led cross-functional team of developers, designers, and QA specialists",
      "Conducted user research and implemented feedback to improve product features"
    ],
    company: "PT Boxity Central Indonesia",
    companyLogo: "https://res.cloudinary.com/du0tz73ma/image/upload/v1742210093/95909259_aabj7w.png",
    duration: "Jan 2023 - Present",
    location: "Remote / WFH",
    skills: [
      "Product Management",
      "UI/UX Design",
      "PostgreSQL",
      "Node.js",
      "Financial Systems",
      "API Integration",
      "Agile/Scrum"
    ],
    achievements: [
      "Successfully launched Octans Finance platform with 10,000+ registered users",
      "Reduced transaction processing time by 60% through system architecture improvements",
      "Implemented security measures resulting in zero data breaches since launch"
    ],
    current: true,
    type: "fulltime",
    link: "https://boxity.id"
  },
  {
    title: "Frontend Developer at PT Boxity Central Indonesia",
    list: [
      "Developed highly interactive user interfaces for multiple web applications",
      "Collaborated with design team to implement responsive and accessible UI components",
      "Optimized application performance, improving load times by 40%",
      "Implemented state management solutions using React Context and Redux",
      "Created reusable component libraries to ensure consistency across projects",
      "Conducted code reviews and mentored junior developers"
    ],
    company: "PT Boxity Central Indonesia",
    companyLogo: "https://res.cloudinary.com/du0tz73ma/image/upload/v1742210093/95909259_aabj7w.png",
    duration: "Jan 2021 - Dec 2022",
    location: "Remote / WFH",
    skills: [
      "React",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
      "HTML/CSS",
      "Redux",
      "REST API",
      "Git"
    ],
    achievements: [
      "Led front-end development for ERP system serving 500+ users",
      "Reduced application bundle size by 35% through code splitting and lazy loading",
      "Received recognition for designing intuitive user experiences that increased user engagement"
    ],
    current: false,
    type: "remote",
    link: "https://boxity.id"
  },
  {
    title: "Freelance Web Developer",
    list: [
      "Designed and developed custom websites for small to medium-sized businesses",
      "Created e-commerce solutions with payment gateway integrations",
      "Implemented SEO best practices to improve client search rankings",
      "Provided maintenance and support for existing websites",
      "Collaborated directly with clients to translate their vision into functional websites"
    ],
    company: "Self-employed",
    duration: "Jun 2020 - Dec 2020",
    location: "Remote",
    skills: [
      "WordPress",
      "PHP",
      "JavaScript",
      "HTML/CSS",
      "WooCommerce",
      "SEO",
      "Web Design"
    ],
    achievements: [
      "Completed 15+ projects with 100% client satisfaction rate",
      "Developed custom e-commerce solution that increased client sales by 45%"
    ],
    current: false,
    type: "freelance",
    link: "https://boxity.id"
  }
];

// Gunakan module.exports untuk CommonJS
module.exports = experienceData;