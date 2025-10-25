import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';

describe('Card Components', () => {
  it('should render Card component', () => {
    render(<Card data-testid="card">Card Content</Card>);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('should render CardHeader component', () => {
    render(<CardHeader data-testid="card-header">Header Content</CardHeader>);
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
  });

  it('should render CardTitle component', () => {
    render(<CardTitle>Title Text</CardTitle>);
    expect(screen.getByText('Title Text')).toBeInTheDocument();
  });

  it('should render CardDescription component', () => {
    render(<CardDescription>Description Text</CardDescription>);
    expect(screen.getByText('Description Text')).toBeInTheDocument();
  });

  it('should render CardContent component', () => {
    render(<CardContent data-testid="card-content">Content Text</CardContent>);
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
  });

  it('should render CardFooter component', () => {
    render(<CardFooter data-testid="card-footer">Footer Text</CardFooter>);
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
  });

  it('should render complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>Test Content</CardContent>
        <CardFooter>Test Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Test Footer')).toBeInTheDocument();
  });

  it('should apply correct CSS classes to Card', () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId('card');
    expect(card.className).toContain('rounded-lg');
    expect(card.className).toContain('border');
  });

  it('should apply correct CSS classes to CardTitle', () => {
    render(<CardTitle data-testid="card-title">Title</CardTitle>);
    const title = screen.getByTestId('card-title');
    expect(title.className).toContain('text-h3');
  });
});
