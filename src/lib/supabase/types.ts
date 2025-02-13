export interface PageView {
    id: number;
    session_id: string;
    page_url: string;
    referrer: string | null;
    user_agent: string | null;
    country: string | null;
    device_type: string | null;
    created_at: string;
  }
  
  export interface Session {
    id: string;
    first_seen: string;
    last_seen: string;
  }
  
  export type Database = {
    public: {
      Tables: {
        pageviews: {
          Row: PageView;
          Insert: Omit<PageView, 'id' | 'created_at'>;
          Update: Partial<Omit<PageView, 'id'>>;
        };
        sessions: {
          Row: Session;
          Insert: Omit<Session, 'first_seen' | 'last_seen'>;
          Update: Partial<Omit<Session, 'id'>>;
        };
      };
    };
  };