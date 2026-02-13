// This file is kept for backward compatibility and type definitions
// The actual news data is now fetched from the API

// Re-export types from Api.ts for convenience
export type { NewsItem, NewsCategory } from '../../../Api';

// Static data is no longer used - news is fetched from API
// Legacy interface kept for reference only
interface LegacyNewsItem {
  id: number;
  title: string;
  content: string;
  image: string;
  date: string;
  type: string;
  location?: string;
  urgent?: boolean;
}

// Empty array - data is now fetched from API
export const newsItems: LegacyNewsItem[] = [];