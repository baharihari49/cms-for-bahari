// components/portfolio/PortfolioDetails.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from 'lucide-react';
import { Portfolio } from '@/types';
import Image from 'next/image';

interface PortfolioDetailsProps {
  open: boolean;
  onClose: () => void;
  portfolio: Portfolio;
  onEdit: () => void;
}

export function PortfolioDetails({ 
  open, 
  onClose, 
  portfolio,
  onEdit 
}: PortfolioDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{portfolio.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Image Gallery */}
          <div className="relative h-64 w-full overflow-hidden rounded-lg mb-4">
            <Image
              src={portfolio.image}
              alt={portfolio.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Project Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div className="text-sm font-medium">{portfolio.category}</div>
                  
                  <div className="text-sm text-muted-foreground">Year</div>
                  <div className="text-sm font-medium">{portfolio.year}</div>
                  
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="text-sm font-medium">{portfolio.duration}</div>
                  
                  <div className="text-sm text-muted-foreground">Role</div>
                  <div className="text-sm font-medium">{portfolio.role}</div>
                  
                  {portfolio.highlight && (
                    <>
                      <div className="text-sm text-muted-foreground">Highlight</div>
                      <div className="text-sm font-medium text-green-600">{portfolio.highlight}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {portfolio.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              {portfolio.testimonial && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Testimonial</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm italic">&ldquo;{portfolio.testimonial.text}&rdquo;</p>
                    <p className="text-sm font-medium mt-2">{portfolio.testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{portfolio.testimonial.position}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Description</h3>
                <p className="text-sm">{portfolio.description}</p>
              </div>

              {/* Key Features */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Key Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {portfolio.keyFeatures.map((feature, index) => (
                    <li key={index} className="text-sm">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Challenges & Solutions */}
          <Accordion type="single" collapsible className="w-full">
            {portfolio.challenges && portfolio.challenges.length > 0 && (
              <AccordionItem value="challenges">
                <AccordionTrigger>Challenges</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {portfolio.challenges.map((challenge, index) => (
                      <li key={index} className="text-sm">
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}

            {portfolio.solutions && portfolio.solutions.length > 0 && (
              <AccordionItem value="solutions">
                <AccordionTrigger>Solutions</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {portfolio.solutions.map((solution, index) => (
                      <li key={index} className="text-sm">
                        {solution}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {portfolio.nextProject && (
              <span className="text-sm text-muted-foreground">
                Next Project: {portfolio.nextProject}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={onEdit}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit Project
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}