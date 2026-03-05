import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, Github, MessageSquare, Settings } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { AGENT_TAGS } from '@/config/agent-tags';
import type { AgentTemplate } from '@/lib/store/types';
import { cn, getLLMInfo } from '@/lib/utils';
import { allTools } from '@/nodes/registry';

interface AgentCardProps {
  template: AgentTemplate;
  index: number;
  onChat: (agentId: string) => void;
  onSettings: (agentId: string) => void;
  onGithub?: (agentId: string) => void;
  currentCategory?: string;
}

export function AgentCard({
  template,
  index,
  onChat,
  onSettings,
  onGithub,
  currentCategory
}: AgentCardProps) {
  return (
    <motion.div
      key={template.agentId}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 80
      }}
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      className="h-full"
    >
      <Card className="flex flex-col h-full overflow-hidden group relative border-0 rounded-3xl bg-gradient-to-br from-card/90 via-card/80 to-card/70 backdrop-blur-2xl shadow-2xl hover:shadow-[0_0_50px_rgba(0,255,255,0.3)] transition-all duration-500">
        {/* 炫酷的边框光效 */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl -z-10"></div>
        <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-2xl z-0"></div>
        
        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <CardHeader className="relative pb-4 z-10 space-y-3">
          {/* 动态渐变背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/8 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-t-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,255,0.15),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="flex items-start justify-between relative gap-3">
            <div className="space-y-2 flex-1 min-w-0">
              <CardTitle className="flex items-center gap-2.5">
                <motion.div 
                  className="relative p-2.5 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-xl shadow-lg group-hover:shadow-xl group-hover:shadow-primary/50 transition-all duration-500"
                  whileHover={{ rotate: [0, -15, 15, -15, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* 图标发光效果 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <Bot className="h-5 w-5 text-white relative z-10" />
                </motion.div>
                <span className="text-base font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text group-hover:from-primary group-hover:via-secondary group-hover:to-accent transition-all duration-500 truncate">
                  {template.name}
                </span>
              </CardTitle>
              <CardDescription className="text-muted-foreground/90 text-xs leading-relaxed line-clamp-2">
                {template.description}
              </CardDescription>
            </div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 8 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="flex-shrink-0"
            >
              <Badge
                variant="secondary"
                className="px-2.5 py-1 h-auto bg-gradient-to-r from-success/25 to-success/15 text-success border border-success/40 rounded-full font-bold text-[10px] shadow-lg shadow-success/20 backdrop-blur-sm whitespace-nowrap"
              >
                ✓ Ready
              </Badge>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pt-0 relative z-10">
          <div className="space-y-3">
            {/* Model 信息卡片 - 玻璃态效果 */}
            <motion.div 
              className="relative overflow-hidden rounded-xl p-3 backdrop-blur-md bg-gradient-to-br from-muted/40 via-muted/30 to-transparent border border-border/50 group-hover:border-primary/30 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-[10px] font-semibold text-primary/80 uppercase tracking-wider mb-0.5">Model</div>
                <div className="text-xs text-foreground font-bold">
                  {getLLMInfo(template).displayName}
                </div>
              </div>
            </motion.div>

            {/* Display tags */}
            {template.tags && template.tags.length > 0 && (
              <div className="pt-0.5">
                <div className="text-[10px] font-semibold text-foreground/70 uppercase tracking-wider mb-2">Categories</div>
                <div className="flex flex-wrap gap-1.5">
                  {AGENT_TAGS.filter((tag) => template.tags?.includes(tag.id))
                    .filter((tag) => tag.id !== 'featured')
                    .sort((a, b) => a.order - b.order)
                    .map((tag, idx) => (
                      <Link
                        href={`/agents/${tag.id}`}
                        key={tag.id}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.05, y: -1 }}
                        >
                          <Badge
                            variant="secondary"
                            className={cn(
                              'bg-gradient-to-r from-secondary/15 to-secondary/10 hover:from-secondary/25 hover:to-secondary/20 cursor-pointer text-[10px] px-2 py-0.5 rounded-lg border border-secondary/30 font-medium shadow-sm backdrop-blur-sm transition-all duration-300',
                              currentCategory === tag.id &&
                                'from-primary/20 to-primary/15 hover:from-primary/30 hover:to-primary/25 text-primary border-primary/40 shadow-primary/20'
                            )}
                          >
                            {tag.name}
                          </Badge>
                        </motion.div>
                      </Link>
                    ))}
                  {template.tags
                    .filter(
                      (tag: string) => !AGENT_TAGS.some((t) => t.id === tag)
                    )
                    .map((tag: string, idx) => (
                      <Link
                        href={`/agents/${tag}`}
                        key={tag}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.05, y: -1 }}
                        >
                          <Badge
                            variant="secondary"
                            className={cn(
                              'bg-gradient-to-r from-secondary/15 to-secondary/10 hover:from-secondary/25 hover:to-secondary/20 cursor-pointer text-[10px] px-2 py-0.5 rounded-lg border border-secondary/30 font-medium shadow-sm backdrop-blur-sm transition-all duration-300',
                              currentCategory === tag &&
                                'from-primary/20 to-primary/15 hover:from-primary/30 hover:to-primary/25 text-primary border-primary/40 shadow-primary/20'
                            )}
                          >
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                          </Badge>
                        </motion.div>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {template.nodes && template.nodes.length > 0 && (
              <>
                {template.nodes.some((node) => node in allTools) && (
                  <div className="pt-0.5">
                    <div className="text-[10px] font-semibold text-foreground/70 uppercase tracking-wider mb-2">Tools</div>
                    <div className="flex flex-wrap gap-1.5">
                      {template.nodes
                        .filter((node: string) => node in allTools)
                        .map((node: string, idx) => (
                          <motion.div
                            key={node}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Badge
                              variant="outline"
                              className="bg-gradient-to-r from-accent/10 to-accent/5 text-[10px] px-2 py-0.5 rounded-lg border-accent/30 text-accent font-medium hover:from-accent/20 hover:to-accent/10 hover:border-accent/50 transition-all duration-300 shadow-sm backdrop-blur-sm"
                            >
                              {node}
                            </Badge>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2.5 pt-4 relative z-10">
          <motion.div 
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => onChat(template.agentId)}
              className="w-full h-10 rounded-xl bg-gradient-to-r from-primary via-primary to-secondary hover:from-primary/90 hover:via-primary/90 hover:to-secondary/90 text-white font-bold shadow-lg hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 border-0 text-sm"
              variant="default"
            >
              <MessageSquare className="h-4 w-4 mr-1.5" />
              Chat
            </Button>
          </motion.div>

          <div className="flex gap-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => onSettings(template.agentId)}
                className="h-10 w-10 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 shadow-md"
                variant="outline"
                size="sm"
              >
                <Settings className="h-4 w-4 text-foreground/70 group-hover:text-primary transition-colors" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => onGithub && onGithub(template.agentId)}
                className="h-10 w-10 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-secondary/50 hover:bg-secondary/10 transition-all duration-300 shadow-md"
                variant="outline"
                size="sm"
                disabled={!onGithub}
              >
                <Github className="h-4 w-4 text-foreground/70 group-hover:text-secondary transition-colors" />
              </Button>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
