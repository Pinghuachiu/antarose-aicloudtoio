const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchHello() {
  const res = await fetch(`${API_URL}/api/hello`);
  if (!res.ok) {
    throw new Error('Failed to fetch hello');
  }
  return res.json();
}

export async function fetchHealth() {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) {
    throw new Error('Failed to fetch health');
  }
  return res.json();
}
