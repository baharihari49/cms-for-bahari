// prisma/seeds/portfolios.ts

const portfolioData = [
    {
      title: "DUHANI Landing page",
      slug: "duhani-landing-page",
      category: "Web",
      image: "https://res.cloudinary.com/du0tz73ma/image/upload/v1733375265/Close-up_online_learning_landing_page_1_jbopai.png",
      description: "A comprehensive, high-conversion landing page for DUHANI designed to transform visitor traffic into qualified leads through strategic UX principles and data-driven design decisions. The project involved extensive market research to identify key user pain points and motivations, followed by the development of a clean, visually compelling interface that guides visitors through an optimized conversion funnel. By implementing sophisticated Framer Motion animations that highlight key product benefits without compromising load times, the design achieves the perfect balance between visual appeal and performance. The architecture employs a component-based approach with React and Tailwind CSS, allowing for rapid iterations based on A/B testing results and enabling the client to achieve a remarkable 35% increase in conversion rates within the first month post-launch.",
      technologies: ["React", "Tailwind CSS", "Framer Motion"],
      year: "2024",
      role: "Frontend Developer",
      duration: "1 weeks",
      highlight: "Increased conversion rate by 35%",
      keyFeatures: [
        "Conversion-optimized user interface with strategic CTA placement",
        "Performance-focused design with optimized asset delivery",
        "Responsive layout adapting seamlessly across all device types",
        "Engaging animations enhancing user experience without compromising speed",
        "Clear and compelling messaging highlighting platform benefits"
      ],
      gallery: [
        "https://res.cloudinary.com/du0tz73ma/image/upload/v1733375265/Close-up_online_learning_landing_page_1_jbopai.png"
      ],
      challenges: [
        "Creating a visually appealing design that communicates the brand message effectively",
        "Optimizing page load speed while maintaining rich visual elements",
        "Implementing responsive design that works across all device types"
      ],
      solutions: [
        "Used Tailwind CSS for efficient styling and responsive design implementation",
        "Implemented lazy loading for images and optimized asset delivery",
        "Created smooth animations with Framer Motion to enhance user experience without sacrificing performance"
      ],
      testimonial: {
        text: "The landing page exceeded our expectations. The design is modern and conversion-focused, and we've seen a significant increase in sign-ups since launch.",
        author: "Sarah Johnson",
        position: "Marketing Director at DUHANI"
      },
      nextProject: "Emamarkets Landing Page",
      nextProjectSlug: "emamarkets-landing-page"
    }
  ];
  
  module.exports = portfolioData;