'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTotalVisits, getActiveSessions, getPagesPerSession, getAverageDuration } from '@/lib/supabase/metrics';

interface Metrics {
  totalVisits: number | null;
  activeSessions: number | null;
  pagesPerSession: number | null;
  averageDuration: string | null;
}

export function MetricsCards() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalVisits: null,
    activeSessions: null,
    pagesPerSession: null,
    averageDuration: null
  });

  useEffect(() => {
    async function fetchMetrics() {
      const [
        totalVisits,
        activeSessions,
        pagesPerSession,
        averageDuration
      ] = await Promise.all([
        getTotalVisits(),
        getActiveSessions(),
        getPagesPerSession(),
        getAverageDuration()
      ]);

      setMetrics({
        totalVisits,
        activeSessions,
        pagesPerSession,
        averageDuration
      });
    }

    fetchMetrics();

    // Refresh metrics every minute
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.totalVisits === null ? 'Loading...' : metrics.totalVisits.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.activeSessions === null ? 'Loading...' : metrics.activeSessions.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pages / Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.pagesPerSession === null ? 'Loading...' : metrics.pagesPerSession}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.averageDuration === null ? 'Loading...' : metrics.averageDuration}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}