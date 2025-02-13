'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { PageView } from '@/lib/supabase/types';

export function LiveVisitors() {
  const [visitors, setVisitors] = useState<PageView[]>([]);

  useEffect(() => {
    const subscription = supabase
      .channel('pageviews_channel')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'pageviews' 
        }, 
        payload => {
          setVisitors(current => {
            const newVisit = payload.new as PageView;
            return [newVisit, ...current.slice(0, 19)]; // Keep last 20 visits
          });
        }
      )
      .subscribe();

    // Initial fetch
    async function fetchInitialVisitors() {
      const { data, error } = await supabase
        .from('pageviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching visitors:', error);
        return;
      }

      setVisitors(data);
    }

    fetchInitialVisitors();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  function formatTimeAgo(dateString: string) {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  }

  return (
    <div className="space-y-4">
      {visitors.map((visitor) => (
        <div
          key={visitor.id}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {visitor.country || 'Unknown'} • {visitor.device_type || 'Unknown'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(visitor.created_at)}
            </span>
          </div>
          <span className="text-sm truncate max-w-[150px]">
            {visitor.page_url}
          </span>
        </div>
      ))}
      {visitors.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No live visitors
        </div>
      )}
    </div>
  );
}