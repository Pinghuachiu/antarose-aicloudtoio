/**
 * StructuredData Component
 *
 * 提供 Schema.org JSON-LD 結構化資料，用於 SEO 優化
 * 支援多語言版本的 WebApplication schema
 */

interface StructuredDataProps {
  locale: string;
}

export function StructuredData({ locale }: StructuredDataProps) {
  const names: Record<string, string> = {
    'zh-tw': 'AI 去背小幫手',
    'en': 'AI Background Remover',
    'zh-cn': 'AI 去背小助手',
    'ja': 'AI 背景除去ツール'
  };

  const descriptions: Record<string, string> = {
    'zh-tw': '免登入、不上傳、全程本機處理的 AI 圖片去背工具',
    'en': 'No login required. Privacy-first. 100% local processing AI background removal tool',
    'zh-cn': '免登录、不上传、全程本地处理的 AI 图片去背工具',
    'ja': 'ログイン不要・アップロード不要・完全ローカル処理のAI背景除去ツール'
  };

  const featureLists: Record<string, string[]> = {
    'zh-tw': [
      'AI 智慧去背',
      '100% 本地處理',
      '免登入使用',
      '隱私優先設計',
      'WebGL 加速'
    ],
    'en': [
      'AI-powered background removal',
      '100% local processing',
      'No login required',
      'Privacy-first design',
      'WebGL acceleration'
    ],
    'zh-cn': [
      'AI 智能去背',
      '100% 本地处理',
      '免登录使用',
      '隐私优先设计',
      'WebGL 加速'
    ],
    'ja': [
      'AI 背景除去',
      '100% ローカル処理',
      'ログイン不要',
      'プライバシー優先設計',
      'WebGL 加速'
    ]
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": names[locale] || names['zh-tw'],
    "description": descriptions[locale] || descriptions['zh-tw'],
    "url": `https://tools.cloudto.io/${locale}`,
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": featureLists[locale] || featureLists['zh-tw'],
    "author": {
      "@type": "Organization",
      "name": "CloudTo.io",
      "url": "https://cloudto.io"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
