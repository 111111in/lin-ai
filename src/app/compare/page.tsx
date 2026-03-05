'use client';

/**
 * LinAI - AI 模型对比工具
 *
 * 功能：
 * - 同时向多个 AI 模型发送相同问题
 * - 并行处理，实时显示响应
 * - 对比响应时间和质量
 * - 投票选择最佳答案
 *
 * @author LinAI Team
 */
import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Zap
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AI_MODELS } from '@/lib/constants';
import { sleep } from '@/lib/helpers';
import { cn } from '@/lib/utils';

/**
 * 模型响应数据结构
 */
interface ModelResponse {
  model: string;
  provider: string;
  response: string;
  responseTime: number;
  tokenCount: number;
  isLoading: boolean;
  error?: string;
  vote?: 'up' | 'down';
}

/**
 * 可用的 AI 模型列表
 */
const AVAILABLE_MODELS = [
  {
    id: AI_MODELS.GPT4.id,
    name: AI_MODELS.GPT4.name,
    provider: AI_MODELS.GPT4.provider,
    color: AI_MODELS.GPT4.color
  },
  {
    id: AI_MODELS.GPT35.id,
    name: AI_MODELS.GPT35.name,
    provider: AI_MODELS.GPT35.provider,
    color: AI_MODELS.GPT35.color
  },
  {
    id: AI_MODELS.CLAUDE.id,
    name: AI_MODELS.CLAUDE.name,
    provider: AI_MODELS.CLAUDE.provider,
    color: AI_MODELS.CLAUDE.color
  },
  {
    id: AI_MODELS.GEMINI.id,
    name: AI_MODELS.GEMINI.name,
    provider: AI_MODELS.GEMINI.provider,
    color: AI_MODELS.GEMINI.color
  }
];

/**
 * AI 模型对比页面组件
 */
