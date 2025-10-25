import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code2, Palette, Zap } from 'lucide-react';
import { fetchHello } from '@/lib/api-client';

export default async function HomePage() {
  // SSR: 在伺服器端呼叫後端 API
  let backendMessage = 'Backend not available';
  let backendStatus: 'success' | 'error' = 'error';

  try {
    const data = await fetchHello();
    backendMessage = data.message;
    backendStatus = 'success';
  } catch (error) {
    console.error('Failed to fetch backend:', error);
  }
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-6 pb-16">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Antarose Template
            </span>
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            A minimal Next.js 15 + Express template for full-stack development. Built with
            TypeScript, Tailwind CSS, and shadcn/ui.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/about">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="https://github.com" target="_blank">
              View on GitHub
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-16">
        <Card>
          <CardHeader>
            <Code2 className="h-10 w-10 mb-2 text-blue-600" />
            <CardTitle>Modern Stack</CardTitle>
            <CardDescription>
              Built with Next.js 15, React 19, TypeScript, and Express
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Leverage the latest web technologies for optimal performance and developer experience.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Palette className="h-10 w-10 mb-2 text-cyan-600" />
            <CardTitle>Beautiful UI</CardTitle>
            <CardDescription>
              Pre-configured with Tailwind CSS and shadcn/ui components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create stunning interfaces with a powerful design system and utility-first CSS.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Zap className="h-10 w-10 mb-2 text-yellow-600" />
            <CardTitle>Lightning Fast</CardTitle>
            <CardDescription>
              Optimized for performance with SSR, SSG, and ISR support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Deliver blazing-fast experiences with automatic code splitting and optimization.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Backend API Integration Section */}
      <section className="pb-16">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Backend API Integration</CardTitle>
            <CardDescription>
              Real-time connection status between Next.js frontend and Express backend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  backendStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm font-medium">
                Status: {backendStatus === 'success' ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-mono">
                <span className="text-muted-foreground">Message from backend:</span>{' '}
                <span className={backendStatus === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {backendMessage}
                </span>
              </p>
            </div>
            {backendStatus === 'error' && (
              <p className="text-sm text-muted-foreground">
                Make sure the backend server is running on http://localhost:4000
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-center text-center space-y-6">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to get started?</CardTitle>
            <CardDescription>
              Check out the documentation to learn more about this template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" asChild>
              <Link href="/about">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
