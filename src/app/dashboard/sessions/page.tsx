'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionDurations } from '@/components/dashboard/sessions/session-durations';
import { SessionFlow } from '@/components/dashboard/sessions/session-flow';
import { supabase } from '@/lib/supabase/client';

interface SessionMetrics {
  totalSessions: number;
  averageDuration: string;
  bounceRate: string;
  returningRate: string;
}

export default function SessionsPage() {
  const [metrics, setMetrics] = useState<SessionMetrics>({
    totalSessions: 0,
    averageDuration: '0m',
    bounceRate: '0%',
    returningRate: '0%'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSessionMetrics() {
        try {
          // Get sessions with their pageview counts
          const { data: sessions, error: sessionsError } = await supabase
            .from('sessions')
            .select(`
              *,
              pageviews:pageviews(count)
            `);
  
          if (sessionsError) throw sessionsError;
  
          // Calculate metrics
          const totalSessions = sessions.length;
          
          // Calculate average duration
          const durations = sessions.map(session => {
            const start = new Date(session.first_seen).getTime();
            const end = new Date(session.last_seen).getTime();
            return (end - start) / (1000 * 60); // Convert to minutes
          });
          const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
          
          // Calculate bounce rate (sessions with only 1 pageview)
          const bouncedSessions = sessions.filter(session => 
            session.pageviews.length === 0 || session.pageviews[0].count === 1
          ).length;
          const bounceRate = (bouncedSessions / totalSessions) * 100;
  
          // Calculate returning visitor rate (placeholder - needs session cookie analysis)
          const returningRate = 15; // This would need proper implementation
  
          setMetrics({
            totalSessions,
            averageDuration: `${Math.round(avgDuration)}m`,
            bounceRate: `${bounceRate.toFixed(1)}%`,
            returningRate: `${returningRate}%`
          });
        } catch (error) {
          console.error('Error fetching session metrics:', error);
        } finally {
          setIsLoading(false);
        }
      }
  
      fetchSessionMetrics();
    }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sessions</h2>
        <p className="text-muted-foreground">Analyze user engagement and behavior</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : metrics.totalSessions.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : metrics.averageDuration}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : metrics.bounceRate}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returning Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : metrics.returningRate}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Session Durations</CardTitle>
          </CardHeader>
          <CardContent>
            <SessionDurations />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Session Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <SessionFlow />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}