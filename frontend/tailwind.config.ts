import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      colors: {
        // CSS 變數支援（shadcn/ui）
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // TinyWow 風格主色調
        primary: {
          DEFAULT: '#1A8FE3',
          hover: '#1570BD',
          light: '#E0F2FE',
          foreground: '#FFFFFF',
        },

        // 文字顏色
        text: {
          primary: '#020817',
          heading: '#181D20',
          secondary: '#6B7280',
          disabled: '#9CA3AF',
        },

        // 邊框顏色
        border: {
          DEFAULT: '#D1D5DB',
          hover: '#9CA3AF',
          focus: '#1A8FE3',
        },

        // 語義色彩
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // shadcn/ui 兼容色彩
        secondary: {
          DEFAULT: '#F6F6F6',
          foreground: '#020817',
        },
        accent: {
          DEFAULT: '#1A8FE3',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F6F6F6',
          foreground: '#6B7280',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#020817',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#020817',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
      },

      fontSize: {
        // Display
        'display-1': [
          '3.5rem',
          { lineHeight: '1.1', fontWeight: '900', letterSpacing: '-0.02em' },
        ],
        'display-2': [
          '3rem',
          { lineHeight: '1.2', fontWeight: '800', letterSpacing: '-0.02em' },
        ],

        // Headings
        h1: [
          '2.5rem',
          { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' },
        ],
        h2: [
          '2rem',
          { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.01em' },
        ],
        h3: ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        h4: ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
        h5: ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }],
        h6: ['1rem', { lineHeight: '1.5', fontWeight: '600' }],

        // Body
        'body-xl': ['1.25rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
        body: ['1rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],

        // Caption
        caption: ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],
        'caption-sm': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
      },

      spacing: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        'section-sm': '2.5rem',
        section: '3rem',
        'section-lg': '4rem',
        'section-xl': '6rem',
      },

      borderRadius: {
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.75rem',
      },

      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto-tc)', 'var(--font-noto-sc)', 'var(--font-noto-jp)', 'system-ui', 'sans-serif'],
      },

      boxShadow: {
        'nav': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'button': '0 2px 6px rgba(26, 143, 227, 0.2)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
