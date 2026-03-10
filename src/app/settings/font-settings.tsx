'use client';

import { memo } from 'react';
import { Type } from 'lucide-react';

import { useLanguage } from '@/components/providers/language-provider';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { FontFamily, fontOptions, monoFonts } from '@/lib/fonts';

interface FontSettingsProps {
  settings: {
    fonts: {
      primary: FontFamily;
      mono: string;
    };
  };
  onPrimaryFontChange: (value: FontFamily) => void;
  onMonoFontChange: (value: string) => void;
}

function FontSettingsComponent({
  settings,
  onPrimaryFontChange,
  onMonoFontChange
}: FontSettingsProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Type className="h-5 w-5" />
          <h3 className="text-lg font-medium">{t('settings.font.title')}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {t('settings.font.subtitle')}
        </p>

        <div className="grid gap-6">
          {/* Primary Font Selection */}
          <div className="grid gap-2">
            <div className="space-y-2">
              <Label>{t('settings.font.primary.label')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.font.primary.description')}
              </p>
              <Select
                value={settings.fonts.primary}
                onValueChange={onPrimaryFontChange as any}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('settings.font.primary.label')} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(fontOptions).map(([key, font]) => (
                    <SelectItem
                      key={key}
                      value={key}
                    >
                      <span>{font.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-primary mt-2">
                {t('settings.font.primary.current')}:{' '}
                {fontOptions[settings.fonts.primary]?.name}
              </p>
            </div>
          </div>

          <Separator />

          {/* Monospace Font Selection */}
          <div className="grid gap-2">
            <div className="space-y-2">
              <Label>{t('settings.font.mono.label')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.font.mono.description')}
              </p>
              <Select
                value={settings.fonts.mono}
                onValueChange={onMonoFontChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t('settings.font.mono.placeholder')}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    <span>{t('settings.font.mono.default')}</span>
                  </SelectItem>
                  {Object.entries(monoFonts).map(([key, font]) => (
                    <SelectItem
                      key={key}
                      value={key}
                    >
                      <span>{font.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-primary mt-2">
                {t('settings.font.mono.current')}:{' '}
                {settings.fonts.mono === 'default'
                  ? t('settings.font.mono.default')
                  : monoFonts[settings.fonts.mono as keyof typeof monoFonts]
                      ?.name || 'Default'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const FontSettings = memo(FontSettingsComponent);
