'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase/client';

interface DurationData {
  range: string;
  sessions: number;
}

export function SessionDurations() {
  const [data, setData] = useState<DurationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDurationData() {
      try {
        const { data: sessions, error } = await supabase
          .from('sessions')
          .select('first_seen, last_seen');

        if (error) throw error;

        // Calculate durations and group into ranges
        const durations = sessions.map(session => {
          const start = new Date(session.first_seen).getTime();
          const end = new Date(session.last_seen).getTime();
          return Math.floor((end - start) / (1000 * 60)); // Duration in minutes
        });

        // Group into ranges
        const ranges = {
          '< 1m': 0,
          '1-5m': 0,
          '5-15m': 0,
          '15-30m': 0,
          '30m+': 0
        };

        durations.forEach(duration => {
          if (duration < 1) ranges['< 1m']++;
          else if (duration < 5) ranges['1-5m']++;
          else if (duration < 15) ranges['5-15m']++;
          else if (duration < 30) ranges['15-30m']++;
          else ranges['30m+']++;
        });

        const chartData = Object.entries(ranges).map(([range, sessions]) => ({
          range,
          sessions
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching duration data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDurationData();
  }, []);

  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sessions" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
