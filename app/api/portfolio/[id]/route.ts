// app/api/portfolio/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { Portfolio } from '@/types'; // Mengimpor tipe Portfolio

const extractId = (request: NextRequest): string => {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  return segments.pop() as string; // ambil id atau slug dari URL
};

// --- GET ---
export async function GET(request: NextRequest) {
  try {
    const id = extractId(request);
    const isSlug = !id.includes('-') && isNaN(Number(id.charAt(0)));

    const portfolioItem = await prisma.portfolio.findUnique({
      where: isSlug ? { slug: id } : { id },
    });

    if (!portfolioItem) {
      return NextResponse.json({ success: false, error: 'Portfolio item not found' }, { status: 404 });
    }

    // Transform JSON fields sesuai dengan tipe Portfolio
    const transformedItem = {
      ...portfolioItem,
      // Convert null values to undefined untuk properti yang tidak menerima null dalam tipe Portfolio
      highlight: portfolioItem.highlight || undefined,
      nextProject: portfolioItem.nextProject || undefined,
      nextProjectSlug: portfolioItem.nextProjectSlug || undefined,  
      link: portfolioItem.link || undefined,
      
      // Parse JSON fields
      technologies: JSON.parse(portfolioItem.technologies as string),
      keyFeatures: JSON.parse(portfolioItem.keyFeatures as string),
      gallery: JSON.parse(portfolioItem.gallery as string),
      challenges: portfolioItem.challenges ? JSON.parse(portfolioItem.challenges as string) : undefined,
      solutions: portfolioItem.solutions ? JSON.parse(portfolioItem.solutions as string) : undefined,
      testimonial: portfolioItem.testimonial ? JSON.parse(portfolioItem.testimonial as string) : undefined,
    } as Portfolio; // Type assertion setelah transformasi

    return NextResponse.json({ success: true, data: transformedItem });
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch portfolio item' }, { status: 500 });
  }
}

// --- PATCH ---
export async function PATCH(request: NextRequest) {
  try {
    const id = extractId(request);
    const isSlug = !id.includes('-') && id.length < 10; // Perbaikan logika pendeteksian slug
    
    // Cek apakah portfolio item exists
    const existingItem = await prisma.portfolio.findUnique({
      where: isSlug ? { slug: id } : { id }
    });

    if (!existingItem) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Portfolio with ${isSlug ? 'slug' : 'id'} '${id}' not found` 
        }, 
        { status: 404 }
      );
    }

    const body = await request.json();
    
    // Transmutasi dari data body ke format Prisma.PortfolioUpdateInput yang kompatibel
    const dataToUpdate: Prisma.PortfolioUpdateInput = {};

    // Properti non-JSON
    if (body.title) dataToUpdate.title = body.title;
    if (body.slug) dataToUpdate.slug = body.slug;
    if (body.category) dataToUpdate.category = body.category;
    if (body.image) dataToUpdate.image = body.image;
    if (body.description) dataToUpdate.description = body.description;
    if (body.year) dataToUpdate.year = body.year;
    if (body.role) dataToUpdate.role = body.role;
    if (body.duration) dataToUpdate.duration = body.duration;
    
    // Properti yang bisa null
    if (body.highlight !== undefined) dataToUpdate.highlight = body.highlight;
    if (body.nextProject !== undefined) dataToUpdate.nextProject = body.nextProject;
    if (body.nextProjectSlug !== undefined) dataToUpdate.nextProjectSlug = body.nextProjectSlug;
    if (body.link !== undefined) dataToUpdate.link = body.link
    
    // Properti JSON yang wajib ada
    if (body.technologies) {
      dataToUpdate.technologies = JSON.stringify(body.technologies);
    }
    if (body.keyFeatures) {
      dataToUpdate.keyFeatures = JSON.stringify(body.keyFeatures);
    }
    if (body.gallery) {
      dataToUpdate.gallery = JSON.stringify(body.gallery);
    }
    
    // Properti JSON yang bisa null
    if (body.challenges !== undefined) {
      dataToUpdate.challenges = body.challenges === null 
        ? Prisma.JsonNull 
        : JSON.stringify(body.challenges);
    }
    if (body.solutions !== undefined) {
      dataToUpdate.solutions = body.solutions === null 
        ? Prisma.JsonNull 
        : JSON.stringify(body.solutions);
    }
    if (body.testimonial !== undefined) {
      dataToUpdate.testimonial = body.testimonial === null 
        ? Prisma.JsonNull 
        : JSON.stringify(body.testimonial);
    }

    const portfolioItem = await prisma.portfolio.update({
      where: isSlug ? { slug: id } : { id },
      data: dataToUpdate,
    });

    // Transform untuk response sesuai dengan tipe Portfolio
    const transformedItem = {
      ...portfolioItem,
      // Convert null values to undefined
      highlight: portfolioItem.highlight || undefined,
      nextProject: portfolioItem.nextProject || undefined,
      nextProjectSlug: portfolioItem.nextProjectSlug || undefined,
      
      // Parse JSON fields
      technologies: JSON.parse(portfolioItem.technologies as string),
      keyFeatures: JSON.parse(portfolioItem.keyFeatures as string),
      gallery: JSON.parse(portfolioItem.gallery as string),
      challenges: portfolioItem.challenges ? JSON.parse(portfolioItem.challenges as string) : undefined,
      solutions: portfolioItem.solutions ? JSON.parse(portfolioItem.solutions as string) : undefined,
      testimonial: portfolioItem.testimonial ? JSON.parse(portfolioItem.testimonial as string) : undefined,
    } as Portfolio; // Type assertion setelah transformasi

    return NextResponse.json({ success: true, data: transformedItem });
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Portfolio item not found' 
          }, 
          { status: 404 }
        );
      }
      // Handle other Prisma errors
      return NextResponse.json(
        { 
          success: false, 
          error: `Database error: ${error.message}` 
        }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update portfolio item' 
      }, 
      { status: 500 }
    );
  }
}

// --- DELETE ---
export async function DELETE(request: NextRequest) {
  try {
    const id = extractId(request);
    const isSlug = !id.includes('-') && isNaN(Number(id.charAt(0)));

    await prisma.portfolio.delete({
      where: isSlug ? { slug: id } : { id },
    });

    return NextResponse.json({ success: true, message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete portfolio item' }, { status: 500 });
  }
}