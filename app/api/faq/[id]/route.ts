// app/api/faq/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Fungsi utilitas untuk ambil ID dari URL
const getIdFromRequest = (request: NextRequest): string | null => {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  return segments.pop() || null;
};

// GET FAQ by id
export async function GET(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) throw new Error('Invalid ID');

    const faq = await prisma.fAQ.findUnique({ where: { id } });

    if (!faq) {
      return NextResponse.json({ success: false, error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: faq });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch FAQ' }, { status: 500 });
  }
}

// PATCH update FAQ
export async function PATCH(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) throw new Error('Invalid ID');

    const body = await request.json();
    const faq = await prisma.fAQ.update({ where: { id }, data: body });

    return NextResponse.json({ success: true, data: faq });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ success: false, error: 'Failed to update FAQ' }, { status: 500 });
  }
}

// DELETE FAQ
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) throw new Error('Invalid ID');

    await prisma.fAQ.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
