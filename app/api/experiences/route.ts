// app/api/experiences/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withCors, corsPreflight } from '@/lib/withCors';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return corsPreflight();
}

// GET all experiences
export async function GET(request: NextRequest) {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the JSON fields from string back to arrays
    const transformedExperiences = experiences.map((exp) => ({
      ...exp,
      list: JSON.parse(exp.list as string) as string[],
      skills: JSON.parse(exp.skills as string) as string[],
      achievements: JSON.parse(exp.achievements as string) as string[],
    }));

    return withCors({ success: true, data: transformedExperiences });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return withCors(
      NextResponse.json(
        { success: false, error: 'Failed to fetch experiences' },
        { status: 500 }
      )
    );
  }
}

// POST new experience
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const experience = await prisma.experience.create({
      data: {
        title: body.title,
        list: JSON.stringify(body.list),
        company: body.company,
        companyLogo: body.companyLogo,
        duration: body.duration,
        location: body.location,
        skills: JSON.stringify(body.skills),
        achievements: JSON.stringify(body.achievements),
        current: body.current || false,
        type: body.type,
        link: body.link,
      },
    });

    // Transform back for response
    const transformedExperience = {
      ...experience,
      list: JSON.parse(experience.list as string) as string[],
      skills: JSON.parse(experience.skills as string) as string[],
      achievements: JSON.parse(experience.achievements as string) as string[],
    };

    return withCors({ success: true, data: transformedExperience }, 201);
  } catch (error) {
    console.error('Error creating experience:', error);
    return withCors(
      NextResponse.json(
        { success: false, error: 'Failed to create experience' },
        { status: 500 }
      )
    );
  }
}