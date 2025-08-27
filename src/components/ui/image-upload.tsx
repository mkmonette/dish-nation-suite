import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Check, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { 
  validateImageFile, 
  compressImage, 
  createImagePreview, 
  cleanupImagePreview,
  getImageProcessingOptions,
  getBase64ImageSize
} from '@/utils/imageUtils';

interface ImageUploadProps {
  type: 'logo' | 'banner';
  currentImage?: string;
  onImageChange: (imageData: string | null) => void;
  maxSizeMB?: number;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  type,
  currentImage,
  onImageChange,
  maxSizeMB = type === 'logo' ? 2 : 5,
  className = '',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLogo = type === 'logo';
  const title = isLogo ? 'Store Logo' : 'Banner Image';
  const description = isLogo 
    ? 'Upload your store logo (PNG/JPG, up to 2MB)'
    : 'Upload a banner image (PNG/JPG, up to 5MB)';

  const handleFile = useCallback(async (file: File) => {
    // Validate file
    const validation = validateImageFile(file, maxSizeMB);
    if (!validation.isValid) {
      toast({
        title: 'Invalid File',
        description: validation.error,
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setProgress(20);

    try {
      // Create preview
      const preview = createImagePreview(file);
      setPreviewUrl(preview);
      setProgress(40);

      // Get processing options for image type
      const options = getImageProcessingOptions(type);
      setProgress(60);

      // Compress image
      const compressedImage = await compressImage(file, options);
      setProgress(80);

      // Update image
      onImageChange(compressedImage);
      setProgress(100);

      // Cleanup preview
      setTimeout(() => {
        if (preview) cleanupImagePreview(preview);
        setPreviewUrl(null);
      }, 1000);

      const sizeAfter = getBase64ImageSize(compressedImage);
      toast({
        title: `${title} Updated`,
        description: `Image compressed to ${sizeAfter.toFixed(1)}MB and uploaded successfully`,
      });

    } catch (error) {
      console.error('Image processing error:', error);
      toast({
        title: 'Upload Failed',
        description: 'There was an error processing your image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [type, maxSizeMB, onImageChange, title]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onImageChange(null);
    toast({
      title: `${title} Removed`,
      description: 'Image has been removed from your store',
    });
  };

  const openPreview = () => {
    if (currentImage) {
      window.open(currentImage, '_blank');
    }
  };

  const aspectRatio = isLogo ? 'aspect-square' : 'aspect-[2/1]';
  const heightClass = isLogo ? 'h-32' : 'h-24';

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          {currentImage && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openPreview}
                className="h-8 px-2"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="h-8 px-2 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
            ${dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }
            ${isProcessing ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
          `}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          {/* Processing State */}
          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Processing image...</p>
                  <Progress value={progress} className="w-32 mx-auto" />
                </div>
              </div>
            </div>
          )}

          {/* Current Image Display */}
          {currentImage && !isProcessing ? (
            <div className="space-y-3">
              <div className={`${aspectRatio} ${heightClass} mx-auto relative overflow-hidden rounded-lg`}>
                <img 
                  src={currentImage} 
                  alt={`${title} preview`}
                  className="w-full h-full object-contain bg-muted/10"
                />
                <Badge 
                  variant="secondary" 
                  className="absolute top-2 right-2 text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="text-center">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Change {title}
                </Button>
              </div>
            </div>
          ) : !isProcessing && (
            /* Upload Placeholder */
            <div className="text-center space-y-3">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {dragActive ? `Drop ${title.toLowerCase()} here` : `Upload ${title}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Drag & drop or click to browse
                </p>
              </div>
              <Button variant="outline" size="sm" type="button">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}

          {/* Preview Image (during processing) */}
          {previewUrl && isProcessing && (
            <div className={`${aspectRatio} ${heightClass} mx-auto relative overflow-hidden rounded-lg opacity-50`}>
              <img 
                src={previewUrl} 
                alt="Preview"
                className="w-full h-full object-contain bg-muted/10"
              />
            </div>
          )}
        </div>

        {/* Size Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3" />
          <span>Max size: {maxSizeMB}MB • Recommended: {isLogo ? '400x400px' : '1920x1080px'}</span>
        </div>

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </Card>
  );
};

export default ImageUpload;