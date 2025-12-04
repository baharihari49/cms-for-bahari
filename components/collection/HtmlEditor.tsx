// components/collection/HtmlEditor.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Code, Eye, Loader2, FileCode, X } from 'lucide-react';

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
}

export function HtmlEditor({ value, onChange, label, disabled, error }: HtmlEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [activeTab, setActiveTab] = useState<string>('edit');
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle HTML file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.html') && !fileName.endsWith('.htm')) {
      setUploadError('Please select an HTML file (.html or .htm)');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/html', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onChange(result.content);
        setUploadedFilename(result.metadata?.originalFilename || file.name);
        setUploadError('');
      } else {
        setUploadError(result.error || 'Failed to upload HTML file');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearUploadedFile = () => {
    setUploadedFilename(null);
  };

  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="edit" className="gap-2">
              <Code className="h-4 w-4" /> Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" /> Preview
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            {uploadedFilename && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                <FileCode className="h-3 w-3" />
                <span className="max-w-[150px] truncate">{uploadedFilename}</span>
                <button
                  type="button"
                  onClick={clearUploadedFile}
                  className="hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload .html
                </>
              )}
            </Button>
          </div>
        </div>

        <TabsContent value="edit" className="mt-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste or type your HTML code here..."
            className="font-mono text-sm min-h-[400px] resize-y"
            disabled={disabled}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="border rounded-md overflow-hidden bg-white dark:bg-gray-950">
            {value ? (
              <iframe
                srcDoc={value}
                className="w-full min-h-[400px] border-0"
                sandbox="allow-scripts allow-same-origin"
                title="HTML Preview"
              />
            ) : (
              <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                No HTML content to preview
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <input
        ref={fileInputRef}
        type="file"
        accept=".html,.htm"
        onChange={handleFileUpload}
        className="hidden"
        disabled={disabled}
      />

      {(uploadError || error) && (
        <p className="text-sm text-destructive">{uploadError || error}</p>
      )}
    </div>
  );
}
