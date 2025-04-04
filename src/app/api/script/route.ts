import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// CORS headers for script
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET() {
  try {
    const scriptPath = path.join(process.cwd(), 'public', 'bear-tracks.js');
    const script = fs.readFileSync(scriptPath, 'utf-8');
    
    return new NextResponse(script, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
        ...corsHeaders()
      },
    });
  } catch (error) {
    console.error('Error serving tracking script:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders()
    });
  }
}