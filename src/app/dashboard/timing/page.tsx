'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HourlyHeatmap } from '@/components/dashboard/timing/hourly-heatmap';
import { DailyTrends } from '@/components/dashboard/timing/daily-trends';
import { supabase } from '@/lib/supabase/client';
import { Clock } from 'lucide-react';

interface TimingMetrics {
  peakHour: string;
  peakDay: string;
  averageVisitsPerHour: number;
  averageVisitsPerDay: number;
}

export default function TimingPage() {
  const [metrics, setMetrics] = useState<TimingMetrics>({
    peakHour: '',
    peakDay: '',
    averageVisitsPerHour: 0,
    averageVisitsPerDay: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTimingMetrics() {
      try {
        const { data: pageviews, error } = await supabase
          .from('pageviews')
          .select('created_at');

        if (error) throw error;

        // Process pageviews to get timing metrics
        const hourCounts: { [key: string]: number } = {};
        const dayCounts: { [key: string]: number } = {};

        pageviews.forEach(view => {
          const date = new Date(view.created_at);
          
          // Count by hour (0-23)
          const hour = date.getHours();
          hourCounts[hour] = (hourCounts[hour] || 0) + 1;

          // Count by day (0-6, where 0 is Sunday)
          const day = date.getDay();
          dayCounts[day] = (dayCounts[day] || 0) + 1;
        });

        // Find peak hour
        const peakHour = Object.entries(hourCounts)
          .sort(([, a], [, b]) => b - a)[0][0];

        // Find peak day
        const peakDay = Object.entries(dayCounts)
          .sort(([, a], [, b]) => b - a)[0][0];

        // Calculate averages
        const totalHours = Object.values(hourCounts).length || 1;
        const totalDays = Object.values(dayCounts).length || 1;
        const totalVisits = pageviews.length;

        setMetrics({
          peakHour: formatHour(parseInt(peakHour)),
          peakDay: formatDay(parseInt(peakDay)),
          averageVisitsPerHour: Math.round(totalVisits / totalHours),
          averageVisitsPerDay: Math.round(totalVisits / totalDays)
        });
      } catch (error) {
        console.error('Error fetching timing metrics:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTimingMetrics();
  }, []);

  const formatHour = (hour: number): string => {
    return new Date(2024, 0, 1, hour).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true
    });
  };

  const formatDay = (day: number): string => {
    return new Date(2024, 0, day + 4).toLocaleDateString('en-US', {
      weekday: 'long'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Timing</h2>
        <p className="text-muted-foreground">Analyze visit patterns and peak usage times</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : metrics.peakHour}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Day</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : metrics.peakDay}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Per Hour</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : metrics.averageVisitsPerHour}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Per Day</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : metrics.averageVisitsPerDay}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Hourly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <HourlyHeatmap />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Daily Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyTrends />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
