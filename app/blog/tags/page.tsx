// app/blog/tags/page.tsx (continued)
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
// import { toast } from '@/components/ui/use-toast'
import { Pencil, Trash, MoreHorizontal, Plus, ArrowUpDown, Tag } from 'lucide-react'
import { createSlug } from '@/lib/blog'

// Define types
type BlogTag = {
  id: string
  name: string
  slug: string
  description: string | null
  postCount: number
  createdAt: string
}

export default function BlogTagsPage() {
  const [tags, setTags] = useState<BlogTag[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null)
  const [newTag, setNewTag] = useState({ name: '', slug: '', description: '' })
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  // Fetch tags
  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch('/api/blog/tags?withPostCount=true')
        const data = await response.json()
        
        if (data.success) {
          setTags(data.data)
        } else {
        //   toast({
        //     title: "Error",
        //     description: data.error || "Failed to fetch tags",
        //     variant: "destructive"
        //   })
        }
      } catch {
        // toast({
        //   title: "Error",
        //   description: "Failed to connect to the server",
        //   variant: "destructive"
        // })
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  // Handle tag creation
  const handleCreateTag = async () => {
    setIsCreating(true)
    
    try {
      const response = await fetch('/api/blog/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTag),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Add the new tag to the list with 0 post count
        setTags([...tags, { ...data.data, postCount: 0 }])
        setNewTag({ name: '', slug: '', description: '' })
        // toast({
        //   title: "Success",
        //   description: "Tag created successfully"
        // })
      } else {
        // toast({
        //   title: "Error",
        //   description: data.error || "Failed to create tag",
        //   variant: "destructive"
        // })
      }
    } catch {
    //   toast({
    //     title: "Error",
    //     description: "Failed to connect to the server",
    //     variant: "destructive"
    //   })
    } finally {
      setIsCreating(false)
    }
  }

  // Handle tag update
  const handleUpdateTag = async () => {
    if (!editingTag) return
    
    setIsUpdating(true)
    
    try {
      const response = await fetch(`/api/blog/tags/${editingTag.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingTag.name,
          slug: editingTag.slug,
          description: editingTag.description
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Update the tag in the list
        setTags(tags.map(tag => 
          tag.id === editingTag.id 
            ? { ...tag, ...data.data } 
            : tag
        ))
        setEditingTag(null)
        // toast({
        //   title: "Success",
        //   description: "Tag updated successfully"
        // })
      } else {
        // toast({
        //   title: "Error",
        //   description: data.error || "Failed to update tag",
        //   variant: "destructive"
        // })
      }
    } catch {
    //   toast({
    //     title: "Error",
    //     description: "Failed to connect to the server",
    //     variant: "destructive"
    //   })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle tag deletion
  const handleDeleteTag = async (id: string) => {
    if (confirm("Are you sure you want to delete this tag? Any posts tagged with it will have this tag removed.")) {
      try {
        const response = await fetch(`/api/blog/tags/${id}`, {
          method: 'DELETE',
        })
        const data = await response.json()
        
        if (data.success) {
          setTags(tags.filter(tag => tag.id !== id))
        //   toast({
        //     title: "Success",
        //     description: "Tag deleted successfully"
        //   })
        } else {
        //   toast({
        //     title: "Error",
        //     description: data.error || "Failed to delete tag",
        //     variant: "destructive"
        //   })
        }
      } catch {
        // toast({
        //   title: "Error",
        //   description: "Failed to connect to the server",
        //   variant: "destructive"
        // })
      }
    }
  }

  // Handle name change for new tag to auto-generate slug
  const handleNameChange = (name: string) => {
    setNewTag({
      ...newTag,
      name,
      slug: createSlug(name)
    })
  }

  // Handle name change for editing tag to auto-generate slug
  const handleEditNameChange = (name: string) => {
    if (!editingTag) return
    
    setEditingTag({
      ...editingTag,
      name,
      slug: createSlug(name)
    })
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Blog Tags</CardTitle>
            <CardDescription>Manage your blog tags</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Tag</DialogTitle>
                <DialogDescription>
                  Add a new tag for your blog posts.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newTag.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="slug" className="text-right">
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    value={newTag.slug}
                    onChange={(e) => setNewTag({ ...newTag, slug: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newTag.description}
                    onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" onClick={handleCreateTag} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading tags...</p>
            </div>
          ) : tags.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64">
              <Tag className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No tags found</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create your first tag
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Tag</DialogTitle>
                    <DialogDescription>
                      Add a new tag for your blog posts.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name-first" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name-first"
                        value={newTag.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="slug-first" className="text-right">
                        Slug
                      </Label>
                      <Input
                        id="slug-first"
                        value={newTag.slug}
                        onChange={(e) => setNewTag({ ...newTag, slug: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description-first" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description-first"
                        value={newTag.description}
                        onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleCreateTag} disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map(tag => (
                  <Badge 
                    key={tag.id} 
                    variant="outline"
                    className="flex items-center gap-1 text-sm py-1 px-3"
                  >
                    {tag.name}
                    <span className="ml-1 text-xs bg-muted text-muted-foreground rounded-full px-1.5 py-0.5">
                      {tag.postCount}
                    </span>
                  </Badge>
                ))}
              </div>
              
              <Table>
                <TableCaption>A list of your blog tags.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">
                      <div className="flex items-center">
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Posts</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-medium">{tag.name}</TableCell>
                      <TableCell>{tag.slug}</TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {tag.description || <span className="text-muted-foreground">No description</span>}
                      </TableCell>
                      <TableCell className="text-center">{tag.postCount}</TableCell>
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
                              onClick={() => router.push(`/blog/tags/${tag.id}`)}
                            >
                              View Posts
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setEditingTag(tag)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteTag(tag.id)}
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Tag Dialog */}
      <Dialog open={!!editingTag} onOpenChange={(open) => !open && setEditingTag(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update tag details.
            </DialogDescription>
          </DialogHeader>
          {editingTag && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editingTag.name}
                  onChange={(e) => handleEditNameChange(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-slug" className="text-right">
                  Slug
                </Label>
                <Input
                  id="edit-slug"
                  value={editingTag.slug}
                  onChange={(e) => setEditingTag({ ...editingTag, slug: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingTag.description || ''}
                  onChange={(e) => setEditingTag({ ...editingTag, description: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTag(null)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleUpdateTag} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}