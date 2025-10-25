# Frontend - Antarose Template

A minimal Next.js 15 + TypeScript frontend template built with modern web technologies.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React version
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components
- **Lucide React** - Icon library

## Features

- ✅ Next.js 15 with App Router
- ✅ TypeScript with strict mode
- ✅ Tailwind CSS configured
- ✅ shadcn/ui components (Button, Card, Input)
- ✅ Responsive Header and Footer
- ✅ Error Boundary and 404 page
- ✅ ESLint and Prettier configured
- ✅ Path aliases configured (@/*)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── about/
│   │   └── page.tsx         # About page (SSG)
│   ├── layout.tsx           # Root layout with Header/Footer
│   ├── page.tsx             # Home page (SSG)
│   ├── error.tsx            # Error boundary
│   ├── not-found.tsx        # 404 page
│   └── globals.css          # Global styles + Tailwind
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   └── layout/              # Layout components
│       ├── header.tsx
│       └── footer.tsx
├── lib/
│   └── utils.ts             # Utility functions (cn)
├── .eslintrc.js             # ESLint config
├── .prettierrc              # Prettier config
├── components.json          # shadcn/ui config
├── next.config.ts           # Next.js config
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Adding New Pages

1. Create a new folder in `app/` directory
2. Add `page.tsx` inside the folder
3. Export a React component

Example:

```tsx
// app/blog/page.tsx
export default function BlogPage() {
  return <div>My Blog</div>;
}
```

## Adding shadcn/ui Components

```bash
npx shadcn-ui@latest add [component-name]
```

Example:

```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
