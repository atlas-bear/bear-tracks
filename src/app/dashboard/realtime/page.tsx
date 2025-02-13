'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { ActivePages } from '@/components/dashboard/realtime/active-pages';
import { LiveVisitors } from '@/components/dashboard/realtime/live-visitors';

export default function RealtimePage() {
  const [metrics, setMetrics] = useState({
    activeVisitors: 0,
    pagesLastMinute: 0,
    averagePageTime: '0s',
  });

  useEffect(() => {
    async function fetchRealtimeMetrics() {
      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

      // Get active sessions (last 30 minutes)
      const { count: activeVisitors } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .gt('last_seen', thirtyMinutesAgo.toISOString());

      // Get pageviews in the last minute
      const { count: pagesLastMinute } = await supabase
        .from('pageviews')
        .select('*', { count: 'exact', head: true })
        .gt('created_at', oneMinuteAgo.toISOString());

      setMetrics({
        activeVisitors: activeVisitors || 0,
        pagesLastMinute: pagesLastMinute || 0,
        averagePageTime: '45s', // This would need a more complex calculation
      });
    }

    fetchRealtimeMetrics();
    const interval = setInterval(fetchRealtimeMetrics, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Realtime</h2>
        <p className="text-muted-foreground">Live visitor activity on your site</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeVisitors}</div>
            <p className="text-xs text-muted-foreground">
              In the last 30 minutes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pages / Minute
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pagesLastMinute}</div>
            <p className="text-xs text-muted-foreground">
              In the last minute
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Page Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averagePageTime}</div>
            <p className="text-xs text-muted-foreground">
              Time spent on each page
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Active Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivePages />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Live Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveVisitors />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}