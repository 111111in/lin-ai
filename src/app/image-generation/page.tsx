'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LogCategory, logger } from 'agentdock-core';
import { ChevronUp, ImageIcon, PencilLine, Trash2, X } from 'lucide-react';

import { generateImageAction } from '@/app/api/images/gemini/actions';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { HistoryItem } from '@/lib/image-gen-storage';
import { cn } from '@/lib/utils';
import { ImageGallerySkeleton } from './components/ImageGallerySkeleton';
import { ImagePromptInput } from './components/ImagePromptInput';
import { ImageResultDisplay } from './components/ImageResultDisplay';
import { ImageUpload } from './components/ImageUpload';
import { clearHistoryAction, saveHistoryAction } from './history-actions';

// Helper function to get image data from URL
const fetchImageDataFromUrl = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image data:', error);
    return null;
  }
};

// SearchParams wrapper component to fix hydration issues
function ImageGenerationWithParams(props: { editIdFromUrl?: string | null }) {
  const { editIdFromUrl } = props;

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [storedImages, setStoredImages] = useState<string[]>([]);
  const [scrollToGallery, setScrollToGallery] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Effect to manage session ID ONLY
  useEffect(() => {
    let storedSessionId = localStorage.getItem('imageGenSessionId');
    if (!storedSessionId) {
      storedSessionId = crypto.randomUUID();
      localStorage.setItem('imageGenSessionId', storedSessionId);
      logger.debug(
        LogCategory.SYSTEM,
        'ImageGenPage',
        'Generated new imageGenSessionId',
        { sessionId: storedSessionId }
      );
    } else {
      logger.debug(
        LogCategory.SYSTEM,
        'ImageGenPage',
        'Retrieved existing imageGenSessionId',
        { sessionId: storedSessionId }
      );
    }
    setSessionId(storedSessionId);
  }, []);

  // Effect to load stored images on mount (environment-aware)
  useEffect(() => {
    const IS_HUB_CLIENT = process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === 'hub';
    logger.debug(LogCategory.SYSTEM, 'ImageGenPage', 'Loading gallery images', {
      isHub: IS_HUB_CLIENT
    });

    setGalleryLoading(true);
    if (IS_HUB_CLIENT) {
      // --- Production/Hub Mode ---
      const storedUrls = localStorage.getItem('galleryImageUrls');
      if (storedUrls) {
        try {
          const urls = JSON.parse(storedUrls);
          setStoredImages(urls);
          logger.debug(
            LogCategory.SYSTEM,
            'ImageGenPage',
            'Loaded gallery URLs from localStorage',
            { count: urls.length }
          );
        } catch (e) {
          logger.error(
            LogCategory.SYSTEM,
            'ImageGenPage',
            'Failed to parse gallery URLs from localStorage',
            { error: e }
          );
          localStorage.removeItem('galleryImageUrls');
          setStoredImages([]);
        }
      } else {
        setStoredImages([]); // Start empty if nothing in localStorage
      }
      setGalleryLoading(false);
    } else {
      // --- Local/OSS Mode ---
      // Clear any potentially stale localStorage from hub mode
      localStorage.removeItem('galleryImageUrls');

      const fetchStoredImagePaths = async () => {
        try {
          const response = await fetch('/api/images/store/debug');
          if (response.ok) {
            const data = await response.json();
            const imagePaths = data.images.map(
              (img: any) => `/api/images/store/${img.id}`
            );
            setStoredImages(imagePaths);
            logger.debug(
              LogCategory.SYSTEM,
              'ImageGenPage',
              'Loaded gallery paths from API',
              { count: imagePaths.length }
            );
          } else {
            logger.warn(
              LogCategory.SYSTEM,
              'ImageGenPage',
              'Failed to fetch gallery IDs from API',
              { status: response.status }
            );
            setStoredImages([]);
          }
        } catch (error) {
          console.error('Failed to fetch stored images:', error);
          setStoredImages([]);
        } finally {
          setGalleryLoading(false);
        }
      };
      fetchStoredImagePaths();
    }

    // Check if there's an image to edit from the chat page
    if (typeof window !== 'undefined') {
      const editImageUrl = sessionStorage.getItem('editImageUrl');
      if (editImageUrl) {
        // Load the image
        const loadImageFromChat = async () => {
          try {
            setLoading(true);
            const imageData = await fetchImageDataFromUrl(editImageUrl);
            if (imageData) {
              setUploadedImage(imageData);
              sessionStorage.removeItem('editImageUrl'); // Clear the storage after using it
            }
          } catch (error) {
            console.error('Error loading image from chat:', error);
            setError('Failed to load the image from chat.');
          } finally {
            setLoading(false);
          }
        };

        loadImageFromChat();
      }
    }
  }, []);

  // Effect to scroll to gallery if requested
  useEffect(() => {
    if (scrollToGallery) {
      const galleryElement = document.getElementById('image-gallery');
      if (galleryElement) {
        galleryElement.scrollIntoView({ behavior: 'smooth' });
      }
      setScrollToGallery(false);
    }
  }, [scrollToGallery]);

  // Effect to check for image edit query param
  useEffect(() => {
    const checkForImageToEdit = async () => {
      if (editIdFromUrl) {
        try {
          setLoading(true);
          await handleGalleryImageSelect(editIdFromUrl);
        } catch (error) {
          console.error('Error selecting image from URL:', error);
          setError('Failed to load the requested image for editing.');
        } finally {
          setLoading(false);
        }
      }
    };

    checkForImageToEdit();
  }, [editIdFromUrl]);

  const handleImageSelect = (imageData: string) => {
    setUploadedImage(imageData);
    setGeneratedImage(null);
  };

  const handleGalleryImageSelect = async (imageId: string) => {
    try {
      const imageUrl = `/api/images/store/${imageId}`;
      const imageData = await fetchImageDataFromUrl(imageUrl);

      if (imageData) {
        setUploadedImage(imageData);
        setGeneratedImage(null);
        setDescription(null);

        // Update URL to reflect the edit state without refreshing the page
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.set('edit', imageId);
          window.history.pushState({}, '', url.toString());
        }

        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('Failed to load image data');
      }
    } catch (error) {
      console.error('Error selecting gallery image:', error);
      setError('Failed to load the selected image for editing.');
    }
  };

  const handlePromptSubmit = async (promptText: string) => {
    if (!promptText.trim() && !uploadedImage) {
      setError('Please provide a prompt or upload an image.');
      return;
    }

    if (!sessionId) {
      setError('Session not available. Please try reloading.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const userPromptItem: HistoryItem = {
      role: 'user',
      parts: [{ text: promptText }]
    };
    const optimisticHistory = [...historyItems, userPromptItem];
    setHistoryItems(optimisticHistory);

    try {
      const result = await generateImageAction(
        promptText,
        uploadedImage || undefined
      );

      if (result?.image) {
        setGeneratedImage(result.image);

        const newHistoryItem: HistoryItem = {
          role: 'model',
          parts: [{ image: result.image }]
        };
        const finalHistory = [...optimisticHistory, newHistoryItem];
        setHistoryItems(finalHistory);

        logger.debug(
          LogCategory.SYSTEM,
          'ImageGenPage',
          'History before saving via action:',
          { finalHistory }
        );

        // Save the complete history using Server Action
        await saveHistoryAction(sessionId, finalHistory);

        // --- Update Gallery Based on Environment ---
        const returnedImageUrl = result.image; // URL from action (Blob or local API path)

        if (returnedImageUrl.startsWith('http')) {
          // If it's a Blob URL ('hub')
          const currentUrls = JSON.parse(
            localStorage.getItem('galleryImageUrls') || '[]'
          );
          const updatedUrls = [...currentUrls, returnedImageUrl];
          localStorage.setItem('galleryImageUrls', JSON.stringify(updatedUrls));
          setStoredImages(updatedUrls); // Update state with the full list including the new URL
          logger.debug(
            LogCategory.SYSTEM,
            'ImageGenPage',
            'Updated localStorage gallery (hub)',
            { count: updatedUrls.length }
          );
        } else {
          // Local environment: returnedImageUrl is the relative path
          // Update state by adding the new path to the existing paths
          setStoredImages((prevPaths) => [...prevPaths, returnedImageUrl]);
          logger.debug(
            LogCategory.SYSTEM,
            'ImageGenPage',
            'Updated memory gallery (local)',
            { newPath: returnedImageUrl }
          );
          // No need to re-fetch, we already have the path
        }
        // ------------------------------------------
      } else {
        setHistoryItems(historyItems);
        setError('Image generation completed but returned no image.');
      }
    } catch (actionError) {
      setHistoryItems(historyItems);
      console.error('Error during image generation/saving:', actionError);
      const message =
        actionError instanceof Error
          ? actionError.message
          : 'Failed to generate/save history.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setGeneratedImage(null);
    setDescription(null);
    setLoading(false);
    setError(null);
    // Don't reset conversation history
  };

  // If we have a generated image, we want to edit it next time
  const currentImage = generatedImage || uploadedImage;
  const isEditing = !!currentImage;

  // Get the latest image to display (always the generated image)
  const displayImage = generatedImage;

  // Scroll to gallery button handler
  const handleScrollToGallery = () => {
    setScrollToGallery(true);
  };

  const handleRefreshGallery = async () => {
    setGalleryLoading(true);
    try {
      const response = await fetch('/api/images/store/debug');
      if (response.ok) {
        const data = await response.json();
        setStoredImages(data.images.map((img: any) => img.id));
      }
    } catch (error) {
      console.error('Failed to fetch stored images:', error);
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleClearHistory = useCallback(async () => {
    // Only proceed if in hub mode (button shouldn't be clickable otherwise, but double-check)
    if (!sessionId || process.env.NEXT_PUBLIC_DEPLOYMENT_ENV !== 'hub') return;

    try {
      // 1. Clear persistent KV history via Server Action
      await clearHistoryAction(sessionId);

      // 2. Clear local UI state for history AND gallery
      setHistoryItems([]);
      setStoredImages([]);
      setError(null);
      setGeneratedImage(null);
      setDescription(null);
      setLoading(false);

      // 3. Clear relevant localStorage items
      localStorage.removeItem('galleryImageUrls'); // Clear gallery URLs
      localStorage.removeItem('imageGenSessionId'); // Clear session ID
      setSessionId(null); // Also reset the session ID state

      logger.info(
        LogCategory.SYSTEM,
        'ImageGenPage',
        'Cleared history, gallery state, and local session ID'
      );
    } catch (err) {
      console.error('Failed to clear history via action:', err);
      setError('Could not clear the generation history.');
    }
  }, [sessionId]);

  return (
    <div className="container mx-auto py-12 relative">
      {/* 背景装饰 */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>
      
      <div className="mb-12 flex flex-col items-center text-center max-w-3xl mx-auto relative">
        {/* 装饰性图标 */}
        <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-xl border border-primary/30 shadow-lg shadow-primary/20">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary animate-pulse-glow"></div>
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mb-4">
          <span className="inline-block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
          Image Generation
          </span>
        </h1>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-primary/50 to-transparent"></div>
          <p className="text-muted-foreground/90 text-base sm:text-lg font-medium">
            Create and edit images with Gemini AI
        </p>
          <div className="h-px w-12 bg-gradient-to-l from-primary/50 to-transparent"></div>
        </div>
      </div>

      <div className="relative mb-16 max-w-4xl mx-auto">
        {/* 外层光晕 */}
        <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-2xl opacity-60"></div>
        
        {/* 主卡片 */}
        <div className="relative bg-card/50 backdrop-blur-xl border-2 border-border/30 rounded-3xl shadow-2xl overflow-hidden">
          {/* 顶部装饰线 */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          
          <div className="p-8 md:p-10 space-y-8">
            {error && (
              <div className="p-5 mb-4 text-sm rounded-2xl border-2 border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5 text-destructive font-medium shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/20">
                    <X className="h-4 w-4" />
                  </div>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {!displayImage && !loading ? (
              <>
                <div className="space-y-6">
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    currentImage={currentImage}
                  />
                  <div className="pt-4">
                    <ImagePromptInput
                      onSubmit={handlePromptSubmit}
                      isEditing={isEditing}
                      isLoading={loading}
                    />
                  </div>

                  {storedImages.length > 0 && (
                    <div className="pt-2 flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleScrollToGallery}
                        className="text-sm font-medium text-muted-foreground flex items-center gap-2 hover:text-primary transition-all duration-300 hover:bg-primary/5 rounded-xl px-4 py-2"
                      >
                        <span>Browse image gallery</span>
                        <ChevronUp className="h-4 w-4 rotate-180 transition-transform group-hover:translate-y-1" />
                      </Button>
                    </div>
                  )}
                </div>
              </>
            ) : loading ? (
              <div className="flex items-center justify-center h-96 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-2 border-border/30 relative overflow-hidden">
                {/* 动画背景 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                
                <div className="flex flex-col items-center gap-6 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative shadow-2xl">
                    <div className="absolute inset-0 rounded-2xl border-4 border-transparent border-t-primary animate-spin"></div>
                    <ImageIcon className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground mb-2">
                      Creating your image...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This may take a few moments
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <ImageResultDisplay
                  imageUrl={displayImage || ''}
                  description={description}
                  onReset={handleReset}
                  conversationHistory={historyItems}
                />
                <div className="relative mt-8 pt-8">
                  {/* 分隔线 */}
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>
                  
                  <ImagePromptInput
                    onSubmit={handlePromptSubmit}
                    isEditing={true}
                    isLoading={loading}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stored Images in the Global Store */}
      <div
        id="image-gallery"
        className="mt-20 scroll-mt-4 max-w-7xl mx-auto relative"
      >
        {/* 顶部分隔线 */}
        <div className="absolute -top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl shadow-lg">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Gallery
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-2 ml-1">
              <div className="h-px w-8 bg-gradient-to-r from-primary/50 to-transparent"></div>
              <p className="text-sm text-muted-foreground/80 font-medium">
              Browse and edit your images
            </p>
            </div>
          </div>
          <div className="flex gap-3">
            {process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === 'hub' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearHistory}
                      disabled={!sessionId || historyItems.length === 0}
                      className="border-2 border-destructive/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 shadow-lg text-sm font-semibold rounded-xl transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                      <Trash2 className="h-4 w-4 mr-2 relative z-10" />
                      <span className="relative z-10">Clear History</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Clear generation history and reset session
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshGallery}
              disabled={galleryLoading}
              className="border-2 border-primary/30 hover:bg-primary/10 hover:text-primary hover:border-primary/50 shadow-lg text-sm font-semibold rounded-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
              <span className="relative z-10">
              {galleryLoading ? 'Refreshing...' : 'Refresh Gallery'}
              </span>
            </Button>
          </div>
        </div>

        {galleryLoading ? (
          <ImageGallerySkeleton count={8} />
        ) : storedImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl border-2 border-dashed border-border/50 relative overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent_50%)]"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 shadow-xl">
                <ImageIcon className="w-10 h-10 text-primary" />
            </div>
              <p className="text-lg font-bold text-foreground mb-2">No images yet</p>
              <p className="text-sm text-muted-foreground max-w-md text-center">
              Create your first image with the tools above
            </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {storedImages.map((imageRef, index) => {
              // Determine type based on environment (for Edit button logic)
              const IS_HUB_CLIENT =
                process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === 'hub';
              // imageRef now always contains the correct src URL/path
              const imageUrl = imageRef;
              // Derive an ID for key and potentially Edit button (might need improvement)
              const imageId = IS_HUB_CLIENT
                ? imageUrl.split('/').pop()?.split('.')[0] || `blob-${index}`
                : imageUrl.split('/').pop() || `local-${index}`;

              return (
                <div
                  key={imageId}
                  className="overflow-hidden group relative rounded-2xl border-2 border-border/30 bg-gradient-to-br from-card/50 to-card hover:border-primary/50 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                    <img
                      src={imageUrl} // Always use imageUrl directly
                      alt={`Generated image ${imageId}`}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-5 z-20">
                      <div className="flex-1">
                        {/* Attempt timestamp extraction - might fail for Blob URLs initially */}
                        {imageId.startsWith('img_') && (
                          <p className="text-xs text-white/90 font-medium flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                              ></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {new Date(
                              parseInt(imageId.split('_')[1])
                            ).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric'
                            })}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2.5">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-10 w-10 rounded-xl bg-white/95 text-black hover:bg-white shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white/50"
                                // Edit button needs careful handling in hub mode
                                // We need the *local* API ID equivalent if possible,
                                // or adjust handleGalleryImageSelect to work with Blob URLs?
                                // For now, disable editing from gallery in hub mode?
                                onClick={() =>
                                  !IS_HUB_CLIENT &&
                                  handleGalleryImageSelect(imageId)
                                }
                                disabled={IS_HUB_CLIENT} // Disable edit from gallery in Hub mode for now
                              >
                                <PencilLine className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {IS_HUB_CLIENT
                                  ? 'Editing from gallery disabled in Hub mode'
                                  : 'Edit this image'}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={imageUrl} // Link directly to Blob URL or local API URL
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  'inline-flex items-center justify-center h-10 w-10 rounded-xl',
                                  'bg-white/95 text-black hover:bg-white shadow-xl transition-all duration-300 hover:scale-110',
                                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                                  'focus-visible:ring-ring border-2 border-white/50'
                                )}
                              >
                                <ImageIcon className="h-5 w-5" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View full size</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Main component that safely uses searchParams
export default function ImageGenerationPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 flex justify-center">
          <div className="animate-spin mr-2">
            <ImageIcon className="h-6 w-6 text-primary" />
          </div>
          <span>Loading image editor...</span>
        </div>
      }
    >
      <SearchParamsWrapper />
    </Suspense>
  );
}

// Separate component for handling searchParams to avoid hydration issues
function SearchParamsWrapper() {
  const searchParams = useSearchParams();
  const editIdFromUrl = searchParams?.get('edit');

  return <ImageGenerationWithParams editIdFromUrl={editIdFromUrl} />;
}
