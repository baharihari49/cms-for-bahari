// app/api/faq/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all FAQs
export async function GET(request: NextRequest) {
  try {
    // Get query params for optional filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const where = category ? { category } : {};
    
    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ 
      success: true, 
      data: faqs 
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

// POST new FAQ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get the highest order value to place new FAQ at the end
    const highestOrder = await prisma.fAQ.findFirst({
      orderBy: {
        order: 'desc',
      },
      select: {
        order: true,
      },
    });
    
    const nextOrder = highestOrder?.order ? highestOrder.order + 1 : 1;
    
    const faq = await prisma.fAQ.create({
      data: {
        question: body.question,
        answer: body.answer,
        category: body.category,
        order: body.order || nextOrder,
      },
    });

    return NextResponse.json(
      { success: true, data: faq },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}