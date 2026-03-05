'use client';

import { useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ImagePromptInputProps {
  onSubmit: (prompt: string) => void;
  isEditing: boolean;
  isLoading: boolean;
}

export function ImagePromptInput({
  onSubmit,
  isEditing,
  isLoading
}: ImagePromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
      // Don't clear prompt for editing workflows
      if (!isEditing) {
        setPrompt('');
      }
    }
  };

  // Example prompts for simpler concepts that work better
  const getPlaceholder = () => {
    if (isEditing) {
      return 'Example: Change the background to a beach scene and add a sunset...';
    } else {
      return 'Example: A cartoon tiger wearing sunglasses on a tropical beach...';
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl shadow-lg">
            {isEditing ? (
              <Wand2 className="h-5 w-5 text-primary" />
            ) : (
              <Sparkles className="h-5 w-5 text-primary" />
            )}
          </div>
          <label
            htmlFor="prompt"
            className="block text-lg font-bold"
          >
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {isEditing
                ? 'Edit your image'
                : 'Describe what you want to generate'}
            </span>
          </label>
        </div>

        <div className="relative">
          <Textarea
            id="prompt"
            className={cn(
              'min-h-[140px] resize-none transition-all p-5 pr-10',
              'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
              'border-2 border-border/50 focus-visible:border-primary/50',
              'bg-gradient-to-b from-card/80 to-card/50 backdrop-blur-sm',
              'placeholder:text-muted-foreground/70 rounded-2xl shadow-lg',
              'font-medium text-base'
            )}
            placeholder={getPlaceholder()}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30 shadow-lg">
              {prompt.length} chars
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className={cn(
            'w-full gap-3 transition-all h-14 rounded-2xl relative overflow-hidden group',
            'bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90',
            'font-bold text-white shadow-xl text-base',
            'border-0',
            isLoading && 'animate-pulse'
          )}
        >
          {/* 悬停光效 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

          {isLoading ? (
            <>
              <div className="h-6 w-6 animate-spin rounded-full border-3 border-background border-t-transparent relative z-10" />
              <span className="relative z-10">Processing your request...</span>
            </>
          ) : (
            <>
              {isEditing ? (
                <Wand2 className="h-6 w-6 relative z-10 group-hover:rotate-12 transition-transform" />
              ) : (
                <Sparkles className="h-6 w-6 relative z-10 group-hover:scale-110 transition-transform" />
              )}
              <span className="relative z-10">
                {isEditing ? 'Edit Image' : 'Generate Image'}
              </span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
