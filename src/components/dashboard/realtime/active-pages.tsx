'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface ActivePage {
  page_url: string;
  visitors: number;
}

export function ActivePages() {
  const [activePages, setActivePages] = useState<ActivePage[]>([]);

  useEffect(() => {
    async function fetchActivePages() {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('pageviews')
        .select('page_url')
        .gt('created_at', thirtyMinutesAgo);

      if (error) {
        console.error('Error fetching active pages:', error);
        return;
      }

      // Count visitors per page
      const pageCounts = data.reduce((acc: { [key: string]: number }, curr) => {
        acc[curr.page_url] = (acc[curr.page_url] || 0) + 1;
        return acc;
      }, {});

      // Convert to array and sort by count
      const sorted = Object.entries(pageCounts)
        .map(([page_url, visitors]) => ({ page_url, visitors }))
        .sort((a, b) => b.visitors - a.visitors)
        .slice(0, 10); // Top 10 pages

      setActivePages(sorted);
    }

    fetchActivePages();
    const interval = setInterval(fetchActivePages, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {activePages.map((page) => (
        <div
          key={page.page_url}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
        >
          <span className="text-sm font-medium truncate max-w-[200px]">
            {page.page_url || '/'}
          </span>
          <span className="text-sm text-muted-foreground">
            {page.visitors} {page.visitors === 1 ? 'visitor' : 'visitors'}
          </span>
        </div>
      ))}
      {activePages.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No active pages
        </div>
      )}
    </div>
  );
}