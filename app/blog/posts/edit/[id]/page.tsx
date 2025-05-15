'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Resolver } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { TiptapEditor } from '@/components/tiptap-editor'

// Types for categories and tags
interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface BlogTag {
  id: string;
  name: string;
}

// Form schema
const postSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  slug: z.string().min(3, {
    message: "Slug must be at least 3 characters.",
  }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  excerpt: z.string().optional(),
  thumbnail: z.string().optional(),
  hasImage: z.boolean().default(false),
  isFeature: z.boolean().default(false),
  published: z.boolean().default(false),
  categoryId: z.string({
    required_error: "Please select a category.",
  }),
  authorId: z.string({
    required_error: "Please select an author.",
  }),
  tags: z.array(z.string()).optional(),
});

// Define our form values type
type FormData = z.infer<typeof postSchema>;

export default function EditBlogPostPage() {
  // Use useParams() hook to get id from URL
  const params = useParams();
  const postId = params.id as string;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [authors, setAuthors] = useState<User[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const router = useRouter();

  // Initialize form with explicitly typed FormData
  const form = useForm<FormData>({
    resolver: zodResolver(postSchema) as Resolver<FormData>,
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      thumbnail: "",
      hasImage: false,
      isFeature: false,
      published: false,
      tags: [],
    },
  });

  // Fetch blog post, categories, tags and authors
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch the blog post
        const postResponse = await fetch(`/api/blog/posts/${postId}`);
        let postData;
        try {
          postData = await postResponse.json();
        } catch (error) {
          console.error("Failed to parse post response:", error);
          postData = { success: false };
        }
        
        if (postData && postData.success && postData.data) {
          // Set form values
          form.setValue("title", postData.data.title);
          form.setValue("slug", postData.data.slug);
          form.setValue("content", postData.data.content);
          form.setValue("excerpt", postData.data.excerpt || "");
          form.setValue("thumbnail", postData.data.thumbnail || "");
          form.setValue("hasImage", postData.data.hasImage);
          form.setValue("isFeature", postData.data.isFeature);
          form.setValue("published", postData.data.published);
          form.setValue("categoryId", postData.data.categoryId);
          form.setValue("authorId", postData.data.authorId);
          
          // Set selected tags
          if (Array.isArray(postData.data.tags)) {
            const tagIds = postData.data.tags.map((tag: BlogTag) => tag.id);
            setSelectedTags(tagIds);
          }
        } else {
          console.error("Failed to fetch blog post:", postData?.error || "Unknown error");
          router.push('/blog/posts');
          return;
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/blog/categories');
        let categoriesData;
        try {
          categoriesData = await categoriesResponse.json();
        } catch (error) {
          console.error("Failed to parse categories response:", error);
          categoriesData = { success: false, data: [] };
        }
        
        if (categoriesData && categoriesData.success) {
          setCategories(categoriesData.data);
        } else {
          console.warn("Categories data format is invalid or success is false");
          setCategories([]);
        }

        // Fetch tags
        const tagsResponse = await fetch('/api/blog/tags');
        let tagsData;
        try {
          tagsData = await tagsResponse.json();
        } catch (error) {
          console.error("Failed to parse tags response:", error);
          tagsData = { success: false, data: [] };
        }
        
        if (tagsData && tagsData.success) {
          setTags(tagsData.data);
        } else {
          console.warn("Tags data format is invalid or success is false");
          setTags([]);
        }

        // Fetch authors (users)
        const authorsResponse = await fetch('/api/auth/me');
        let authorsData;
        try {
          authorsData = await authorsResponse.json();
        } catch (error) {
          console.error("Failed to parse authors response:", error);
          authorsData = { success: false };
        }
        
        if (authorsData && authorsData.success && authorsData.user) {
          // Handle user object from response
          const user = authorsData.user;
          setAuthors([user]); // Convert single user to array
          
          // If the form doesn't have an authorId set yet, set it now
          if (!form.getValues("authorId") && user && user.id) {
            form.setValue("authorId", user.id);
          }
        } else if (authorsData && authorsData.success && Array.isArray(authorsData.data)) {
          // Handle array of users
          setAuthors(authorsData.data);
        } else {
          console.warn("Authors data format is invalid or success is false");
          setAuthors([]);
        }
      } catch (error) {
        console.error("Failed to load form data", error);
        router.push('/blog/posts');
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchData();
  }, [postId, form, router]);

  // Handle content change from Tiptap editor
  const handleEditorChange = (content: string) => {
    form.setValue("content", content);
  };

  // Handle form submission
  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    
    // Add selected tags to the values
    values.tags = selectedTags;
    
    try {
      const response = await fetch(`/api/blog/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log("Blog post updated successfully");
        router.push('/blog/posts');
      } else {
        console.error("Failed to update blog post:", data.error);
      }
    } catch (error) {
      console.error("Failed to connect to the server", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tag selection
  const handleTagChange = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/blog/posts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to posts
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Blog Post</CardTitle>
          <CardDescription>Update your blog post details</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingData ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Post title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="post-slug" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL-friendly version of the title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="authorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an author" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {authors.map(author => (
                              <SelectItem key={author.id} value={author.id}>
                                {author.name || author.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail URL</FormLabel>
                        <FormControl>
                          <Input placeholder="/images/blog/thumbnail.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL to the featured image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex flex-col space-y-4">
                    <FormField
                      control={form.control}
                      name="hasImage"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Has Image</FormLabel>
                            <FormDescription>
                              Post has a thumbnail image
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isFeature"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Featured Post</FormLabel>
                            <FormDescription>
                              Highlight this post on the homepage
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="published"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Published</FormLabel>
                            <FormDescription>
                              Make this post publicly visible
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief summary of the post" 
                          {...field} 
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Short preview text shown in listings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <div className="w-full">
                          <TiptapEditor 
                            value={field.value} 
                            onChange={handleEditorChange}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Rich text editor with Markdown support
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <h3 className="mb-4 text-sm font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <label 
                        key={tag.id}
                        className={`flex items-center px-3 py-1 rounded-full border cursor-pointer text-sm ${
                          selectedTags.includes(tag.id) 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-background'
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={tag.id}
                          checked={selectedTags.includes(tag.id)}
                          onChange={() => handleTagChange(tag.id)}
                          className="sr-only"
                        />
                        {tag.name}
                      </label>
                    ))}
                  </div>
                </div>
                
                <CardFooter className="flex justify-between px-0 pb-0">
                  <Button variant="outline" type="button" asChild>
                    <Link href="/blog/posts">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Post
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}