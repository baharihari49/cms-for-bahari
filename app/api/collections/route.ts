// app/api/collections/route.ts

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withCors, corsPreflight } from '@/lib/withCors';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return corsPreflight();
}

// GET all collections with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const published = searchParams.get('published');
    const limit = searchParams.get('limit');

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (published === 'true') where.published = true;
    if (published === 'false') where.published = false;

    const collections = await prisma.collection.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return withCors({ success: true, data: collections });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return withCors({ success: false, error: 'Failed to fetch collections' }, 500);
  }
}

// POST new collection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.htmlContent || !body.categoryId) {
      return withCors({
        success: false,
        error: 'Title, slug, HTML content, and category are required'
      }, 400);
    }

    // Check for duplicate slug
    const existingSlug = await prisma.collection.findUnique({
      where: { slug: body.slug }
    });

    if (existingSlug) {
      return withCors({
        success: false,
        error: 'Collection with this slug already exists'
      }, 400);
    }

    // Verify category exists
    const categoryExists = await prisma.collectionCategory.findUnique({
      where: { id: body.categoryId }
    });

    if (!categoryExists) {
      return withCors({
        success: false,
        error: 'Category not found'
      }, 400);
    }

    const collection = await prisma.collection.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description || null,
        thumbnail: body.thumbnail || null,
        htmlContent: body.htmlContent,
        published: body.published ?? false,
        order: body.order ?? null,
        categoryId: body.categoryId,
      },
      include: {
        category: true,
      }
    });

    return withCors({ success: true, data: collection }, 201);
  } catch (error) {
    console.error('Error creating collection:', error);
    return withCors({ success: false, error: 'Failed to create collection' }, 500);
  }
}
