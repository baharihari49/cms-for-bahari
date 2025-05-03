// prisma/seeds/faqs.ts

const faqData = [
    {
      question: "What services do you offer?",
      answer: "I offer a range of web development services including full-stack development, frontend development with React/Next.js, backend development with Node.js, and database design and implementation. My expertise spans from creating responsive websites to building complex web applications with authentication, payment processing, and more.",
      category: "Services"
    },
    {
      question: "What is your typical project process?",
      answer: "My project process typically follows these steps: 1) Initial consultation to understand requirements, 2) Project scoping and proposal, 3) Design and wireframing, 4) Development with regular progress updates, 5) Testing and quality assurance, 6) Deployment, and 7) Post-launch support and maintenance. Throughout this process, I maintain open communication and collaborate closely with clients to ensure the final product meets their expectations.",
      category: "Process"
    },
    {
      question: "How long does it take to complete a typical project?",
      answer: "Project timelines vary greatly depending on complexity, scope, and specific requirements. A simple landing page might take 1-2 weeks, while a full-featured web application could take 2-3 months or more. During our initial consultation, I'll provide a detailed timeline estimate based on your specific project requirements.",
      category: "Process"
    },
    {
      question: "Do you provide ongoing maintenance and support?",
      answer: "Yes, I offer ongoing maintenance and support packages to keep your website or application running smoothly. These packages can include regular updates, security patches, performance optimization, and technical support. We can discuss maintenance options that best fit your needs during the project planning phase.",
      category: "Services"
    },
    {
      question: "What technologies do you specialize in?",
      answer: "I specialize in modern web technologies including React, Next.js, TypeScript, Node.js, and various database solutions like MySQL, PostgreSQL, and MongoDB. I'm also experienced with UI frameworks like Tailwind CSS and Material UI, state management tools, authentication systems, payment gateways, and cloud deployment platforms such as AWS, Vercel, and Netlify.",
      category: "Technical"
    }
  ];
  
  module.exports = faqData;