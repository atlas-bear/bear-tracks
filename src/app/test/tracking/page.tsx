'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TrackingTestPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [doNotTrack, setDoNotTrack] = useState<string | null>(null);

  useEffect(() => {
    // Check for session ID and Do Not Track status on client side
    setSessionId(localStorage.getItem('bear_tracks_sid'));
    setDoNotTrack(navigator.doNotTrack);
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tracking Test Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Current Session ID:</h3>
              <code className="bg-slate-100 p-2 rounded block mt-2">
                {sessionId || 'No session ID found'}
              </code>
            </div>
            
            <div>
              <h3 className="font-semibold">Test Navigation:</h3>
              <nav className="space-x-4 mt-2">
                <Link href="/test/tracking" className="text-blue-500 hover:underline">
                  Home
                </Link>
                <Link href="/test/tracking/page1" className="text-blue-500 hover:underline">
                  Page 1
                </Link>
                <Link href="/test/tracking/page2" className="text-blue-500 hover:underline">
                  Page 2
                </Link>
              </nav>
            </div>

            <div>
              <h3 className="font-semibold">Privacy Status:</h3>
              <div className="mt-2">
                Do Not Track enabled: {doNotTrack === '1' ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}