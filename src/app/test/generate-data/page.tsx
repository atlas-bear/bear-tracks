'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';

export default function GenerateDataPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');

  const generateData = async () => {
    setIsGenerating(true);
    setStatus('Starting data generation...');

    try {
      // Create an array of page URLs to simulate realistic navigation
      const pages = [
        '/',
        '/about',
        '/products',
        '/contact',
        '/blog',
        '/pricing',
        '/features'
      ];

      // Create an array of countries for geographic distribution
      const countries = [
        'United States', 'United Kingdom', 'Germany', 'France', 'Japan',
        'Canada', 'Australia', 'Brazil', 'India', 'Spain'
      ];

      // Generate data for the past 7 days
      const now = new Date();
      const startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

      // Generate 1000 pageviews across different times
      const totalPageviews = 1000;
      let completed = 0;

      for (let i = 0; i < totalPageviews; i++) {
        // Generate a random timestamp between start date and now
        const timestamp = new Date(
          startDate.getTime() + Math.random() * (now.getTime() - startDate.getTime())
        );

        // Create a session ID (reuse for some visits to simulate real sessions)
        const sessionId = `test-session-${Math.floor(i / 3)}`; // Average 3 pageviews per session

        // Pick random page and country
        const pageUrl = pages[Math.floor(Math.random() * pages.length)];
        const country = countries[Math.floor(Math.random() * countries.length)];

        // Insert the pageview
        const { error: pageviewError } = await supabase
          .from('pageviews')
          .insert({
            session_id: sessionId,
            page_url: pageUrl,
            country: country,
            device_type: Math.random() > 0.3 ? 'desktop' : 'mobile',
            created_at: timestamp.toISOString()
          });

        if (pageviewError) {
          console.error('Error inserting pageview:', pageviewError);
          continue;
        }

        // Update or insert session
        const { error: sessionError } = await supabase
          .from('sessions')
          .upsert({
            id: sessionId,
            first_seen: timestamp.toISOString(),
            last_seen: new Date(timestamp.getTime() + Math.random() * 1800000).toISOString() // Up to 30 minutes later
          });

        if (sessionError) {
          console.error('Error upserting session:', sessionError);
          continue;
        }

        completed++;
        if (completed % 100 === 0) {
          setStatus(`Generated ${completed} of ${totalPageviews} pageviews...`);
        }
      }

      setStatus(`Successfully generated ${completed} pageviews with sessions!`);
    } catch (error) {
      console.error('Error generating data:', error);
      setStatus('Error generating data. Check console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Generate Test Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <Button
              onClick={generateData}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Test Data'}
            </Button>
            {status && (
              <div className="text-sm text-muted-foreground">
                {status}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}