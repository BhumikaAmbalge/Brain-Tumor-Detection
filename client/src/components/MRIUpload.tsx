import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface MRIUploadProps {
  onUpload: (file: File) => void;
}

export default function MRIUpload({ onUpload }: MRIUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (JPEG, PNG).",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onUpload(file);
  };

  const clearSelection = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full h-full min-h-[400px] border-dashed border-2 hover:bg-muted/5 transition-colors">
      <CardContent className="h-full flex flex-col items-center justify-center p-6">
        {preview ? (
          <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden border shadow-lg animate-in fade-in zoom-in duration-300">
            <img src={preview} alt="MRI Preview" className="w-full h-full object-cover" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 rounded-full"
              onClick={clearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs text-center backdrop-blur-sm">
              MRI Scan Ready for Analysis
            </div>
          </div>
        ) : (
          <div 
            className={`flex flex-col items-center justify-center w-full h-full cursor-pointer p-10 transition-all
              ${isDragging ? 'scale-105 opacity-70' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary animate-pulse">
              <Upload className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload MRI Scan</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Drag and drop your MRI image here, or click to browse your files.
              Supports JPEG, PNG, DICOM (converted).
            </p>
            <Button variant="outline" className="gap-2">
              <FileUp className="h-4 w-4" />
              Select File
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
