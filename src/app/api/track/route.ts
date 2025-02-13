import { NextResponse } from 'next/server';
import { createSession, recordPageView, updateSessionLastSeen } from '@/lib/supabase/utils';

// Function to get device type from user agent
function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

export async function POST(request: Request) {
  try {
    const { sessionId, pageUrl, referrer } = await request.json();
    
    // Get country from CloudFlare headers if available
    const country = request.headers.get('cf-ipcountry') || null;
    const userAgent = request.headers.get('user-agent') || null;
    const deviceType = userAgent ? getDeviceType(userAgent) : null;

    // If no session ID provided, create new session
    if (!sessionId) {
      const newSession = await createSession(crypto.randomUUID());
      if (!newSession) {
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
      }
      
      await recordPageView({
        session_id: newSession.id,
        page_url: pageUrl,
        referrer,
        user_agent: userAgent,
        country,
        device_type: deviceType,
      });

      return NextResponse.json({ sessionId: newSession.id });
    }

    // Update existing session
    await updateSessionLastSeen(sessionId);
    await recordPageView({
      session_id: sessionId,
      page_url: pageUrl,
      referrer,
      user_agent: userAgent,
      country,
      device_type: deviceType,
    });

    return NextResponse.json({ sessionId });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}