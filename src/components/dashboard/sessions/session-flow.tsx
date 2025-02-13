'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface PageFlow {
  page_url: string;
  entries: number;
  exits: number;
}

export function SessionFlow() {
  const [flows, setFlows] = useState<PageFlow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFlowData() {
      try {
        const { data: pageviews, error } = await supabase
          .from('pageviews')
          .select('page_url, session_id')
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Group pageviews by session to analyze flow
        const sessionPages = pageviews.reduce((acc: { [key: string]: string[] }, curr) => {
          if (!acc[curr.session_id]) {
            acc[curr.session_id] = [];
          }
          acc[curr.session_id].push(curr.page_url);
          return acc;
        }, {});

        // Calculate entries and exits for each page
        const pageStats: { [key: string]: { entries: number; exits: number } } = {};

        Object.values(sessionPages).forEach(pages => {
          if (pages.length > 0) {
            // Count entries (first page in session)
            const firstPage = pages[0];
            if (!pageStats[firstPage]) {
              pageStats[firstPage] = { entries: 0, exits: 0 };
            }
            pageStats[firstPage].entries++;

            // Count exits (last page in session)
            const lastPage = pages[pages.length - 1];
            if (!pageStats[lastPage]) {
              pageStats[lastPage] = { entries: 0, exits: 0 };
            }
            pageStats[lastPage].exits++;
          }
        });

        // Convert to array and sort by entries
        const flowData = Object.entries(pageStats)
          .map(([page_url, stats]) => ({
            page_url,
            ...stats
          }))
          .sort((a, b) => b.entries - a.entries)
          .slice(0, 10); // Top 10 pages

        setFlows(flowData);
      } catch (error) {
        console.error('Error fetching flow data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFlowData();
  }, []);

  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {flows.map((flow) => (
        <div
          key={flow.page_url}
          className="flex flex-col gap-2 p-3 rounded-lg hover:bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium truncate max-w-[200px]">
              {flow.page_url || '/'}
            </span>
            <span className="text-sm text-muted-foreground">
              {flow.entries + flow.exits} views
            </span>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-green-600">
              {flow.entries} entries
            </span>
            <span className="text-red-600">
              {flow.exits} exits
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}