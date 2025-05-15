// app/api/blog/categories/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all blog categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const withPostCount = searchParams.get('withPostCount') === 'true';
    
    if (withPostCount) {
      // Fetch categories with post count
      const categories = await prisma.blogCategory.findMany({
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
      const formattedCategories = categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        postCount: category._count.posts,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }));
      
      return NextResponse.json({ 
        success: true, 
        data: formattedCategories 
      });
    } else {
      // Fetch categories without post count
      const categories = await prisma.blogCategory.findMany({
        orderBy: {
          name: 'asc'
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        data: categories 
      });
    }
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog categories' },
      { status: 500 }
    );
  }
}

// POST new blog category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if category with the same name already exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { name: body.name }
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category with this name already exists' },
        { status: 400 }
      );
    }
    
    // Create the category
    const category = await prisma.blogCategory.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description
      }
    });

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog category' },
      { status: 500 }
    );
  }
}