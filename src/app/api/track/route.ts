import { NextResponse } from 'next/server';
import { createSession, recordPageView, updateSessionLastSeen } from '@/lib/supabase/utils';

// Function to get device type from user agent
function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

// Add CORS headers helper
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
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
        return NextResponse.json({ error: 'Failed to create session' }, { 
          status: 500,
          headers: corsHeaders()
        });
      }
      
      await recordPageView({
        session_id: newSession.id,
        page_url: pageUrl,
        referrer,
        user_agent: userAgent,
        country,
        device_type: deviceType,
      });

      return NextResponse.json({ sessionId: newSession.id }, { 
        headers: corsHeaders()
      });
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

    return NextResponse.json({ sessionId }, { 
      headers: corsHeaders()
    });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders()
    });
  }
}