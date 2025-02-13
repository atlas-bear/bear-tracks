import { supabase } from './client';

interface DailyVisits {
  date: string;
  visits: number;
}

export async function getDailyVisits(days: number = 7): Promise<DailyVisits[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from('pageviews')
    .select('created_at')
    .gte('created_at', startDate.toISOString());

  if (error) {
    console.error('Error fetching daily visits:', error);
    return [];
  }

  // Create a map to store visits by date
  const visitsByDate = new Map<string, number>();
  
  // Initialize all dates in the range with 0 visits
  for (let i = 0; i <= days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    visitsByDate.set(dateStr, 0);
  }

  // Count visits for each date
  data.forEach(visit => {
    const dateStr = new Date(visit.created_at).toISOString().split('T')[0];
    visitsByDate.set(dateStr, (visitsByDate.get(dateStr) || 0) + 1);
  });

  // Convert the map to array and sort by date
  return Array.from(visitsByDate.entries())
    .map(([date, visits]) => ({ date, visits }))
    .sort((a, b) => a.date.localeCompare(b.date));
}