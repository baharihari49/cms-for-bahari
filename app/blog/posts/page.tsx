// app/blog/posts/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Pencil, Trash, MoreHorizontal, Plus, Eye } from 'lucide-react'
import Link from 'next/link'

// Define types
type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  hasImage: boolean
  isFeature: boolean
  published: boolean
  category: {
    name: string
  }
  createdAt: string
}

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Fetch posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog/posts')
        const data = await response.json()
        
        if (data.success) {
          setPosts(data.data)
        } else {
          toast.error("Error", {
            description: data.error || "Failed to fetch blog posts"
          })
        }
      } catch {
        toast.error("Error", {
          description: "Failed to connect to the server"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Handle post deletion
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`/api/blog/posts/${id}`, {
          method: 'DELETE',
        })
        const data = await response.json()
        
        if (data.success) {
          setPosts(posts.filter(post => post.id !== id))
          toast.success("Success", {
            description: "Blog post deleted successfully"
          })
        } else {
          toast.error("Error", {
            description: data.error || "Failed to delete blog post"
          })
        }
      } catch {
        toast.error("Error", {
          description: "Failed to connect to the server"
        })
      }
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Blog Posts</CardTitle>
            <CardDescription>Manage your blog posts</CardDescription>
          </div>
          <Button asChild>
            <Link href="/blog/posts/new">
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64">
              <p className="text-muted-foreground mb-4">No blog posts found</p>
              <Button asChild>
                <Link href="/blog/posts/new">
                  <Plus className="mr-2 h-4 w-4" /> Create your first post
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableCaption>A list of your blog posts.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[280px]">
                          {post.excerpt || 'No excerpt'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category.name}</Badge>
                    </TableCell>
                    <TableCell>
                      {post.published ? (
                        <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {post.isFeature ? (
                        <Badge variant="secondary">Featured</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => router.push(`/blog/${post.slug}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/blog/posts/edit/${post.slug}`)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}