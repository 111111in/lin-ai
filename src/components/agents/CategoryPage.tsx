'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { AgentError } from '@/components/agents/AgentError';
import { AgentGrid } from '@/components/agents/AgentGrid';
import { AgentHeader } from '@/components/agents/AgentHeader';
import { AgentLoading } from '@/components/agents/AgentLoading';
import { ApiKeyDialog } from '@/components/api-key-dialog';
import { useLanguage } from '@/components/providers/language-provider';
import { useAgentFiltering } from '@/lib/hooks/useAgentFiltering';
import { useAgentNavigation } from '@/lib/hooks/useAgentNavigation';
import { useAgents } from '@/lib/store';
import type { AgentTemplate } from '@/lib/store/types';

interface CategoryPageProps {
  category: string;
  categoryName: string;
  templates: AgentTemplate[];
}

export function CategoryPage({
  category,
  categoryName,
  templates
}: CategoryPageProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const { isInitialized, templatesValidated, templatesError } = useAgents();

  // Resolve the display name for the current category using i18n.
  // - 'all' 和 'featured' 使用已有的导航文案 key
  // - 其他分类使用 nav.category.{id}
  const displayCategoryName =
    category === 'all'
      ? t('nav.agents.all')
      : category === 'featured'
        ? t('nav.agents.featured')
        : t(`nav.category.${categoryName}`);

  // Local filtering/sorting (client-side)
  const { searchTerm, setSearchTerm, sortedTemplates } = useAgentFiltering({
    allTemplates: templates,
    category
  });

  // Navigation helpers
  const { handleChat } = useAgentNavigation();

  // Handler for removing category filter (redirects to main agents page)
  const handleRemoveCategory = () => {
    router.push('/agents');
  };

  // Handle opening API key dialog for an agent
  const handleConfigure = (agentId: string) => {
    setSelectedAgentId(agentId);
    setConfigDialogOpen(true);
  };

  // Handle GitHub button click - open repository in new tab
  const handleGithub = (agentId: string) => {
    // For now, just open a dummy URL - this will be replaced with the actual URL structure
    window.open(
      `https://github.com/agentdock/agentdock/tree/main/agents/${agentId}`,
      '_blank'
    );
  };

  // Show loading state
  if (!isInitialized || !templatesValidated) {
    return <AgentLoading />;
  }

  // Show error state
  if (templatesError) {
    return <AgentError error={templatesError} />;
  }

  return (
    <div className="container py-6 space-y-6 md:py-10">
      <AgentHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryConfig={{
          id: category,
          name: displayCategoryName
        }}
        onRemoveCategory={handleRemoveCategory}
        isAllAgents={false}
      />

      <AgentGrid
        templates={sortedTemplates}
        searchTerm={searchTerm}
        onChat={handleChat}
        onSettings={handleConfigure}
        onGithub={handleGithub}
        currentCategory={category}
        categoryName={displayCategoryName}
      />

      {/* API Key dialog */}
      {selectedAgentId && (
        <ApiKeyDialog
          agentId={selectedAgentId}
          open={configDialogOpen}
          onOpenChange={setConfigDialogOpen}
        />
      )}
    </div>
  );
}
