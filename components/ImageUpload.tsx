'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  label?: string
  value?: string
  onChange: (url: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  accept?: string
}

export const ImageUpload = ({
  label,
  value,
  onChange,
  placeholder = "https://example.com/image.jpg",
  className = "",
  disabled = false,
  accept = "image/*"
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Silakan pilih file gambar (jpg, png, gif, dll)')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file terlalu besar. Maksimal 10MB')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        onChange(result.url)
        setError('')
      } else {
        setError(result.error || 'Gagal mengupload gambar')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Gagal mengupload gambar. Silakan coba lagi.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlSubmit = () => {
    if (urlValue.trim()) {
      onChange(urlValue.trim())
      setUrlValue('')
      setShowUrlInput(false)
      setError('')
    }
  }

  const handleRemove = () => {
    onChange('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <Label>{label}</Label>}

      {/* Preview Image */}
      {value && (
        <div className="relative inline-block">
          <Image
            src={value}
            alt="Preview"
            width={128}
            height={128}
            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Actions */}
      {!value && (
        <div className="space-y-2">
          {/* File Upload Button */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUrlInput(!showUrlInput)}
              disabled={disabled || isUploading}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* URL Input */}
          {showUrlInput && (
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder={placeholder}
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                disabled={disabled}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleUrlSubmit}
                disabled={disabled || !urlValue.trim()}
                size="sm"
              >
                Add
              </Button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileUpload}
            className="hidden"
            disabled={disabled}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Current URL Display */}
      {value && !showUrlInput && (
        <div className="text-xs text-gray-500 truncate">
          {value}
        </div>
      )}
    </div>
  )
}
