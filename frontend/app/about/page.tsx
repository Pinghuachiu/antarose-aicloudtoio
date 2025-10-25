import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      title: 'Frontend',
      items: ['Next.js 15 with App Router', 'React 19', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
    },
    {
      title: 'Backend',
      items: ['Express.js', 'TypeScript', 'RESTful API', 'Middleware support', 'Error handling'],
    },
    {
      title: 'Developer Experience',
      items: ['Hot reload', 'ESLint + Prettier', 'Type safety', 'Path aliases', 'Git ready'],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 pb-16">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          About This Template
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          A production-ready full-stack template designed for rapid development and scalability.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-16">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>Core technologies and tools</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feature.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Description */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Why This Template?</CardTitle>
          <CardDescription>Built with modern best practices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Independent Architecture</h3>
            <p className="text-sm text-muted-foreground">
              Frontend and backend are completely independent projects with their own package.json.
              This ensures dependency isolation and prevents cascading failures.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Type Safety First</h3>
            <p className="text-sm text-muted-foreground">
              TypeScript is configured with strict mode enabled for both frontend and backend,
              catching errors at compile time.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Production Ready</h3>
            <p className="text-sm text-muted-foreground">
              Includes error boundaries, 404 pages, ESLint, Prettier, and follows industry best
              practices out of the box.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Developer Experience</h3>
            <p className="text-sm text-muted-foreground">
              Hot reload, path aliases, and beautiful UI components make development a pleasure.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
