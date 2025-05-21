// app/api/blog/tags/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withCors } from '@/lib/withCors';

// GET all blog tags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const withPostCount = searchParams.get('withPostCount') === 'true';
    
    if (withPostCount) {
      // Fetch tags with post count
      const tags = await prisma.blogTag.findMany({
        include: {
          _count: {
            select: { posts: true }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      // Transform the response to include post count
      const formattedTags = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        description: tag.description,
        postCount: tag._count.posts,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt
      }));
      
      return NextResponse.json({ 
        success: true, 
        data: formattedTags 
      });
    } else {
      // Fetch tags without post count
      const tags = await prisma.blogTag.findMany({
        orderBy: {
          name: 'asc'
        }
      });
      
      // return NextResponse.json({ 
      //   success: true, 
      //   data: tags 
      // });
      return withCors({success: true, data: tags})
    }
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog tags' },
      { status: 500 }
    );
  }
}

// POST new blog tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if tag with the same name already exists
    const existingTag = await prisma.blogTag.findUnique({
      where: { name: body.name }
    });
    
    if (existingTag) {
      return NextResponse.json(
        { success: false, error: 'Tag with this name already exists' },
        { status: 400 }
      );
    }
    
    // Create the tag
    const tag = await prisma.blogTag.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description
      }
    });

    return NextResponse.json(
      { success: true, data: tag },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog tag:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog tag' },
      { status: 500 }
    );
  }
}