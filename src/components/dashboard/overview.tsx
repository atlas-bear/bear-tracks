'use client';

import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getDailyVisits } from '@/lib/supabase/analytics';
import { Button } from '@/components/ui/button';

interface DailyVisits {
  date: string;
  visits: number;
}

export function Overview() {
  const [data, setData] = useState<DailyVisits[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState(7); // Default to 7 days

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const visits = await getDailyVisits(dateRange);
      setData(visits);
      setIsLoading(false);
    }

    fetchData();
  }, [dateRange]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return <div className="h-[350px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Button
          variant={dateRange === 7 ? "secondary" : "outline"}
          onClick={() => setDateRange(7)}
          size="sm"
        >
          7 days
        </Button>
        <Button
          variant={dateRange === 14 ? "secondary" : "outline"}
          onClick={() => setDateRange(14)}
          size="sm"
        >
          14 days
        </Button>
        <Button
          variant={dateRange === 30 ? "secondary" : "outline"}
          onClick={() => setDateRange(30)}
          size="sm"
        >
          30 days
        </Button>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatDate}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 border rounded-lg shadow-sm">
                    <p className="text-sm font-medium">
                      {formatDate(payload[0].payload.date)}
                    </p>
                    <p className="text-sm">
                      {payload[0].value} visits
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="visits"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}