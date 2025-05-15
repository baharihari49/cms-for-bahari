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
import { toast } from "sonner"
import { Pencil, Trash, MoreHorizontal, Plus, ArrowUpDown, Folder } from 'lucide-react'
// import Link from 'next/link'
import { createSlug } from '@/lib/blog'

// Define types
type BlogCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  postCount: number
  createdAt: string
}

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' })
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/blog/categories?withPostCount=true')
        const data = await response.json()
        
        if (data.success) {
          setCategories(data.data)
        } else {
          toast.error("Error", {
            description: data.error || "Failed to fetch categories"
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

    fetchCategories()
  }, [])

  // Handle category creation
  const handleCreateCategory = async () => {
    setIsCreating(true)
    
    try {
      const response = await fetch('/api/blog/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Add the new category to the list with 0 post count
        setCategories([...categories, { ...data.data, postCount: 0 }])
        setNewCategory({ name: '', slug: '', description: '' })
        toast.success("Success", {
          description: "Category created successfully"
        })
      } else {
        toast.error("Error", {
          description: data.error || "Failed to create category"
        })
      }
    } catch {
      toast.error("Error", {
        description: "Failed to connect to the server"
      })
    } finally {
      setIsCreating(false)
    }
  }

  // Handle category update
  const handleUpdateCategory = async () => {
    if (!editingCategory) return
    
    setIsUpdating(true)
    
    try {
      const response = await fetch(`/api/blog/categories/${editingCategory.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingCategory.name,
          slug: editingCategory.slug,
          description: editingCategory.description
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Update the category in the list
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, ...data.data } 
            : cat
        ))
        setEditingCategory(null)
        toast.success("Success", {
          description: "Category updated successfully"
        })
      } else {
        toast.error("Error", {
          description: data.error || "Failed to update category"
        })
      }
    } catch {
      toast.error("Error", {
        description: "Failed to connect to the server"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle category deletion
  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/blog/categories/${id}`, {
          method: 'DELETE',
        })
        const data = await response.json()
        
        if (data.success) {
          setCategories(categories.filter(cat => cat.id !== id))
          toast.success("Success", {
            description: "Category deleted successfully"
          })
        } else {
          toast.error("Error", {
            description: data.error || "Failed to delete category"
          })
        }
      } catch {
        toast.error("Error", {
          description: "Failed to connect to the server"
        })
      }
    }
  }

  // Handle name change for new category to auto-generate slug
  const handleNameChange = (name: string) => {
    setNewCategory({
      ...newCategory,
      name,
      slug: createSlug(name)
    })
  }

  // Handle name change for editing category to auto-generate slug
  const handleEditNameChange = (name: string) => {
    if (!editingCategory) return
    
    setEditingCategory({
      ...editingCategory,
      name,
      slug: createSlug(name)
    })
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Blog Categories</CardTitle>
            <CardDescription>Manage your blog categories</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new category for your blog posts.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newCategory.name}
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
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" onClick={handleCreateCategory} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64">
              <Folder className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No categories found</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create your first category
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  {/* Same dialog content as above */}
                  <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                    <DialogDescription>
                      Add a new category for your blog posts.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name-first" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name-first"
                        value={newCategory.name}
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
                        value={newCategory.slug}
                        onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description-first" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description-first"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleCreateCategory} disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Table>
              <TableCaption>A list of your blog categories.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
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
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {category.description || <span className="text-muted-foreground">No description</span>}
                    </TableCell>
                    <TableCell className="text-center">{category.postCount}</TableCell>
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
                            onClick={() => router.push(`/blog/categories/${category.id}`)}
                          >
                            View Posts
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setEditingCategory(category)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={category.postCount > 0}
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

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category details.
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
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
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleUpdateCategory} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}