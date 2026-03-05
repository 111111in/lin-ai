'use client';

/**
 * LinAI - 对话历史管理页面
 * 
 * 功能：
 * - 展示所有历史对话
 * - 搜索和过滤对话
 * - 管理收藏和标签
 * - 导出对话数据
 * 
 * @author LinAI Team
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Download,
  MessageSquare,
  Search,
  Star,
  Tag,
  Trash2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { formatDate, generateId } from '@/lib/helpers';
import { cn } from '@/lib/utils';

/**
 * 对话历史数据结构
 */
interface ConversationHistory {
  id: string;
  title: string;
  agentName: string;
  timestamp: number;
  messageCount: number;
  isFavorite: boolean;
  tags: string[];
  preview: string;
}

/**
 * 对话历史管理页面组件
 */
export default function HistoryPage() {
  const [conversations, setConversations] = useState<ConversationHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'messages'>('date');
  const [loading, setLoading] = useState(true);

  /**
   * 加载历史对话数据
   * TODO: 替换为真实的 API 调用
   */
  useEffect(() => {
    const loadConversations = async () => {
      // 模拟 API 延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 模拟数据
      const mockData: ConversationHistory[] = [
        {
          id: generateId('conv'),
          title: 'Python 编程问题',
          agentName: 'Code Assistant',
          timestamp: Date.now() - 3600000,
          messageCount: 12,
          isFavorite: true,
          tags: ['编程', 'Python'],
          preview: '如何使用 Python 实现快速排序算法...'
        },
        {
          id: generateId('conv'),
          title: '项目架构设计',
          agentName: 'Architecture Expert',
          timestamp: Date.now() - 7200000,
          messageCount: 8,
          isFavorite: false,
          tags: ['架构', '设计'],
          preview: '讨论微服务架构的最佳实践...'
        },
        {
          id: generateId('conv'),
          title: 'React 性能优化',
          agentName: 'Frontend Guru',
          timestamp: Date.now() - 86400000,
          messageCount: 15,
          isFavorite: true,
          tags: ['React', '性能'],
          preview: 'React 应用的性能优化技巧...'
        }
      ];

      setConversations(mockData);
      setLoading(false);
    };

    loadConversations();
  }, []);

  /**
   * 过滤和排序对话列表
   */
  const filteredConversations = conversations
    .filter((conv) => {
      // 搜索过滤
      const matchesSearch =
        conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.preview.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 标签过滤
      const matchesTag =
        filterTag === 'all' ||
        filterTag === 'favorites'
          ? filterTag === 'favorites'
            ? conv.isFavorite
            : true
          : conv.tags.includes(filterTag);
      
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      // 排序
      if (sortBy === 'date') {
        return b.timestamp - a.timestamp;
      }
      return b.messageCount - a.messageCount;
    });

  /**
   * 获取所有唯一标签
   */
  const allTags = Array.from(
    new Set(conversations.flatMap((conv) => conv.tags))
  );

  /**
   * 切换收藏状态
   */
  const toggleFavorite = (id: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id ? { ...conv, isFavorite: !conv.isFavorite } : conv
      )
    );
  };

  /**
   * 删除对话
   */
  const deleteConversation = (id: string) => {
    if (confirm('确定要删除这个对话吗？')) {
      setConversations((prev) => prev.filter((conv) => conv.id !== id));
    }
  };

  /**
   * 导出对话为 JSON 文件
   */
  const exportConversation = (conv: ConversationHistory) => {
    const dataStr = JSON.stringify(conv, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${conv.title.replace(/\s+/g, '-')}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-12 relative">
      {/* 背景装饰 */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>

      {/* 页面标题 */}
      <div className="mb-12 flex flex-col items-center text-center max-w-3xl mx-auto relative">
        <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-xl border border-primary/30 shadow-lg shadow-primary/20">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary animate-pulse-glow"></div>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mb-4">
          <span className="inline-block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
            对话历史
          </span>
        </h1>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-primary/50 to-transparent"></div>
          <p className="text-muted-foreground/90 text-base sm:text-lg font-medium">
            管理和搜索你的所有 AI 对话
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-primary/50 to-transparent"></div>
        </div>
      </div>

      {/* 搜索和过滤栏 */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-2xl opacity-60"></div>

          <div className="relative bg-card/50 backdrop-blur-xl border-2 border-border/30 rounded-3xl shadow-2xl overflow-hidden p-6">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 搜索框 */}
              <div className="relative group md:col-span-2">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-primary transition-colors duration-300 z-10" />
                <Input
                  type="search"
                  placeholder="搜索对话..."
                  className="pl-12 h-12 rounded-xl border-2 border-border/50 focus:border-primary/50 bg-card/50 backdrop-blur-xl shadow-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* 标签过滤 */}
              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger className="h-12 rounded-xl border-2 border-border/50 bg-card/50 backdrop-blur-xl shadow-lg">
                  <SelectValue placeholder="选择标签" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有标签</SelectItem>
                  <SelectItem value="favorites">收藏</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 排序选项 */}
            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm font-medium text-muted-foreground">
                排序:
              </span>
              <div className="flex gap-2">
                <Button
                  variant={sortBy === 'date' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('date')}
                  className="rounded-xl"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  日期
                </Button>
                <Button
                  variant={sortBy === 'messages' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('messages')}
                  className="rounded-xl"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  消息数
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 对话列表 */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative shadow-2xl">
              <div className="absolute inset-0 rounded-2xl border-4 border-transparent border-t-primary animate-spin"></div>
              <MessageSquare className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl border-2 border-dashed border-border/50">
            <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-bold text-foreground mb-2">
              没有找到对话
            </p>
            <p className="text-sm text-muted-foreground">
              尝试调整搜索条件或开始新的对话
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className="group relative rounded-2xl border-2 border-border/30 bg-card/50 hover:border-primary/50 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden"
              >
                {/* 顶部装饰线 */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* 左侧内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-foreground truncate">
                          {conv.title}
                        </h3>
                        {conv.isFavorite && (
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {conv.preview}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>{conv.messageCount} 条消息</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(conv.timestamp, 'long')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{conv.agentName}</span>
                        </div>
                      </div>

                      {/* 标签 */}
                      {conv.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {conv.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/30"
                            >
                              <Tag className="h-3 w-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 右侧操作按钮 */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(conv.id)}
                        className={cn(
                          'rounded-xl transition-all duration-300',
                          conv.isFavorite
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-muted-foreground hover:text-yellow-500'
                        )}
                      >
                        <Star
                          className={cn(
                            'h-5 w-5',
                            conv.isFavorite && 'fill-yellow-500'
                          )}
                        />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => exportConversation(conv)}
                        className="rounded-xl text-muted-foreground hover:text-primary"
                      >
                        <Download className="h-5 w-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteConversation(conv.id)}
                        className="rounded-xl text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* 查看详情按钮 */}
                  <Link href={`/agents?conversation=${conv.id}`}>
                    <Button className="w-full mt-4 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 font-bold">
                      查看完整对话
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

