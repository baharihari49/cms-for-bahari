// app/api/testimonial/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all testimonials
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: testimonials 
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const testimonial = await prisma.testimonial.create({
      data: {
        content: body.content,
        name: body.name,
        position: body.position,
        avatar: body.avatar,
        company: body.company,
        rating: body.rating,
      },
    });

    return NextResponse.json(
      { success: true, data: testimonial },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
