'use client'

import { useState } from 'react'

interface ImageUploaderProps {
  onImageSelected: (imageSrc: string) => void;
  onClose: () => void;
}

export const ImageUploader = ({ onImageSelected, onClose }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  // Handle direct URL input
  const handleUrlSubmit = () => {
    if (imageUrl) {
      onImageSelected(imageUrl);
      onClose();
    }
  };

  // Handle file upload to Cloudinary
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      setError('Silakan pilih file gambar (jpg, png, gif, dll)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file terlalu besar. Maksimal 10MB');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload to Cloudinary via API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadProgress(100);
        onImageSelected(result.url);
        onClose();
      } else {
        setError(result.error || 'Gagal mengupload gambar');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Gagal mengupload gambar. Silakan coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Tambahkan Gambar</h2>
        
        <div className="mb-4">
          <h3 className="font-medium mb-2">Opsi 1: Unggah Gambar</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <label className="cursor-pointer block">
              <span className="text-blue-600 hover:underline">Pilih file</span> atau tarik gambar ke sini
              <input 
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
            
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <p className="text-sm mt-1">Mengupload ke Cloudinary... {uploadProgress}%</p>
              </div>
            )}

            {error && (
              <div className="mt-2 text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium mb-2">Opsi 2: Gunakan URL</h3>
          <input 
            type="text" 
            className="border border-gray-300 rounded-md p-2 w-full" 
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={isUploading}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button 
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            onClick={onClose}
            disabled={isUploading}
          >
            Batal
          </button>
          <button 
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            onClick={handleUrlSubmit}
            disabled={isUploading || !imageUrl}
          >
            Tambahkan Gambar
          </button>
        </div>
      </div>
    </div>
  );
};