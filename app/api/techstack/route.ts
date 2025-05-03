// app/api/techstack/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all tech stacks
export async function GET() {
  try {
    const techStacks = await prisma.techStack.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: techStacks 
    });
  } catch (error) {
    console.error('Error fetching tech stacks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tech stacks' },
      { status: 500 }
    );
  }
}

// POST new tech stack
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const techStack = await prisma.techStack.create({
      data: {
        name: body.name,
        icon: body.icon,
        category: body.category,
        proficiency: body.proficiency,
        color: body.color,
        description: body.description,
        years: body.years,
        projects: body.projects,
      },
    });

    return NextResponse.json(
      { success: true, data: techStack },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating tech stack:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create tech stack' },
      { status: 500 }
    );
  }
}