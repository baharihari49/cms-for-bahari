// app/api/portfolio/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import pkg from '@prisma/client';
const { Prisma } = pkg;

// GET all portfolio items
export async function GET() {
  try {
    const portfolioItems = await prisma.portfolio.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform JSON fields
    const transformedItems = portfolioItems.map((item) => {
      return {
        ...item,
        technologies: JSON.parse(String(item.technologies)) as string[],
        keyFeatures: JSON.parse(String(item.keyFeatures)) as string[],
        gallery: JSON.parse(String(item.gallery)) as string[],
        challenges: item.challenges ? JSON.parse(String(item.challenges)) as string[] : undefined,
        solutions: item.solutions ? JSON.parse(String(item.solutions)) as string[] : undefined,
        testimonial: item.testimonial ? JSON.parse(String(item.testimonial)) : undefined,
      };
    });

    return NextResponse.json({ 
      success: true, 
      data: transformedItems 
    });
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
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

    // Transform for response
    const transformedItem = {
      ...portfolioItem,
      technologies: JSON.parse(String(portfolioItem.technologies)) as string[],
      keyFeatures: JSON.parse(String(portfolioItem.keyFeatures)) as string[],
      gallery: JSON.parse(String(portfolioItem.gallery)) as string[],
      challenges: portfolioItem.challenges ? JSON.parse(String(portfolioItem.challenges)) as string[] : undefined,
      solutions: portfolioItem.solutions ? JSON.parse(String(portfolioItem.solutions)) as string[] : undefined,
      testimonial: portfolioItem.testimonial ? JSON.parse(String(portfolioItem.testimonial)) : undefined,
    };

    return NextResponse.json(
      { success: true, data: transformedItem },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create portfolio item' },
      { status: 500 }
    );
  }
}