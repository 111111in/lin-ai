import { memo } from 'react';

import { useLanguage } from '@/components/providers/language-provider';
import { type AgentTemplate } from '@/lib/store/types';
import { AgentCard } from './AgentCard';

interface AgentGridProps {
  templates: AgentTemplate[];
  searchTerm: string;
  onChat: (agentId: string) => void;
  onSettings: (agentId: string) => void;
  onGithub?: (agentId: string) => void;
  currentCategory?: string;
  categoryName?: string;
  isLoading?: boolean;
}

/**
 * Grid layout for agent cards with skeleton loading support
 * Memoized to prevent unnecessary re-renders
 */
export const AgentGrid = memo(function AgentGrid({
  templates,
  searchTerm,
  onChat,
  onSettings,
  onGithub,
  currentCategory,
  categoryName,
  isLoading = false
}: AgentGridProps) {
  const { t } = useLanguage();

  if (templates.length === 0 && !isLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block p-6 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50 mb-4">
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('agents.empty.title')}
          </h3>
          <p className="text-muted-foreground text-lg">
            {searchTerm
              ? t('agents.empty.withSearch')
                  .replace('{search}', searchTerm)
                  .replace(
                    '{category}',
                    categoryName ? ` in ${categoryName}` : ''
                  )
              : t('agents.empty.noSearch').replace(
                  '{category}',
                  categoryName ? ` ${categoryName}` : ''
                )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
      {templates.map((template, index) => (
        <AgentCard
          key={template.agentId}
          template={template}
          index={index}
          onChat={onChat}
          onSettings={onSettings}
          onGithub={onGithub}
          currentCategory={currentCategory}
        />
      ))}
    </div>
  );
});
