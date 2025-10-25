import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
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
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // 主色調
        primary: {
          50: '#e0f2ff',
          100: '#b9e1ff',
          200: '#7cc6ff',
          300: '#3da9ff',
          400: '#0e8dff',
          500: '#0070f3',
          600: '#005bc4',
          700: '#004796',
          800: '#003269',
          900: '#001d3d',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },

        // 輔助色
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        // 強調色
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        // 中性色
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          850: '#1f1f23',
          900: '#18181b',
          950: '#0a0a0b',
        },

        // 語意色
        success: {
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          500: '#ef4444',
          600: '#dc2626',
        },
        info: {
          500: '#06b6d4',
          600: '#0891b2',
        },

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
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

      boxShadow: {
        'dark-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.3)',
        'dark-md': '0 12px 20px -4px rgba(0, 0, 0, 0.4)',
        'dark-lg': '0 25px 35px -8px rgba(0, 0, 0, 0.5)',
        'glow-primary': '0 0 20px rgba(0, 112, 243, 0.4)',
        'glow-accent': '0 0 20px rgba(249, 115, 22, 0.4)',
      },

      backgroundImage: {
        'gradient-primary':
          'linear-gradient(135deg, #0070f3 0%, #8b5cf6 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },

      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(0, 112, 243, 0.4)',
          },
          '50%': {
            opacity: '0.8',
            boxShadow: '0 0 40px rgba(0, 112, 243, 0.8)',
          },
        },
        'progress-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'progress-shimmer': 'progress-shimmer 2s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
