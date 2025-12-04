// app/api/collections/categories/route.ts

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withCors, corsPreflight } from '@/lib/withCors';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return corsPreflight();
}

// GET all collection categories
export async function GET() {
  try {
    const categories = await prisma.collectionCategory.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: { collections: true }
        }
      }
    });

    return withCors({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching collection categories:', error);
    return withCors({ success: false, error: 'Failed to fetch categories' }, 500);
  }
}

// POST new collection category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.slug) {
      return withCors({
        success: false,
        error: 'Name and slug are required'
      }, 400);
    }

    // Check for duplicate name or slug
    const existing = await prisma.collectionCategory.findFirst({
      where: {
        OR: [
          { name: body.name },
          { slug: body.slug }
        ]
      }
    });

    if (existing) {
      return withCors({
        success: false,
        error: 'Category with this name or slug already exists'
      }, 400);
    }

    const category = await prisma.collectionCategory.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
      },
    });

    return withCors({ success: true, data: category }, 201);
  } catch (error) {
    console.error('Error creating collection category:', error);
    return withCors({ success: false, error: 'Failed to create category' }, 500);
  }
}
