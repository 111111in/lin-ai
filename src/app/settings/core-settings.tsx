'use client';

import { memo } from 'react';
import { AlertCircle, Bug, Shield } from 'lucide-react';

import { useLanguage } from '@/components/providers/language-provider';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

interface CoreSettingsProps {
  settings: {
    core: {
      byokOnly: boolean;
      debugMode?: boolean;
    };
  };
  onByokChange: (checked: boolean) => void;
  onDebugModeChange: (checked: boolean) => void;
}

function CoreSettingsComponent({
  settings,
  onByokChange,
  onDebugModeChange
}: CoreSettingsProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5" />
          <h3 className="text-lg font-medium">{t('settings.core.title')}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {t('settings.core.subtitle')}
        </p>

        <div className="grid gap-6">
          {/* BYOK Only Mode */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>{t('settings.core.byok.label')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.core.byok.description')}
                </p>
              </div>
              <Switch
                checked={settings.core.byokOnly}
                onCheckedChange={(checked) => {
                  // Update localStorage directly in addition to calling the regular handler
                  try {
                    localStorage.setItem(
                      'byokOnly',
                      checked ? 'true' : 'false'
                    );

                    // Add info log to show BYOK mode status
                    console.info(
                      `BYOK mode ${checked ? 'enabled' : 'disabled'} via settings interface`
                    );
                  } catch (e) {
                    console.warn(
                      'Failed to update localStorage BYOK setting:',
                      e
                    );
                  }

                  // Call the regular handler
                  onByokChange(checked);
                }}
              />
            </div>

            {settings.core.byokOnly && (
              <div className="rounded-md bg-yellow-500/15 p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <p className="text-sm text-yellow-500">
                    {t('settings.core.byok.warning')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Debug Mode */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  {t('settings.core.debug.label')}
                  <Bug className="h-4 w-4 text-muted-foreground" />
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.core.debug.description')}
                </p>
              </div>
              <Switch
                checked={settings.core.debugMode || false}
                onCheckedChange={onDebugModeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const CoreSettings = memo(CoreSettingsComponent);
