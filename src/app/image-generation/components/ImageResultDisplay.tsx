'use client';

import { useEffect, useState } from 'react';
import {
  Download,
  ExternalLink,
  ImageIcon,
  MessageCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HistoryItem {
  role: 'user' | 'model';
  parts: HistoryPart[];
}

interface HistoryPart {
  text?: string;
  image?: string;
}

interface ImageResultDisplayProps {
  imageUrl: string;
  description: string | null;
  onReset: () => void;
  conversationHistory?: HistoryItem[];
}

export function ImageResultDisplay({
  imageUrl,
  description,
  onReset,
  conversationHistory = []
}: ImageResultDisplayProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Ensure we have an absolute URL for images
  const ensureAbsoluteUrl = (url: string) => {
    if (typeof window !== 'undefined' && url && url.startsWith('/')) {
      return `${window.location.origin}${url}`;
    }
    return url;
  };

  // Reset image states when URL changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [imageUrl]);

  const absoluteImageUrl = ensureAbsoluteUrl(imageUrl);

  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = absoluteImageUrl;
    link.download = `agentdock-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-xl">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-black">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Generated Image
            </span>
          </h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="border-2 border-primary/30 hover:bg-primary/10 hover:text-primary hover:border-primary/50 rounded-xl font-semibold shadow-lg transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
            <Download className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">Download</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(absoluteImageUrl, '_blank')}
            className="border-2 border-primary/30 hover:bg-primary/10 hover:text-primary hover:border-primary/50 rounded-xl font-semibold shadow-lg transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
            <ExternalLink className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">Full Size</span>
          </Button>
          {conversationHistory.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleHistory}
              className={cn(
                'border-2 border-primary/30 hover:border-primary/50 rounded-xl font-semibold shadow-lg transition-all duration-300 relative overflow-hidden group',
                showHistory
                  ? 'bg-primary/15 text-primary border-primary/50'
                  : 'hover:bg-primary/10 hover:text-primary'
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
              <MessageCircle className="w-4 h-4 mr-2 relative z-10" />
              <span className="relative z-10">
                {showHistory ? 'Hide History' : 'History'}
              </span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="border-2 border-destructive/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 rounded-xl font-semibold shadow-lg transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
            <RotateCcw className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">New Image</span>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-border/30 to-border/50 p-2 shadow-2xl">
        <div className="rounded-xl overflow-hidden bg-black/5 backdrop-blur-sm relative border-2 border-border/30">
          {!imageLoaded && !imageError && (
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl border-4 border-primary/30 border-t-primary animate-spin"></div>
                  <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-base font-bold text-foreground">
                  Loading image...
                </p>
              </div>
            </div>
          )}

          {imageError && (
            <div className="flex flex-col items-center justify-center h-80 bg-muted/20 text-muted-foreground">
              <div className="p-4 rounded-lg bg-card/80 backdrop-blur-sm border border-destructive/20 shadow-sm">
                <p className="mb-3 text-sm font-medium text-destructive/80">
                  Failed to load image
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(absoluteImageUrl, '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  Try Opening Directly
                </Button>
              </div>
            </div>
          )}

          <img
            src={absoluteImageUrl}
            alt="Generated image"
            className={`max-w-full h-auto mx-auto transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ maxHeight: '60vh' }}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              console.error(`Failed to load image: ${absoluteImageUrl}`);
              setImageError(true);
            }}
          />
        </div>
      </div>

      {description && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-background border-2 border-primary/20 shadow-lg">
          <h3 className="text-base font-bold mb-3 flex items-center gap-2">
            <span className="inline-block p-2 bg-primary/20 rounded-xl">
              <MessageCircle className="w-4 h-4 text-primary" />
            </span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Description
            </span>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      )}

      {showHistory && conversationHistory.length > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 border-2 border-border/50 shadow-lg">
          <h3 className="text-base font-bold mb-6 flex items-center gap-2">
            <span className="inline-block p-2 bg-primary/20 rounded-xl">
              <MessageCircle className="w-4 h-4 text-primary" />
            </span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Image History
            </span>
          </h3>
          <div className="space-y-5">
            {conversationHistory.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'p-5 rounded-xl border-2 shadow-lg transition-all duration-300 hover:shadow-xl',
                  item.role === 'user'
                    ? 'bg-gradient-to-br from-muted/50 to-muted/30 border-muted-foreground/30'
                    : 'bg-gradient-to-br from-primary/10 to-secondary/5 border-primary/30'
                )}
              >
                <p
                  className={`text-sm font-bold mb-3 ${
                    item.role === 'user' ? 'text-foreground' : 'text-primary'
                  }`}
                >
                  {item.role === 'user' ? 'Your Request' : 'Generated Result'}
                </p>
                <div className="space-y-4">
                  {item.parts.map((part, partIndex) => (
                    <div key={partIndex}>
                      {part.text && (
                        <p className="text-sm leading-relaxed">{part.text}</p>
                      )}
                      {part.image && (
                        <div className="mt-4 overflow-hidden rounded-xl border-2 border-border/30 shadow-lg">
                          <img
                            src={ensureAbsoluteUrl(part.image)}
                            alt={`${item.role} image`}
                            className="max-w-full h-auto object-contain"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
