// components/experiences/ExperienceForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from 'lucide-react';
import { useExperienceStore } from '@/hooks/useExperienceStore';
import { Experience } from '@/types';
import { z } from 'zod';
import { CloudinaryUpload } from '@/components/CloudinaryUpload';

interface ExperienceFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  experience: Experience | null;
}

// Form validation schema
const experienceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  duration: z.string().min(1, "Duration is required"),
  location: z.string().min(1, "Location is required"),
  type: z.string(),
  current: z.boolean().default(false),
  companyLogo: z.string().optional(),
  link: z.string().optional(),
});

// Default form state
const defaultFormData = {
  title: '',
  company: '',
  duration: '',
  location: '',
  companyLogo: '',
  link: '',
  type: 'fulltime',
  current: false,
};

export function ExperienceForm({ open, onClose, onSuccess, experience }: ExperienceFormProps) {
  // State for the form
  const [formData, setFormData] = useState(defaultFormData);
  const [listItems, setListItems] = useState<string[]>([]);
  const [newListItem, setNewListItem] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Get create and update functions from the store
  const { createExperience, updateExperience } = useExperienceStore();

  // Reset form state
  const resetForm = () => {
    setFormData(defaultFormData);
    setListItems([]);
    setSkills([]);
    setAchievements([]);
    setNewListItem('');
    setNewSkill('');
    setNewAchievement('');
    setFormError(null);
  };

  // Populate form when editing an experience
  useEffect(() => {
    if (experience) {
      setFormData({
        title: experience.title,
        company: experience.company,
        duration: experience.duration,
        location: experience.location,
        companyLogo: experience.companyLogo || '',
        link: experience.link || '',
        type: experience.type,
        current: experience.current,
      });
      setListItems(experience.list);
      setSkills(experience.skills);
      setAchievements(experience.achievements);
    } else {
      resetForm();
    }
  }, [experience]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, current: checked }));
  };

  // Handle select change
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  // Array field handlers
  const addListItem = () => {
    if (newListItem.trim()) {
      setListItems([...listItems, newListItem.trim()]);
      setNewListItem('');
    }
  };

  const removeListItem = (index: number) => {
    setListItems(listItems.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements([...achievements, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Basic validation
    try {
      experienceSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormError(error.errors[0].message);
      }
      return;
    }
    
    // Prepare data for submission
    const experienceData = {
      ...formData,
      list: listItems,
      skills: skills,
      achievements: achievements,
    };
    
    setFormSubmitting(true);
    
    try {
      let result;
      
      if (experience) {
        // Update existing experience
        result = await updateExperience(experience.id, experienceData);
      } else {
        // Create new experience
        result = await createExperience(experienceData);
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

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open && !formSubmitting) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {experience ? 'Edit Experience' : 'Add New Experience'}
          </DialogTitle>
          <DialogDescription>
            {experience 
              ? 'Update the details of your work experience.' 
              : 'Add details about your work experience.'}
          </DialogDescription>
        </DialogHeader>
        
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Job Title*</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Frontend Developer"
              />
            </div>
            
            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company">Company*</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Acme Inc."
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
                placeholder="Jan 2021 - Present"
              />
            </div>
            
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location*</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Remote / Jakarta, Indonesia"
              />
            </div>
            
            {/* Company Logo */}
            <div className="space-y-2">
              <CloudinaryUpload
                label="Company Logo"
                value={formData.companyLogo}
                onChange={(url) => setFormData(prev => ({ ...prev, companyLogo: url }))}
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            {/* Company Website */}
            <div className="space-y-2">
              <Label htmlFor="link">Company Website</Label>
              <Input
                id="link"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
            
            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Employment Type*</Label>
              <Select
                value={formData.type}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fulltime">Full-time</SelectItem>
                  <SelectItem value="parttime">Part-time</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Current Position */}
            <div className="flex items-center h-full space-x-2 pt-8">
              <Checkbox
                id="current"
                checked={formData.current}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="current" className="cursor-pointer">
                This is my current position
              </Label>
            </div>
          </div>
          
          <Separator />
          
          {/* Responsibilities List */}
          <div className="space-y-2">
            <Label htmlFor="responsibilities">Responsibilities</Label>
            <p className="text-sm text-muted-foreground">
              Add your key responsibilities in this role
            </p>
            
            <div className="space-y-2">
              {listItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-gray-100 py-2 px-3 rounded-md flex-1">
                    {item}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeListItem(index)}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex mt-2">
              <Input
                id="responsibilities"
                value={newListItem}
                onChange={(e) => setNewListItem(e.target.value)}
                placeholder="Add a responsibility"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addListItem();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addListItem}
                className="ml-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Separator />
          
          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <p className="text-sm text-muted-foreground">
              Add relevant skills used in this role
            </p>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((skill, index) => (
                <div key={index} className="bg-primary/10 text-primary py-1 px-3 rounded-full flex items-center">
                  {skill}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(index)}
                    className="h-4 w-4 ml-1 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex">
              <Input
                id="skills"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addSkill}
                className="ml-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Separator />
          
          {/* Achievements */}
          <div className="space-y-2">
            <Label htmlFor="achievements">Achievements</Label>
            <p className="text-sm text-muted-foreground">
              Add notable achievements from this role
            </p>
            
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-green-50 text-green-700 py-2 px-3 rounded-md flex-1">
                    {achievement}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAchievement(index)}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex mt-2">
              <Input
                id="achievements"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Add an achievement"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAchievement();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addAchievement}
                className="ml-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
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
              {experience ? 'Update' : 'Create'} Experience
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}