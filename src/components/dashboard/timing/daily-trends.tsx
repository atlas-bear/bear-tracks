'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase/client';

interface DailyData {
  day: string;
  visits: number;
}

export function DailyTrends() {
  const [data, setData] = useState<DailyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDailyData() {
      try {
        const { data: pageviews, error } = await supabase
          .from('pageviews')
          .select('created_at');

        if (error) throw error;

        // Group by day of week
        const dailyCounts: { [key: string]: number } = {
          'Sunday': 0,
          'Monday': 0,
          'Tuesday': 0,
          'Wednesday': 0,
          'Thursday': 0,
          'Friday': 0,
          'Saturday': 0
        };

        pageviews.forEach(view => {
          const day = new Date(view.created_at).toLocaleDateString('en-US', {
            weekday: 'long'
          });
          dailyCounts[day]++;
        });

        // Convert to array format for chart
        const chartData = Object.entries(dailyCounts).map(([day, visits]) => ({
          day,
          visits
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching daily data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDailyData();
  }, []);

  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="visits"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}