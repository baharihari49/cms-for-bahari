// app/api/portfolio/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { withCors, corsPreflight } from '@/lib/withCors';

// GET all portfolio items
export async function GET() {
  try {
    const portfolioItems = await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const transformedItems = portfolioItems.map((item) => ({
      ...item,
      technologies: JSON.parse(String(item.technologies)),
      keyFeatures: JSON.parse(String(item.keyFeatures)),
      gallery: JSON.parse(String(item.gallery)),
      challenges: item.challenges ? JSON.parse(String(item.challenges)) : undefined,
      solutions: item.solutions ? JSON.parse(String(item.solutions)) : undefined,
      testimonial: item.testimonial ? JSON.parse(String(item.testimonial)) : undefined,
    }));

    return withCors({ success: true, data: transformedItems });
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return withCors({ success: false, error: 'Failed to fetch portfolio items' }, 500);
  }
}

// POST new portfolio item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const portfolioItem = await prisma.portfolio.create({
      data: {
        title: body.title,
        slug: body.slug,
        category: body.category,
        image: body.image,
        description: body.description,
        technologies: JSON.stringify(body.technologies),
        year: body.year,
        role: body.role,
        duration: body.duration,
        highlight: body.highlight,
        keyFeatures: JSON.stringify(body.keyFeatures),
        gallery: JSON.stringify(body.gallery),
        challenges: body.challenges ? JSON.stringify(body.challenges) : Prisma.JsonNull,
        solutions: body.solutions ? JSON.stringify(body.solutions) : Prisma.JsonNull,
        testimonial: body.testimonial ? JSON.stringify(body.testimonial) : Prisma.JsonNull,
        nextProject: body.nextProject,
        nextProjectSlug: body.nextProjectSlug,
      },
    });

    const transformedItem = {
      ...portfolioItem,
      technologies: JSON.parse(String(portfolioItem.technologies)),
      keyFeatures: JSON.parse(String(portfolioItem.keyFeatures)),
      gallery: JSON.parse(String(portfolioItem.gallery)),
      challenges: portfolioItem.challenges ? JSON.parse(String(portfolioItem.challenges)) : undefined,
      solutions: portfolioItem.solutions ? JSON.parse(String(portfolioItem.solutions)) : undefined,
      testimonial: portfolioItem.testimonial ? JSON.parse(String(portfolioItem.testimonial)) : undefined,
    };

    return withCors({ success: true, data: transformedItem }, 201);
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return withCors({ success: false, error: 'Failed to create portfolio item' }, 500);
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return corsPreflight();
}
