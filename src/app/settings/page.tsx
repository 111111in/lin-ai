'use client';

import { ErrorInfo, useCallback, useEffect, useMemo, useState } from 'react';
import { LLMProvider, LogCategory, logger } from 'agentdock-core';
import { AlertCircle, KeyRound, Save } from 'lucide-react';
import { toast } from 'sonner';

import { SecureStorage } from 'agentdock-core/storage/secure-storage';

import { ErrorBoundary } from '@/components/error-boundary';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FontFamily } from '@/lib/fonts';
import { ModelService } from '@/lib/services/model-service';
import { CoreSettings } from './core-settings';
import { DebugPanel } from './debug-panel';
import { FontSettings } from './font-settings';
// Import components
import { ModelDisplay } from './model-display';
// Import types
import { ApiKeyProvider, DEFAULT_SETTINGS, GlobalSettings } from './types';

// Create a single instance for settings
const storage = SecureStorage.getInstance('agentdock');

// Memoize API key providers to prevent recreation on each render
const API_KEY_PROVIDERS: ApiKeyProvider[] = [
  {
    key: 'openai',
    label: 'OpenAI 接口密钥',
    icon: KeyRound,
    description: '用于调用 OpenAI 模型（如 GPT‑4、GPT‑3.5 等）'
  },
  {
    key: 'anthropic',
    label: 'Anthropic 接口密钥',
    icon: KeyRound,
    description: '用于调用 Anthropic Claude 系列模型'
  },
  {
    key: 'cerebras',
    label: 'Cerebras 接口密钥',
    icon: KeyRound,
    description: '用于调用 Cerebras 托管的 LLaMA 3.3、Qwen 3 等模型'
  },
  {
    key: 'gemini',
    label: 'Google Gemini 接口密钥',
    icon: KeyRound,
    description: '用于调用 Google Gemini 系列模型'
  },
  {
    key: 'deepseek',
    label: 'DeepSeek 接口密钥',
    icon: KeyRound,
    description: '用于调用 DeepSeek‑V3、DeepSeek‑R1 等模型'
  },
  {
    key: 'groq',
    label: 'Groq 接口密钥',
    icon: KeyRound,
    description: '用于调用 Groq 平台上的 Llama 3、Mixtral 等模型'
  }
];

