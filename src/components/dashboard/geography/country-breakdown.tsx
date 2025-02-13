'use client';

import type { CountryData } from '@/app/dashboard/geography/page';

interface CountryBreakdownProps {
  data: CountryData[];
  isLoading: boolean;
}

export function CountryBreakdown({ data, isLoading }: CountryBreakdownProps) {
  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {data.map((country) => (
        <div
          key={country.country}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50"
        >
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">{country.country}</span>
              <span className="text-sm text-muted-foreground">
                {country.visits.toLocaleString()} visits
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${country.percentage}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {country.percentage.toFixed(1)}% of total visits
            </div>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No geography data available
        </div>
      )}
    </div>
  );
}