// app/api/faq/reorder/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST reorder FAQs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;
    
    if (!Array.isArray(items) || !items.every(item => item.id && typeof item.order === 'number')) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    // Use a transaction to ensure all updates succeed or fail together
    const result = await prisma.$transaction(
      items.map(item => 
        prisma.fAQ.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: 'FAQs reordered successfully',
      data: result
    });
  } catch (error) {
    console.error('Error reordering FAQs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder FAQs' },
      { status: 500 }
    );
  }
}