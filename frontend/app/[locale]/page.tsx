import { redirect } from 'next/navigation';
import { type Locale } from '@/locales';

type Props = {
  params: Promise<{ locale: Locale }>;
};

/**
 * 首頁重定向到 removebg 工具
 *
 * 根據 spec.md 第 1.2 節：
 * 訪問 /[locale] 時自動重定向到 /[locale]/removebg
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  // 重定向到 removebg 工具頁面
  redirect(`/${locale}/removebg`);
}
