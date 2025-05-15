// app/api/blog/posts/convert/route.ts
// Utility to convert existing blog posts to the new schema

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSlug } from '@/lib/blog';

// This is a utility endpoint to convert old blog post data to the new schema
// It should be called once after setting up the database and then disabled

export async function POST(request: NextRequest) {
  try {
    const { oldPosts, authorId } = await request.json();
    
    if (!Array.isArray(oldPosts) || !authorId) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data. Expected oldPosts array and authorId.' },
        { status: 400 }
      );
    }
    
    // Process each post
    const results = [];
    
    for (const post of oldPosts) {
      try {
        // 1. Check/create the category
        let category = await prisma.blogCategory.findUnique({
          where: { name: post.category }
        });
        
        if (!category) {
          category = await prisma.blogCategory.create({
            data: {
              name: post.category,
              slug: createSlug(post.category)
            }
          });
        }
        
        // 2. Create the blog post
        const blogPost = await prisma.blogPost.create({
          data: {
            title: post.title,
            slug: post.slug,
            thumbnail: post.thumbnail || null,
            excerpt: post.excerpt || null,
            content: "Imported content placeholder. Please update.",
            hasImage: post.hasImage || false,
            isFeature: post.isFeature || false,
            published: true,
            comments: post.comments || 0,
            authorId: authorId,
            categoryId: category.id
          }
        });
        
        results.push({
          success: true,
          id: blogPost.id,
          title: blogPost.title
        });
      } catch (error) {
        console.error(`Error importing post ${post.title}:`, error);
        results.push({
          success: false,
          title: post.title,
          error: (error as Error).message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Imported ${results.filter(r => r.success).length} of ${oldPosts.length} posts`,
      results
    });
  } catch (error) {
    console.error('Error in blog post conversion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to convert blog posts' },
      { status: 500 }
    );
  }
}