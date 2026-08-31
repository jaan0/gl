import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Family Grocery List',
    short_name: 'Grocery',
    description: 'A shared grocery list for the whole family',
    start_url: '/grocerylist',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#1d4ed8',
    orientation: 'portrait',
    icons: [
  { src: '/icon.svg', sizes: '512x512', type: 'image/svg+xml' },
],
  };
}
