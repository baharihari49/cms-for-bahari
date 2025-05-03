// prisma/seed.js

const { PrismaClient, Prisma } = require('@prisma/client');
// Create a new instance with a different name to avoid conflicts
const prismaClient = new PrismaClient();
const experienceData = require('./seeds/experiences');
const portfolioData = require('./seeds/portfolios');
const techStackData = require('./seeds/techStacks');
const faqData = require('./seeds/faqs');
const testimonialData = require('./seeds/testimonials');

async function main() {
  console.log('Starting database seeding...');

  // Truncate existing data (in reverse order of dependencies)
  console.log('Cleaning existing data...');
  try {
    // Delete in proper order to avoid foreign key constraints
    await prismaClient.testimonial.deleteMany({});
    console.log('✅ Cleared Testimonials');
    
    await prismaClient.fAQ.deleteMany({});
    console.log('✅ Cleared FAQs');
    
    await prismaClient.techStack.deleteMany({});
    console.log('✅ Cleared TechStacks');
    
    await prismaClient.portfolio.deleteMany({});
    console.log('✅ Cleared Portfolios');
    
    await prismaClient.experience.deleteMany({});
    console.log('✅ Cleared Experiences');
  } catch (error) {
    console.error('Error clearing existing data:', error);
    console.log('⚠️ Continuing with seeding...');
  }

  // Seed Experiences
  console.log('\nSeeding experiences...');
  let successCount = 0;
  for (const experience of experienceData) {
    try {
      await prismaClient.experience.create({
        data: {
          title: experience.title,
          list: JSON.stringify(experience.list),
          company: experience.company,
          companyLogo: experience.companyLogo,
          duration: experience.duration,
          location: experience.location,
          skills: JSON.stringify(experience.skills),
          achievements: JSON.stringify(experience.achievements),
          current: experience.current,
          type: experience.type,
          link: experience.link,
        },
      });
      successCount++;
    } catch (error) {
      console.error(`Error seeding experience "${experience.title}":`, error.message);
    }
  }
  console.log(`✅ Seeded ${successCount}/${experienceData.length} experiences`);

  // Seed Portfolios
  console.log('\nSeeding portfolios...');
  successCount = 0;
  for (const portfolio of portfolioData) {
    try {
      await prismaClient.portfolio.create({
        data: {
          title: portfolio.title,
          slug: portfolio.slug,
          category: portfolio.category,
          image: portfolio.image,
          description: portfolio.description,
          technologies: JSON.stringify(portfolio.technologies),
          year: portfolio.year,
          role: portfolio.role,
          duration: portfolio.duration,
          highlight: portfolio.highlight || false,
          keyFeatures: JSON.stringify(portfolio.keyFeatures || []),
          gallery: JSON.stringify(portfolio.gallery || []),
          challenges: portfolio.challenges ? JSON.stringify(portfolio.challenges) : null,
          solutions: portfolio.solutions ? JSON.stringify(portfolio.solutions) : null,
          testimonial: portfolio.testimonial ? JSON.stringify(portfolio.testimonial) : null,
          nextProject: portfolio.nextProject || null,
          nextProjectSlug: portfolio.nextProjectSlug || null,
        },
      });
      successCount++;
    } catch (error) {
      console.error(`Error seeding portfolio "${portfolio.title}":`, error.message);
    }
  }
  console.log(`✅ Seeded ${successCount}/${portfolioData.length} portfolios`);
  
  // Seed Tech Stacks
  console.log('\nSeeding tech stacks...');
  successCount = 0;
  for (const techStack of techStackData) {
    try {
      await prismaClient.techStack.create({
        data: {
          name: techStack.name,
          icon: techStack.icon,
          category: techStack.category,
          proficiency: techStack.proficiency,
          color: techStack.color,
          description: techStack.description,
          years: techStack.years,
          projects: techStack.projects,
        },
      });
      successCount++;
    } catch (error) {
      console.error(`Error seeding tech stack "${techStack.name}":`, error.message);
    }
  }
  console.log(`✅ Seeded ${successCount}/${techStackData.length} tech stacks`);
  
  // Seed FAQs
  console.log('\nSeeding FAQs...');
  successCount = 0;
  let order = 0;
  for (const faq of faqData) {
    try {
      await prismaClient.fAQ.create({
        data: {
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          order: order++, // Incremental order based on array position
        },
      });
      successCount++;
    } catch (error) {
      console.error(`Error seeding FAQ "${faq.question.substring(0, 30)}...":`, error.message);
    }
  }
  console.log(`✅ Seeded ${successCount}/${faqData.length} FAQs`);
  
  // Seed Testimonials
  console.log('\nSeeding Testimonials...');
  successCount = 0;
  for (const testimonial of testimonialData) {
    try {
      await prismaClient.testimonial.create({
        data: {
          name: testimonial.name,
          position: testimonial.position,
          company: testimonial.company,
          avatar: testimonial.avatar,
          content: testimonial.content,
          rating: testimonial.rating,
          // Removed isPublished field as it doesn't exist in your schema
        },
      });
      successCount++;
    } catch (error) {
      console.error(`Error seeding testimonial from "${testimonial.name}":`, error.message);
    }
  }
  console.log(`✅ Seeded ${successCount}/${testimonialData.length} testimonials`);
  
  console.log('\n🌱 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });