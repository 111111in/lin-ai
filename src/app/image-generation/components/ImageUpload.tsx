'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Upload as UploadIcon,
  X
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  currentImage: string | null;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  );
}

export function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Update the selected file when the current image changes
  useEffect(() => {
    if (!currentImage) {
      setSelectedFile(null);
    }
  }, [currentImage]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setSelectedFile(file);

      // Convert the file to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const result = event.target.result as string;
          console.log('Image loaded, length:', result.length);
          onImageSelect(result);
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleRemove = () => {
    setSelectedFile(null);
    onImageSelect('');
  };

  return (
    <div className="w-full">
      {!currentImage ? (
        <div
          {...getRootProps()}
          className={`
            min-h-[260px] p-8 rounded-2xl 
            flex flex-col items-center justify-center gap-5
            bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10
            shadow-xl
            border-2 ${isDragActive ? 'border-primary/60 border-dashed scale-105' : 'border-border/50'} 
            transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-primary/50
            cursor-pointer relative overflow-hidden
            before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent_50%)] before:opacity-30
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mb-5 shadow-2xl shadow-primary/20 relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse"></div>
              <Sparkles className="w-10 h-10 text-primary relative z-10" />
            </div>
            <h3 className="text-xl font-black mb-2">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Upload an Image
              </span>
            </h3>
            <p className="text-base font-semibold text-foreground mb-2">
              Drop your file here or click to browse
            </p>
            <p className="text-sm text-muted-foreground mt-1 max-w-md leading-relaxed">
              Edit existing images or create new ones with text prompts
            </p>
            <div className="mt-6 flex gap-3">
              <div className="px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary text-xs font-bold rounded-xl border border-primary/30 shadow-lg">
                PNG
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary text-xs font-bold rounded-xl border border-primary/30 shadow-lg">
                JPG
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary text-xs font-bold rounded-xl border border-primary/30 shadow-lg">
                Max 10MB
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-border/50 overflow-hidden shadow-2xl bg-gradient-to-b from-card/80 to-card">
          <div className="flex items-center justify-between p-4 border-b-2 border-border/30 bg-gradient-to-r from-card to-card/80">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mr-3 shadow-lg">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold truncate">
                  {selectedFile?.name || 'Image Ready for Editing'}
                </p>
                {selectedFile && (
                  <p className="text-xs text-muted-foreground font-medium">
                    {formatFileSize(selectedFile.size)}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl font-semibold transition-all duration-300"
            >
              <X className="w-4 h-4 mr-1.5" />
              <span className="text-xs">Remove</span>
            </Button>
          </div>
          <div className="aspect-[16/9] relative bg-gradient-to-br from-muted/20 to-muted/10">
            <img
              src={currentImage}
              alt="Selected"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
