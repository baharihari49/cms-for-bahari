// components/portfolio/PortfolioForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Loader2 } from 'lucide-react';
import { usePortfolioStore } from '@/hooks/usePortfolioStore';
import { Portfolio } from '@/types';
import { z } from 'zod';
import { CloudinaryUpload } from '@/components/CloudinaryUpload';

interface PortfolioFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  portfolio: Portfolio | null;
}

// Form validation schema
const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Image must be a valid URL"),
  description: z.string().min(1, "Description is required"),
  year: z.string().min(1, "Year is required"),
  role: z.string().min(1, "Role is required"),
  duration: z.string().min(1, "Duration is required"),
  highlight: z.string().optional(),
  nextProject: z.string().optional(),
  nextProjectSlug: z.string().optional(),
  link: z.string().optional()
});

// Default form state
const defaultFormData = {
  title: '',
  slug: '',
  category: 'Web',
  image: '',
  description: '',
  year: new Date().getFullYear().toString(),
  role: '',
  duration: '',
  highlight: '',
  nextProject: '',
  nextProjectSlug: '',
  link: '',
};

export function PortfolioForm({ open, onClose, onSuccess, portfolio }: PortfolioFormProps) {
  // State for the form
  const [formData, setFormData] = useState(defaultFormData);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [newTechnology, setNewTechnology] = useState('');
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [newKeyFeature, setNewKeyFeature] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [newChallenge, setNewChallenge] = useState('');
  const [solutions, setSolutions] = useState<string[]>([]);
  const [newSolution, setNewSolution] = useState('');
  const [testimonial, setTestimonial] = useState<{
    text: string;
    author: string;
    position: string;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Get create and update functions from the store
  const { createPortfolioItem, updatePortfolioItem } = usePortfolioStore();

  // Reset form state
  const resetForm = () => {
    setFormData(defaultFormData);
    setTechnologies([]);
    setKeyFeatures([]);
    setGallery([]);
    setChallenges([]);
    setSolutions([]);
    setTestimonial(null);
    setNewTechnology('');
    setNewKeyFeature('');
    setNewChallenge('');
    setNewSolution('');
    setFormError(null);
    setActiveTab("basic");
  };

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single one
      .trim();
  };

  // Populate form when editing an existing portfolio
  useEffect(() => {
    if (portfolio) {
      setFormData({
        title: portfolio.title,
        slug: portfolio.slug,
        category: portfolio.category,
        image: portfolio.image,
        description: portfolio.description,
        year: portfolio.year,
        role: portfolio.role,
        duration: portfolio.duration,
        highlight: portfolio.highlight || '',
        nextProject: portfolio.nextProject || '',
        nextProjectSlug: portfolio.nextProjectSlug || '',
        link: portfolio.link || ''
      });
      setTechnologies(portfolio.technologies);
      setKeyFeatures(portfolio.keyFeatures);
      setGallery(portfolio.gallery);
      setChallenges(portfolio.challenges || []);
      setSolutions(portfolio.solutions || []);
      setTestimonial(portfolio.testimonial || null);
    } else {
      resetForm();
    }
  }, [portfolio]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      // Auto-generate slug when title changes if slug is empty or matches previous title
      if (name === 'title' && (!prev.slug || prev.slug === generateSlug(prev.title))) {
        updatedData.slug = generateSlug(value);
      }

      return updatedData;
    });
  };

  // Handle testimonial input changes
  const handleTestimonialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTestimonial((prev) => ({
      ...(prev || { text: '', author: '', position: '' }),
      [name]: value,
    }));
  };

  // Array field handlers
  const addTechnology = () => {
    if (newTechnology.trim() && !technologies.includes(newTechnology.trim())) {
      setTechnologies([...technologies, newTechnology.trim()]);
      setNewTechnology('');
    }
  };

  const removeTechnology = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  const addKeyFeature = () => {
    if (newKeyFeature.trim()) {
      setKeyFeatures([...keyFeatures, newKeyFeature.trim()]);
      setNewKeyFeature('');
    }
  };

  const removeKeyFeature = (index: number) => {
    setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
  };


  const removeGalleryItem = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const addChallenge = () => {
    if (newChallenge.trim()) {
      setChallenges([...challenges, newChallenge.trim()]);
      setNewChallenge('');
    }
  };

  const removeChallenge = (index: number) => {
    setChallenges(challenges.filter((_, i) => i !== index));
  };

  const addSolution = () => {
    if (newSolution.trim()) {
      setSolutions([...solutions, newSolution.trim()]);
      setNewSolution('');
    }
  };

  const removeSolution = (index: number) => {
    setSolutions(solutions.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
    try {
      portfolioSchema.parse(formData);

      // Additional validation
      if (technologies.length === 0) {
        throw new Error("At least one technology is required");
      }
      if (keyFeatures.length === 0) {
        throw new Error("At least one key feature is required");
      }
      if (gallery.length === 0) {
        throw new Error("At least one gallery image is required");
      }

      // If testimonial is partially filled, require all fields
      if (testimonial) {
        if (!testimonial.text || !testimonial.author || !testimonial.position) {
          throw new Error("Please complete all testimonial fields or remove them");
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormError(error.errors[0].message);
      } else if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Validation failed. Please check your inputs.");
      }
      return;
    }

    // Prepare data for submission
    const portfolioData = {
      ...formData,
      technologies,
      keyFeatures,
      gallery,
      challenges: challenges.length > 0 ? challenges : undefined,
      solutions: solutions.length > 0 ? solutions : undefined,
      testimonial: testimonial && testimonial.text ? testimonial : undefined,
    };

    setFormSubmitting(true);

    try {
      let result;

      if (portfolio) {
        // Update existing portfolio
        result = await updatePortfolioItem(portfolio.id, portfolioData);
      } else {
        // Create new portfolio
        result = await createPortfolioItem(portfolioData);
      }

      if (result.success) {
        onClose();
        onSuccess();
      } else {
        setFormError(result.error || 'An error occurred');
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open && !formSubmitting) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {portfolio ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
          </DialogTitle>
          <DialogDescription>
            {portfolio
              ? 'Update the details of your portfolio project.'
              : 'Add details about your portfolio project.'}
          </DialogDescription>
        </DialogHeader>

        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Project Details</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="extra">Additional</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title*</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="My Awesome Project"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug*</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="my-awesome-project"
                  />
                  <p className="text-xs text-muted-foreground">
                    Only lowercase letters, numbers, and hyphens.
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web">Web</SelectItem>
                      <SelectItem value="Web App">Web App</SelectItem>
                      <SelectItem value="AI">AI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Year */}
                <div className="space-y-2">
                  <Label htmlFor="year">Year*</Label>
                  <Input
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="2024"
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">Your Role*</Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="Frontend Developer"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration*</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="2 weeks"
                  />
                </div>
              </div>

              {/* Main Image */}
              <div className="space-y-2">
                <CloudinaryUpload
                  label="Main Image*"
                  value={formData.image}
                  onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor="image">Demo link</Label>
                <Input
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project"
                  rows={5}
                />
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies*</Label>
                <p className="text-sm text-muted-foreground">
                  Add the technologies used in this project
                </p>

                <div className="flex flex-wrap gap-2 mb-2">
                  {technologies.map((tech, index) => (
                    <div key={index} className="bg-primary/10 text-primary py-1 px-3 rounded-full flex items-center">
                      {tech}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTechnology(index)}
                        className="h-4 w-4 ml-1 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex">
                  <Input
                    id="technologies"
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="Add a technology"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTechnology();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addTechnology}
                    className="ml-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Project Details Tab */}
            <TabsContent value="details" className="space-y-4">
              {/* Highlight */}
              <div className="space-y-2">
                <Label htmlFor="highlight">Highlight</Label>
                <Input
                  id="highlight"
                  name="highlight"
                  value={formData.highlight}
                  onChange={handleInputChange}
                  placeholder="e.g., Increased conversion rate by 35%"
                />
              </div>

              {/* Key Features */}
              <div className="space-y-2">
                <Label htmlFor="keyFeatures">Key Features*</Label>
                <p className="text-sm text-muted-foreground">
                  Add the main features of this project
                </p>

                <div className="space-y-2">
                  {keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-gray-100 py-2 px-3 rounded-md flex-1">
                        {feature}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeKeyFeature(index)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex mt-2">
                  <Input
                    id="keyFeatures"
                    value={newKeyFeature}
                    onChange={(e) => setNewKeyFeature(e.target.value)}
                    placeholder="Add a key feature"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addKeyFeature();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addKeyFeature}
                    className="ml-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Challenges */}
              <div className="space-y-2">
                <Label htmlFor="challenges">Challenges</Label>
                <p className="text-sm text-muted-foreground">
                  Add challenges you faced during this project
                </p>

                <div className="space-y-2">
                  {challenges.map((challenge, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-red-50 text-red-600 py-2 px-3 rounded-md flex-1">
                        {challenge}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChallenge(index)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex mt-2">
                  <Input
                    id="challenges"
                    value={newChallenge}
                    onChange={(e) => setNewChallenge(e.target.value)}
                    placeholder="Add a challenge"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addChallenge();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addChallenge}
                    className="ml-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Solutions */}
              <div className="space-y-2">
                <Label htmlFor="solutions">Solutions</Label>
                <p className="text-sm text-muted-foreground">
                  Add solutions to the challenges
                </p>

                <div className="space-y-2">
                  {solutions.map((solution, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-green-50 text-green-600 py-2 px-3 rounded-md flex-1">
                        {solution}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSolution(index)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex mt-2">
                  <Input
                    id="solutions"
                    value={newSolution}
                    onChange={(e) => setNewSolution(e.target.value)}
                    placeholder="Add a solution"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSolution();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addSolution}
                    className="ml-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-4">
              {/* Gallery */}
              <div className="space-y-2">
                <Label htmlFor="gallery">Gallery Images*</Label>
                <p className="text-sm text-muted-foreground">
                  Add image URLs for your project gallery
                </p>

                <div className="space-y-2">
                  {gallery.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-gray-100 py-2 px-3 rounded-md flex-1 truncate">
                        {item}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGalleryItem(index)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <CloudinaryUpload
                  label=""
                  value=""
                  onChange={(url) => {
                    setGallery([...gallery, url]);
                  }}
                  placeholder="Upload gallery image"
                  className="mt-2"
                />
              </div>

              {/* Testimonial */}
              <div className="space-y-2">
                <Label>Testimonial</Label>
                <p className="text-sm text-muted-foreground">
                  Add a testimonial for this project (optional)
                </p>

                <div className="space-y-2 p-4 border rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-text">Quote</Label>
                    <Textarea
                      id="testimonial-text"
                      name="text"
                      value={testimonial?.text || ''}
                      onChange={handleTestimonialChange}
                      placeholder="What did the client say about your work?"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="testimonial-author">Author</Label>
                      <Input
                        id="testimonial-author"
                        name="author"
                        value={testimonial?.author || ''}
                        onChange={handleTestimonialChange}
                        placeholder="Client's name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="testimonial-position">Position</Label>
                      <Input
                        id="testimonial-position"
                        name="position"
                        value={testimonial?.position || ''}
                        onChange={handleTestimonialChange}
                        placeholder="Client's position"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Additional Tab */}
            <TabsContent value="extra" className="space-y-4">
              {/* Next Project Link */}
              <div className="space-y-2">
                <Label>Related Projects</Label>
                <p className="text-sm text-muted-foreground">
                  Link to another project (optional)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nextProject">Next Project Title</Label>
                    <Input
                      id="nextProject"
                      name="nextProject"
                      value={formData.nextProject}
                      onChange={handleInputChange}
                      placeholder="Another Project Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextProjectSlug">Next Project Slug</Label>
                    <Input
                      id="nextProjectSlug"
                      name="nextProjectSlug"
                      value={formData.nextProjectSlug}
                      onChange={handleInputChange}
                      placeholder="another-project-slug"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={formSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formSubmitting}>
              {formSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {portfolio ? 'Update' : 'Create'} Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}