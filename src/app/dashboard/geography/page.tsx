'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorldMap } from '@/components/dashboard/geography/world-map';
import { CountryBreakdown } from '@/components/dashboard/geography/country-breakdown';
import { supabase } from '@/lib/supabase/client';

export interface CountryData {
  country: string;
  visits: number;
  percentage: number;
}

export default function GeographyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [countryData, setCountryData] = useState<CountryData[]>([]);

  useEffect(() => {
    async function fetchGeographyData() {
      try {
        const { data, error } = await supabase
          .from('pageviews')
          .select('country');

        if (error) throw error;

        // Count visits per country
        const countryCounts = data.reduce((acc: { [key: string]: number }, curr) => {
          const country = curr.country || 'Unknown';
          acc[country] = (acc[country] || 0) + 1;
          return acc;
        }, {});

        // Calculate total visits
        const totalVisits = Object.values(countryCounts).reduce((a, b) => a + b, 0);

        // Format data with percentages
        const formattedData = Object.entries(countryCounts)
          .map(([country, visits]) => ({
            country,
            visits,
            percentage: (visits / totalVisits) * 100
          }))
          .sort((a, b) => b.visits - a.visits);

        setCountryData(formattedData);
      } catch (error) {
        console.error('Error fetching geography data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGeographyData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchGeographyData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Geography</h2>
        <p className="text-muted-foreground">Visitor locations and distribution</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : countryData.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Country</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : (countryData[0]?.country || 'N/A')}
            </div>
            {!isLoading && countryData[0] && (
              <p className="text-xs text-muted-foreground">
                {countryData[0].percentage.toFixed(1)}% of visits
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>World Map</CardTitle>
          </CardHeader>
          <CardContent>
            <WorldMap data={countryData} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Country Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <CountryBreakdown data={countryData} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}