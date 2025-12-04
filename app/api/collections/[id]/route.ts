// app/api/collections/[id]/route.ts

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withCors, corsPreflight } from '@/lib/withCors';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return corsPreflight();
}

// Helper to extract ID from URL
function extractId(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/');
  return segments[segments.length - 1];
}

// GET single collection by ID or slug
export async function GET(request: NextRequest) {
  try {
    const idOrSlug = extractId(request);

    // Try to find by ID first, then by slug
    let collection = await prisma.collection.findUnique({
      where: { id: idOrSlug },
      include: {
        category: true,
      }
    });

    if (!collection) {
      collection = await prisma.collection.findUnique({
        where: { slug: idOrSlug },
        include: {
          category: true,
        }
      });
    }

    if (!collection) {
      return withCors({ success: false, error: 'Collection not found' }, 404);
    }

    return withCors({ success: true, data: collection });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return withCors({ success: false, error: 'Failed to fetch collection' }, 500);
  }
}

// PATCH update collection
export async function PATCH(request: NextRequest) {
  try {
    const id = extractId(request);
    const body = await request.json();

    // Check if collection exists
    const existing = await prisma.collection.findUnique({
      where: { id }
    });

    if (!existing) {
      return withCors({ success: false, error: 'Collection not found' }, 404);
    }

    // Check for duplicate slug if being changed
    if (body.slug && body.slug !== existing.slug) {
      const duplicateSlug = await prisma.collection.findFirst({
        where: {
          slug: body.slug,
          id: { not: id }
        }
      });

      if (duplicateSlug) {
        return withCors({
          success: false,
          error: 'Another collection with this slug already exists'
        }, 400);
      }
    }

    // Verify category exists if being changed
    if (body.categoryId && body.categoryId !== existing.categoryId) {
      const categoryExists = await prisma.collectionCategory.findUnique({
        where: { id: body.categoryId }
      });

      if (!categoryExists) {
        return withCors({
          success: false,
          error: 'Category not found'
        }, 400);
      }
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : existing.title,
        slug: body.slug !== undefined ? body.slug : existing.slug,
        description: body.description !== undefined ? body.description : existing.description,
        thumbnail: body.thumbnail !== undefined ? body.thumbnail : existing.thumbnail,
        htmlContent: body.htmlContent !== undefined ? body.htmlContent : existing.htmlContent,
        published: body.published !== undefined ? body.published : existing.published,
        order: body.order !== undefined ? body.order : existing.order,
        categoryId: body.categoryId !== undefined ? body.categoryId : existing.categoryId,
      },
      include: {
        category: true,
      }
    });

    return withCors({ success: true, data: collection });
  } catch (error) {
    console.error('Error updating collection:', error);
    return withCors({ success: false, error: 'Failed to update collection' }, 500);
  }
}

// DELETE collection
export async function DELETE(request: NextRequest) {
  try {
    const id = extractId(request);

    // Check if collection exists
    const existing = await prisma.collection.findUnique({
      where: { id }
    });

    if (!existing) {
      return withCors({ success: false, error: 'Collection not found' }, 404);
    }

    await prisma.collection.delete({
      where: { id }
    });

    return withCors({ success: true, message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return withCors({ success: false, error: 'Failed to delete collection' }, 500);
  }
}
