
'use client';

import { useState, useRef, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type UploadDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload: (file: File) => void;
};

export function UploadDialog({
  isOpen,
  onOpenChange,
  onFileUpload,
}: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
        if (selectedFile.type.startsWith('video/')) {
            setFile(selectedFile);
        } else {
            toast({
                variant: 'destructive',
                title: 'Invalid File Type',
                description: 'Please select a video file.',
            });
        }
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleSubmit = () => {
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDialogClose = () => {
    setFile(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
          <DialogDescription>
            Select a video file to analyze for crowd density and behavior.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
            className={cn(
              'flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors',
              isDragging ? 'border-primary bg-accent' : 'border-border'
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="w-10 h-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {isDragging ? 'Drop the file here' : 'Drag & drop a file or click to select'}
            </p>
            <Input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
          </div>
          {file && (
            <div className="text-sm text-center">
              Selected file: <span className="font-medium">{file.name}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!file}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