function SettingsPage() {
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelsRefreshTrigger, setModelsRefreshTrigger] = useState(0);
  const { t } = useLanguage();

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setInitialLoading(true);
        const storedSettings =
          await storage.get<GlobalSettings>('global_settings');
        if (storedSettings) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...storedSettings
          });

          // If we have API keys, trigger a refresh of the models
          if (
            storedSettings.apiKeys?.anthropic ||
            storedSettings.apiKeys?.openai
          ) {
            // Trigger a refresh of the models immediately
            setModelsRefreshTrigger((prev) => prev + 1);
          }
        }
      } catch (error) {
        logger.error(LogCategory.LLM, '[Settings]', 'Error loading settings:', {
          error
        });
        setError('加载设置失败');
      } finally {
        setInitialLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Centralized function to handle API key validation, saving, and model refresh
  const handleApiKeyValidationAndSave = useCallback(
    async (
      provider: keyof GlobalSettings['apiKeys'],
      value: string,
      shouldSave: boolean = true
    ) => {
      try {
        setLoading(true);
        setError(null);

        // Skip validation if empty
        if (!value) {
          if (shouldSave) {
            // Update settings with empty value
            const updatedSettings = {
              ...settings,
              apiKeys: {
                ...settings.apiKeys,
                [provider]: ''
              }
            };

            // Save settings
            await storage.set('global_settings', updatedSettings);
            setSettings(updatedSettings);
            toast.success('设置已保存');
          }
          return;
        }

        // Validate the API key
        const isValid = await ModelService.validateApiKey(
          provider as LLMProvider,
          value
        );

        if (isValid) {
          // Update settings with valid key
          const updatedSettings = {
            ...settings,
            apiKeys: {
              ...settings.apiKeys,
              [provider]: value
            }
          };

          // Save settings if requested
          if (shouldSave) {
            await storage.set('global_settings', updatedSettings);
            toast.success('API Key 有效，设置已自动保存');
          }

          // Update state
          setSettings(updatedSettings);

          // Trigger model refresh AFTER settings are updated and saved
          setModelsRefreshTrigger((prev) => prev + 1);
        } else {
          toast.error('API Key 无效');
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : '处理 API Key 时出错';
        logger.error(LogCategory.LLM, '[Settings]', message, { error });
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [settings]
  );

  // Handle API key changes
  const handleApiKeyChange = useCallback(
    (provider: keyof GlobalSettings['apiKeys'], value: string) => {
      // Just update the state immediately for responsive UI
      setSettings((prev) => ({
        ...prev,
        apiKeys: {
          ...prev.apiKeys,
          [provider]: value
        }
      }));
    },
    []
  );

  // Handle API key validation and save when blur or Enter key
  const handleApiKeyValidate = useCallback(
    (provider: keyof GlobalSettings['apiKeys'], value: string) => {
      handleApiKeyValidationAndSave(provider, value, true);
    },
    [handleApiKeyValidationAndSave]
  );

  // Handle save with validation for all settings
  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate any API keys that have values before saving
      const apiKeyPromises = Object.entries(settings.apiKeys)
        .filter(([_, value]) => value) // Only validate non-empty keys
        .map(async ([key, value]) => {
          const provider = key as keyof GlobalSettings['apiKeys'];
          const isValid = await ModelService.validateApiKey(
            provider as LLMProvider,
            value
          );
          return { provider, value, isValid };
        });

      const results = await Promise.all(apiKeyPromises);
      const invalidKeys = results.filter((result) => !result.isValid);

      if (invalidKeys.length > 0) {
        toast.error('存在无效的 API Key，请检查后重试');
        return;
      }

      // All keys are valid or empty, save settings
      await storage.set('global_settings', settings);
      toast.success('设置已保存');

      // Refresh models after save
      setModelsRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : '保存设置失败';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [settings]);

  // Handle BYOK only mode toggle
  const handleByokOnlyChange = useCallback((checked: boolean) => {
    // Update the state
    setSettings((prev) => ({
      ...prev,
      core: {
        ...prev.core,
        byokOnly: checked
      }
    }));
    setError(null);

    // Store BYOK setting in localStorage ONLY
    try {
      localStorage.setItem('byokOnly', checked ? 'true' : 'false');
    } catch (error) {
      console.warn('Failed to save BYOK setting to localStorage', error);
    }

    // Show appropriate toast message
    if (checked) {
      toast.info(
        'BYOK Mode enabled - Only user-provided API keys will be used'
      );
    } else {
      toast.info(
        'BYOK Mode disabled - System will fall back to environment variables if needed'
      );
    }
  }, []);

  // Handle debug mode toggle
  const handleDebugModeChange = useCallback((checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      core: {
        ...prev.core,
        debugMode: checked
      }
    }));
  }, []);

  // Trigger model refresh
  const handleRefreshTrigger = useCallback(() => {
    setModelsRefreshTrigger((prev) => prev + 1);
  }, []);

  // Handle font settings changes
  const handlePrimaryFontChange = useCallback(
    async (value: FontFamily) => {
      try {
        setLoading(true);
        setError(null);

        const updatedSettings = {
          ...settings,
          fonts: {
            ...settings.fonts,
            primary: value
          }
        };

        await storage.set('global_settings', updatedSettings);
        setSettings(updatedSettings);
        toast.success('Font settings saved. Reload the page to see changes.');
      } catch (error) {
        logger.error(
          LogCategory.SYSTEM,
          '[Settings]',
          'Error saving font settings:',
          { error }
        );
        setError('Failed to save font settings');
      } finally {
        setLoading(false);
      }
    },
    [settings]
  );

  const handleMonoFontChange = useCallback(
    async (value: string) => {
      try {
        setLoading(true);
        setError(null);

        const updatedSettings = {
          ...settings,
          fonts: {
            ...settings.fonts,
            mono: value
          }
        };

        await storage.set('global_settings', updatedSettings);
        setSettings(updatedSettings);
        toast.success('Font settings saved. Reload the page to see changes.');
      } catch (error) {
        logger.error(
          LogCategory.SYSTEM,
          '[Settings]',
          'Error saving font settings:',
          { error }
        );
        setError('Failed to save font settings');
      } finally {
        setLoading(false);
      }
    },
    [settings]
  );

  // Memoize loading skeleton component
  const LoadingSkeleton = useMemo(
    () => (
      <div className="grid gap-6">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    ),
    []
  );

  if (initialLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        {LoadingSkeleton}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="relative min-h-screen">
        {/* CHIRP 风格动态背景 */}
        <div className="fixed inset-0 -z-10">
          {/* 主渐变背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-secondary/10"></div>

          {/* 动态渐变光斑 */}
          <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-br from-primary/30 via-primary/20 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-float"></div>
          <div
            className="absolute top-1/3 -right-40 w-[700px] h-[700px] bg-gradient-to-br from-secondary/30 via-secondary/20 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-float"
            style={{ animationDelay: '2s', animationDuration: '7s' }}
          ></div>
          <div
            className="absolute bottom-0 left-1/4 w-[750px] h-[750px] bg-gradient-to-br from-accent/30 via-accent/20 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-float"
            style={{ animationDelay: '4s', animationDuration: '6s' }}
          ></div>

          {/* 细微网格背景 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          {/* 顶部和底部渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
        </div>

        <div className="container relative py-12 space-y-8 md:py-16">
          {/* 标题区域 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                  {t('settings.title')}
                </span>
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-primary/50 to-transparent"></div>
                <p className="text-muted-foreground/90 text-base sm:text-lg font-medium">
                  {t('settings.subtitle')}
                </p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary via-primary to-secondary hover:from-primary/90 hover:via-primary/90 hover:to-secondary/90 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 border-0"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{t('settings.saving')}</span>
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  {t('settings.save')}
                </>
              )}
            </Button>
          </div>

          {/* 分隔线 */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8"></div>

          {error && (
            <Card className="mb-6 border-destructive/50 bg-destructive/10 backdrop-blur-xl rounded-2xl shadow-xl">
              <CardContent className="flex items-start gap-4 pt-6">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div className="space-y-1">
                  <p className="font-medium leading-none text-destructive">
                    {t('settings.error.title')}
                  </p>
                  <p className="text-sm text-destructive/80">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Core Settings and Font Settings */}
          <div className="grid gap-6 md:grid-cols-2">
            <CoreSettings
              settings={settings}
              onByokChange={handleByokOnlyChange}
              onDebugModeChange={handleDebugModeChange}
            />

            <FontSettings
              settings={settings}
              onPrimaryFontChange={handlePrimaryFontChange}
              onMonoFontChange={handleMonoFontChange}
            />
          </div>

          {/* API Keys */}
          <div className="space-y-4">
            <Card className="shadow-2xl border-0 rounded-3xl bg-card/80 backdrop-blur-xl relative overflow-hidden">
              {/* 卡片装饰 */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>

              <div className="p-8 space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl">
                    <KeyRound className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">API 密钥</h3>
                </div>
                <p className="text-sm text-muted-foreground/90">
                  为各家语言模型和相关服务配置访问密钥
                </p>

                <div className="grid gap-6">
                  {API_KEY_PROVIDERS.map(
                    ({ key, label, icon: Icon, description }) => (
                      <div
                        key={key.toString()}
                        className="grid gap-3 p-4 rounded-2xl bg-muted/20 border border-border/50 hover:border-primary/30 transition-all duration-300"
                      >
                        <Label
                          htmlFor={key.toString()}
                          className="flex items-center gap-2 font-semibold"
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          {label}
                        </Label>
                        <div className="relative">
                          <Input
                            id={key.toString()}
                            type="password"
                            placeholder="请输入对应服务的 API 密钥"
                            value={settings.apiKeys[key]}
                            onChange={(e) =>
                              handleApiKeyChange(key, e.target.value)
                            }
                            onBlur={(e) =>
                              handleApiKeyValidate(key, e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleApiKeyValidate(
                                  key,
                                  (e.target as HTMLInputElement).value
                                );
                              }
                            }}
                            className="pr-20"
                          />
                          {settings.apiKeys[key] && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1 h-7 hover:bg-destructive/20 hover:text-destructive"
                              onClick={() => handleApiKeyValidate(key, '')}
                            >
                              清空
                            </Button>
                          )}
                        </div>
                        {description && (
                          <p className="text-xs text-muted-foreground/80">
                            {description}
                          </p>
                        )}
                        {key === 'anthropic' && (
                          <div className="pt-2">
                            <ModelDisplay
                              provider="anthropic"
                              refreshTrigger={modelsRefreshTrigger}
                              onRefreshComplete={handleRefreshTrigger}
                            />
                          </div>
                        )}
                        {key === 'openai' && (
                          <div className="pt-2">
                            <ModelDisplay
                              provider="openai"
                              refreshTrigger={modelsRefreshTrigger}
                              onRefreshComplete={handleRefreshTrigger}
                            />
                          </div>
                        )}
                        {key === 'gemini' && (
                          <div className="pt-2">
                            <ModelDisplay
                              provider="gemini"
                              refreshTrigger={modelsRefreshTrigger}
                              onRefreshComplete={handleRefreshTrigger}
                            />
                          </div>
                        )}
                        {key === 'deepseek' && (
                          <div className="pt-2">
                            <ModelDisplay
                              provider="deepseek"
                              refreshTrigger={modelsRefreshTrigger}
                              onRefreshComplete={handleRefreshTrigger}
                            />
                          </div>
                        )}
                        {key === 'groq' && (
                          <div className="pt-2">
                            <ModelDisplay
                              provider="groq"
                              refreshTrigger={modelsRefreshTrigger}
                              onRefreshComplete={handleRefreshTrigger}
                            />
                          </div>
                        )}
                        {key === 'cerebras' && (
                          <div className="pt-2">
                            <ModelDisplay
                              provider="cerebras"
                              refreshTrigger={modelsRefreshTrigger}
                              onRefreshComplete={handleRefreshTrigger}
                            />
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </Card>

            {/* Debug Information */}
            {settings.core.debugMode && <DebugPanel settings={settings} />}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default function SettingsPageWithErrorBoundary() {
  return (
    <ErrorBoundary
      onError={(error: Error, errorInfo: ErrorInfo) => {
        logger.error(LogCategory.LLM, '[Settings]', 'Error in Settings Page:', {
          error,
          errorInfo
        });
      }}
      resetOnPropsChange
    >
      <SettingsPage />
    </ErrorBoundary>
  );
}
