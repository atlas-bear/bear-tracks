import { supabase } from './client';
import type { PageView, Session } from './types';

/**
 * Creates a new session in the database
 * @param sessionId - Unique identifier for the session
 * @returns The created session or null if creation failed
 */
export async function createSession(sessionId: string): Promise<Session | null> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert([{ id: sessionId }])
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error creating session:', error);
    return null;
  }
}

/**
 * Records a page view in the database
 * @param pageView - Page view data to record
 * @returns The created page view record or null if creation failed
 */
export async function recordPageView(
  pageView: Omit<PageView, 'id' | 'created_at'>
): Promise<PageView | null> {
  try {
    const { data, error } = await supabase
      .from('pageviews')
      .insert([pageView])
      .select()
      .single();

    if (error) {
      console.error('Error recording page view:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error recording page view:', error);
    return null;
  }
}

/**
 * Updates the last_seen timestamp for a session
 * @param sessionId - ID of the session to update
 * @returns The updated session or null if update failed
 */
export async function updateSessionLastSeen(sessionId: string): Promise<Session | null> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating session:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error updating session:', error);
    return null;
  }
}