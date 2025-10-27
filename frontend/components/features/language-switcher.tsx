'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { type Locale, locales, localeNames, localeFlags } from '@/locales';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const currentLocale = (params.locale as Locale) || 'zh-tw';

  const handleLocaleChange = (newLocale: string) => {
    // 替換路徑中的語言代碼
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-text-secondary" />
      <Select value={currentLocale} onValueChange={handleLocaleChange}>
        <SelectTrigger className="w-[140px] sm:w-[160px] bg-white border-border text-text-primary hover:bg-background-hover transition-colors">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span>{localeFlags[currentLocale]}</span>
              <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border-border">
          {locales.map((locale) => (
            <SelectItem
              key={locale}
              value={locale}
              className="text-text-primary hover:bg-background-hover focus:bg-background-hover cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>{localeFlags[locale]}</span>
                <span>{localeNames[locale]}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
