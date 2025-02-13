'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { PageView } from '@/lib/supabase/types';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

function getDeviceIcon(deviceType: string | null) {
  switch (deviceType?.toLowerCase()) {
    case 'mobile':
      return <Smartphone className="h-4 w-4" />;
    case 'tablet':
      return <Tablet className="h-4 w-4" />;
    default:
      return <Monitor className="h-4 w-4" />;
  }
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return 'just now';
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(seconds / 86400);
    return `${days}d ago`;
  }
}

function formatPath(path: string): string {
  // Remove trailing slashes and leading slashes
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  // If path is empty, return "/"
  if (!cleanPath) return '/';
  // If path is too long, truncate it
  if (cleanPath.length > 30) {
    return cleanPath.substring(0, 27) + '...';
  }
  return cleanPath;
}

export function RecentVisitors() {
  const [recentVisits, setRecentVisits] = useState<PageView[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentVisits() {
      try {
        const { data, error } = await supabase
          .from('pageviews')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setRecentVisits(data || []);
      } catch (error) {
        console.error('Error fetching recent visits:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentVisits();

    // Set up real-time subscription
    const subscription = supabase
      .channel('pageviews_channel')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'pageviews' 
        }, 
        payload => {
          setRecentVisits(current => {
            const newVisit = payload.new as PageView;
            // Keep only the latest 10 visits
            return [newVisit, ...current.slice(0, 9)];
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-40">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {recentVisits.map((visit) => (
        <div key={visit.id} className="flex items-start gap-4 p-2 rounded-lg hover:bg-gray-50">
          <div className="mt-1">
            {getDeviceIcon(visit.device_type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">
                {formatPath(visit.page_url)}
              </p>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {visit.country || 'Unknown'}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <span>{visit.device_type || 'Unknown device'}</span>
              <span>•</span>
              <span>{formatTimeAgo(visit.created_at)}</span>
              {visit.referrer && (
                <>
                  <span>•</span>
                  <span className="truncate">from {visit.referrer}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {recentVisits.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No recent visitors
        </div>
      )}
    </div>
  );
}