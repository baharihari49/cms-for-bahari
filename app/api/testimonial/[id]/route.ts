import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper untuk ekstrak ID dari path
const extractId = (request: NextRequest): string => {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  return segments.pop() as string;
};

// --- GET testimonial by id ---
export async function GET(request: NextRequest) {
  try {
    const id = extractId(request);

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

// --- PATCH testimonial by id ---
export async function PATCH(request: NextRequest) {
  try {
    const id = extractId(request);
    const body = await request.json();

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

// --- DELETE testimonial by id ---
export async function DELETE(request: NextRequest) {
  try {
    const id = extractId(request);

    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Testimonial deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}
