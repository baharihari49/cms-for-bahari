// app/api/upload/html/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.html') && !fileName.endsWith('.htm')) {
      return NextResponse.json(
        { success: false, error: 'Only HTML files are allowed (.html, .htm)' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Read file content
    const content = await file.text();

    return NextResponse.json({
      success: true,
      content: content,
      metadata: {
        originalFilename: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('HTML upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process HTML file' },
      { status: 500 }
    );
  }
}