export default function ComparePage() {
  const [prompt, setPrompt] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>([
    AI_MODELS.GPT4.id,
    AI_MODELS.CLAUDE.id
  ]);
  const [responses, setResponses] = useState<Record<string, ModelResponse>>({});
  const [isComparing, setIsComparing] = useState(false);

  /**
   * 切换模型选择状态
   */
  const toggleModel = (modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  };

  /**
   * 模拟 AI 模型响应
   * TODO: 替换为真实的 API 调用
   */
  const simulateResponse = async (modelId: string): Promise<ModelResponse> => {
    const model = AVAILABLE_MODELS.find((m) => m.id === modelId)!;

    // 模拟不同的响应时间
    const delay = Math.random() * 2000 + 1000; // 1-3秒
    await sleep(delay);

    // 模拟响应内容
    const mockResponses = [
      '这是一个很好的问题。让我详细解释一下...',
      '根据我的理解，这个问题可以从以下几个角度来看...',
      '我认为最佳的方法是...',
      '让我为你分析一下这个问题的关键点...'
    ];

    const randomResponse =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];

    return {
      model: model.name,
      provider: model.provider,
      response: `${randomResponse}\n\n这是一个模拟的响应，用于演示模型对比功能。在实际应用中，这里会显示真实的 AI 模型响应。`,
      responseTime: delay,
      tokenCount: Math.floor(Math.random() * 500) + 100,
      isLoading: false
    };
  };

  /**
   * 开始对比所有选中的模型
   */
  const handleCompare = async () => {
    if (!prompt.trim() || selectedModels.length === 0) return;

    setIsComparing(true);

    // 初始化所有模型的加载状态
    const initialResponses: Record<string, ModelResponse> = {};
    selectedModels.forEach((modelId) => {
      const model = AVAILABLE_MODELS.find((m) => m.id === modelId)!;
      initialResponses[modelId] = {
        model: model.name,
        provider: model.provider,
        response: '',
        responseTime: 0,
        tokenCount: 0,
        isLoading: true
      };
    });
    setResponses(initialResponses);

    // 并行请求所有模型
    const promises = selectedModels.map(async (modelId) => {
      try {
        const response = await simulateResponse(modelId);
        setResponses((prev) => ({
          ...prev,
          [modelId]: response
        }));
      } catch (error) {
        setResponses((prev) => ({
          ...prev,
          [modelId]: {
            ...prev[modelId],
            isLoading: false,
            error: '请求失败，请重试'
          }
        }));
      }
    });

    await Promise.all(promises);
    setIsComparing(false);
  };

  /**
   * 处理投票
   */
  const handleVote = (modelId: string, vote: 'up' | 'down') => {
    setResponses((prev) => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        vote: prev[modelId].vote === vote ? undefined : vote
      }
    }));
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
            AI 模型对比
          </span>
        </h1>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-primary/50 to-transparent"></div>
          <p className="text-muted-foreground/90 text-base sm:text-lg font-medium">
            同时测试多个 AI 模型，对比响应质量
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-primary/50 to-transparent"></div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 输入区域 */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-2xl opacity-60"></div>

          <div className="relative bg-card/50 backdrop-blur-xl border-2 border-border/30 rounded-3xl shadow-2xl overflow-hidden p-8">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

            {/* 模型选择 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  选择要对比的模型
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => toggleModel(model.id)}
                    className={cn(
                      'p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group',
                      selectedModels.includes(model.id)
                        ? 'border-primary/50 bg-gradient-to-br from-primary/10 to-secondary/5 shadow-lg'
                        : 'border-border/50 hover:border-primary/30 bg-card/50'
                    )}
                  >
                    {selectedModels.includes(model.id) && (
                      <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
                    )}
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl bg-gradient-to-br mb-3 mx-auto',
                        model.color
                      )}
                    ></div>
                    <h4 className="font-bold text-sm mb-1">{model.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {model.provider}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 提示词输入 */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  输入你的问题
                </span>
              </h3>
              <Textarea
                placeholder="例如：解释一下量子计算的基本原理..."
                className="min-h-[150px] rounded-2xl border-2 border-border/50 focus:border-primary/50 bg-card/50 backdrop-blur-xl shadow-lg resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button
                onClick={handleCompare}
                disabled={
                  !prompt.trim() || selectedModels.length === 0 || isComparing
                }
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 font-bold text-base relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                <ArrowRight className="h-6 w-6 mr-2 relative z-10" />
                <span className="relative z-10">
                  {isComparing ? '对比中...' : '开始对比'}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* 响应对比区域 */}
        {Object.keys(responses).length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedModels.map((modelId) => {
              const model = AVAILABLE_MODELS.find((m) => m.id === modelId)!;
              const response = responses[modelId];

              return (
                <div
                  key={modelId}
                  className="relative rounded-2xl border-2 border-border/30 bg-card/50 backdrop-blur-xl shadow-lg overflow-hidden"
                >
                  {/* 顶部装饰 */}
                  <div
                    className={cn('h-2 bg-gradient-to-r', model.color)}
                  ></div>

                  <div className="p-6">
                    {/* 模型信息 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl bg-gradient-to-br',
                            model.color
                          )}
                        ></div>
                        <div>
                          <h4 className="font-bold">{model.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {model.provider}
                          </p>
                        </div>
                      </div>

                      {!response?.isLoading && response?.responseTime && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {(response.responseTime / 1000).toFixed(2)}s
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 响应内容 */}
                    <div className="min-h-[200px]">
                      {response?.isLoading ? (
                        <div className="flex flex-col items-center justify-center h-[200px]">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative mb-4">
                            <div className="absolute inset-0 rounded-xl border-4 border-transparent border-t-primary animate-spin"></div>
                            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            生成中...
                          </p>
                        </div>
                      ) : response?.error ? (
                        <div className="flex items-center justify-center h-[200px] text-destructive">
                          <p>{response.error}</p>
                        </div>
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {response?.response}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 底部信息和投票 */}
                    {!response?.isLoading && !response?.error && (
                      <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {response?.tokenCount} tokens
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(modelId, 'up')}
                            className={cn(
                              'rounded-xl',
                              response?.vote === 'up' &&
                                'text-green-500 bg-green-500/10'
                            )}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(modelId, 'down')}
                            className={cn(
                              'rounded-xl',
                              response?.vote === 'down' &&
                                'text-red-500 bg-red-500/10'
                            )}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
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
