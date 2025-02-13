import { supabase } from './client';

export async function getTotalVisits(): Promise<number> {
  const { count, error } = await supabase
    .from('pageviews')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching total visits:', error);
    return 0;
  }

  return count || 0;
}

export async function getActiveSessions(): Promise<number> {
  // Consider sessions active if they've been seen in the last 30 minutes
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .gt('last_seen', thirtyMinutesAgo);

  if (error) {
    console.error('Error fetching active sessions:', error);
    return 0;
  }

  return count || 0;
}

export async function getPagesPerSession(): Promise<number> {
  const { data: pageviews, error: pageviewsError } = await supabase
    .from('pageviews')
    .select('session_id');

  if (pageviewsError) {
    console.error('Error fetching pageviews:', pageviewsError);
    return 0;
  }

  const { data: sessions, error: sessionsError } = await supabase
    .from('sessions')
    .select('id');

  if (sessionsError) {
    console.error('Error fetching sessions:', sessionsError);
    return 0;
  }

  if (sessions.length === 0) return 0;

  // Calculate average pages per session
  const totalPageviews = pageviews.length;
  const totalSessions = sessions.length;
  return Number((totalPageviews / totalSessions).toFixed(1));
}

export async function getAverageDuration(): Promise<string> {
  const { data, error } = await supabase
    .from('sessions')
    .select('first_seen, last_seen');

  if (error) {
    console.error('Error fetching session durations:', error);
    return '0m';
  }

  if (data.length === 0) return '0m';

  // Calculate average duration in minutes
  const durations = data.map(session => {
    const start = new Date(session.first_seen).getTime();
    const end = new Date(session.last_seen).getTime();
    return (end - start) / (1000 * 60); // Convert to minutes
  });

  const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  
  // Format the duration
  if (averageDuration < 1) {
    return '< 1m';
  }
  return `${Math.round(averageDuration)}m`;
}