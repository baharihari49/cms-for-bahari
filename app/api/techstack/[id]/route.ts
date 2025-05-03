import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper untuk ambil ID dari URL
const extractId = (request: NextRequest): string => {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  return segments.pop() as string;
};

// --- GET tech stack by ID ---
export async function GET(request: NextRequest) {
  try {
    const id = extractId(request);

    const techStack = await prisma.techStack.findUnique({ where: { id } });

    if (!techStack) {
      return NextResponse.json(
        { success: false, error: 'Tech stack not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: techStack });
  } catch (error) {
    console.error('Error fetching tech stack:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tech stack' },
      { status: 500 }
    );
  }
}

// --- PATCH update tech stack ---
export async function PATCH(request: NextRequest) {
  try {
    const id = extractId(request);
    const body = await request.json();

    const techStack = await prisma.techStack.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: techStack });
  } catch (error) {
    console.error('Error updating tech stack:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tech stack' },
      { status: 500 }
    );
  }
}

// --- DELETE tech stack ---
export async function DELETE(request: NextRequest) {
  try {
    const id = extractId(request);

    await prisma.techStack.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Tech stack deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting tech stack:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tech stack' },
      { status: 500 }
    );
  }
}
