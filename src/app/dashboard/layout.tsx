import { ReactNode } from 'react';
import Link from 'next/link';
import { PawPrint, LayoutDashboard, Activity, Globe, Clock, Users } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex items-center gap-2 p-6">
          <PawPrint className="h-8 w-8" />
          <span className="text-xl font-semibold">Bear Tracks</span>
        </div>
        
        <nav className="mt-6 px-3">
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <LayoutDashboard className="h-5 w-5" />
            Overview
          </Link>
          <Link href="/dashboard/realtime" className="flex items-center gap-2 px-3 py-2 mt-2 text-gray-700 rounded-md hover:bg-gray-100">
            <Activity className="h-5 w-5" />
            Realtime
          </Link>
          <Link href="/dashboard/geography" className="flex items-center gap-2 px-3 py-2 mt-2 text-gray-700 rounded-md hover:bg-gray-100">
            <Globe className="h-5 w-5" />
            Geography
          </Link>
          <Link href="/dashboard/sessions" className="flex items-center gap-2 px-3 py-2 mt-2 text-gray-700 rounded-md hover:bg-gray-100">
            <Users className="h-5 w-5" />
            Sessions
          </Link>
          <Link href="/dashboard/timing" className="flex items-center gap-2 px-3 py-2 mt-2 text-gray-700 rounded-md hover:bg-gray-100">
            <Clock className="h-5 w-5" />
            Timing
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  );
}