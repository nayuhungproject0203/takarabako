import { ResourceType } from '../types';

export function detectItemType(url: string): ResourceType | null {
  if (!url || !url.trim()) return null;
  
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname.toLowerCase();

    // YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return 'youtube';
    }
    
    // Newsletter
    if (hostname.includes('substack.com')) {
      return 'newsletter';
    }
    
    // Book
    if (hostname.includes('goodreads.com') || pathname.includes('/dp/') || hostname.includes('books.com.tw')) {
      return 'book';
    }

    // Default to website if it's a valid URL but no specific match
    return 'website';
  } catch (error) {
    return null;
  }
}

export interface YouTubeMetadata {
  title: string;
  author_name: string;
}

export async function fetchYouTubeMetadata(url: string): Promise<YouTubeMetadata | null> {
  try {
    // YouTube oEmbed endpoint handles CORS and requires no auth
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return {
      title: data.title,
      author_name: data.author_name
    };
  } catch (error) {
    console.error('Failed to fetch YouTube metadata:', error);
    return null;
  }
}
