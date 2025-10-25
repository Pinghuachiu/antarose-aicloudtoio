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
      <Globe className="w-4 h-4 text-neutral-400" />
      <Select value={currentLocale} onValueChange={handleLocaleChange}>
        <SelectTrigger className="w-[180px] bg-neutral-800/50 border-neutral-700 text-neutral-100 hover:bg-neutral-800 transition-colors">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span>{localeFlags[currentLocale]}</span>
              <span>{localeNames[currentLocale]}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-neutral-800 border-neutral-700">
          {locales.map((locale) => (
            <SelectItem
              key={locale}
              value={locale}
              className="text-neutral-100 hover:bg-neutral-700 focus:bg-neutral-700 cursor-pointer"
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
