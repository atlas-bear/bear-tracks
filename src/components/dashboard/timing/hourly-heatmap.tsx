'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface HourlyData {
  [hour: string]: {
    [day: string]: number;
  };
}

export function HourlyHeatmap() {
  const [data, setData] = useState<HourlyData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHourlyData() {
      try {
        const { data: pageviews, error } = await supabase
          .from('pageviews')
          .select('created_at');

        if (error) throw error;

        // Initialize data structure
        const hourlyData: HourlyData = {};
        for (let hour = 0; hour < 24; hour++) {
          hourlyData[hour] = {
            'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0
          };
        }

        // Process pageviews
        pageviews.forEach(view => {
          const date = new Date(view.created_at);
          const hour = date.getHours();
          const day = date.toLocaleDateString('en-US', { weekday: 'short' });
          hourlyData[hour][day]++;
        });

        setData(hourlyData);
      } catch (error) {
        console.error('Error fetching hourly data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHourlyData();
  }, []);

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center">Loading...</div>;
  }

  // Find the maximum value for color scaling
  const maxValue = Math.max(
    ...Object.values(data).flatMap(dayData => Object.values(dayData))
  );

  const getColor = (value: number) => {
    const intensity = Math.min((value / maxValue) * 100, 100);
    return `rgb(59, 130, 246, ${intensity / 100})`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[auto_repeat(7,_1fr)] gap-1">
          {/* Header row with days */}
          <div className="h-8" /> {/* Empty corner cell */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium">{day}</div>
          ))}

          {/* Hour rows */}
          {Object.entries(data).map(([hour, dayData]) => (
            <React.Fragment key={hour}>
              <div className="text-right pr-2 text-sm text-muted-foreground">
                {new Date(2024, 0, 1, parseInt(hour)).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  hour12: true
                })}
              </div>
              {Object.entries(dayData).map(([day, value]) => (
                <div
                  key={`${hour}-${day}`}
                  className="aspect-square rounded-sm flex items-center justify-center text-xs"
                  style={{ backgroundColor: getColor(value) }}
                  title={`${day} ${hour}:00 - ${value} visits`}
                >
                  {value > 0 && value}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
