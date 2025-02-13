'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createSession, recordPageView, updateSessionLastSeen } from '@/lib/supabase/utils';

export default function SupabaseTestPage() {
  const [testResults, setTestResults] = useState<{
    createSession?: string;
    recordPageView?: string;
    updateSession?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    setTestResults({});

    try {
      // Test 1: Create Session
      const sessionId = crypto.randomUUID();
      const session = await createSession(sessionId);
      setTestResults(prev => ({
        ...prev,
        createSession: session ? '✅ Session created successfully' : '❌ Failed to create session'
      }));

      if (session) {
        // Test 2: Record Page View
        const pageView = await recordPageView({
          session_id: sessionId,
          page_url: '/test/supabase',
          referrer: 'test',
          user_agent: navigator.userAgent,
          country: 'TEST',
          device_type: 'TEST'
        });
        setTestResults(prev => ({
          ...prev,
          recordPageView: pageView ? '✅ Page view recorded successfully' : '❌ Failed to record page view'
        }));

        // Test 3: Update Session
        const updatedSession = await updateSessionLastSeen(sessionId);
        setTestResults(prev => ({
          ...prev,
          updateSession: updatedSession ? '✅ Session updated successfully' : '❌ Failed to update session'
        }));
      }
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({
        createSession: '❌ Tests failed with error',
        recordPageView: '❌ Tests failed with error',
        updateSession: '❌ Tests failed with error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runTests} 
            disabled={isLoading}
          >
            {isLoading ? 'Running Tests...' : 'Run Tests'}
          </Button>

          {Object.entries(testResults).length > 0 && (
            <div className="mt-4 space-y-2">
              {Object.entries(testResults).map(([test, result]) => (
                <div key={test} className="font-mono">
                  <strong>{test}:</strong> {result}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}