// app/api/collections/categories/[id]/route.ts

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

// GET single category by ID
export async function GET(request: NextRequest) {
  try {
    const id = extractId(request);

    const category = await prisma.collectionCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { collections: true }
        }
      }
    });

    if (!category) {
      return withCors({ success: false, error: 'Category not found' }, 404);
    }

    return withCors({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching collection category:', error);
    return withCors({ success: false, error: 'Failed to fetch category' }, 500);
  }
}

// PATCH update category
export async function PATCH(request: NextRequest) {
  try {
    const id = extractId(request);
    const body = await request.json();

    // Check if category exists
    const existing = await prisma.collectionCategory.findUnique({
      where: { id }
    });

    if (!existing) {
      return withCors({ success: false, error: 'Category not found' }, 404);
    }

    // Check for duplicate name or slug if being changed
    if (body.name || body.slug) {
      const duplicate = await prisma.collectionCategory.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                body.name ? { name: body.name } : {},
                body.slug ? { slug: body.slug } : {}
              ]
            }
          ]
        }
      });

      if (duplicate) {
        return withCors({
          success: false,
          error: 'Another category with this name or slug already exists'
        }, 400);
      }
    }

    const category = await prisma.collectionCategory.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : existing.name,
        slug: body.slug !== undefined ? body.slug : existing.slug,
        description: body.description !== undefined ? body.description : existing.description,
      },
    });

    return withCors({ success: true, data: category });
  } catch (error) {
    console.error('Error updating collection category:', error);
    return withCors({ success: false, error: 'Failed to update category' }, 500);
  }
}

// DELETE category
export async function DELETE(request: NextRequest) {
  try {
    const id = extractId(request);

    // Check if category exists
    const existing = await prisma.collectionCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { collections: true }
        }
      }
    });

    if (!existing) {
      return withCors({ success: false, error: 'Category not found' }, 404);
    }

    // Check if category has collections
    if (existing._count.collections > 0) {
      return withCors({
        success: false,
        error: `Cannot delete category with ${existing._count.collections} collection(s). Please move or delete the collections first.`
      }, 400);
    }

    await prisma.collectionCategory.delete({
      where: { id }
    });

    return withCors({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection category:', error);
    return withCors({ success: false, error: 'Failed to delete category' }, 500);
  }
}
