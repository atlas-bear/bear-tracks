'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Page2() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Test Page 2</CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="space-x-4">
            <Link href="/test/tracking" className="text-blue-500 hover:underline">
              Home
            </Link>
            <Link href="/test/tracking/page1" className="text-blue-500 hover:underline">
              Page 1
            </Link>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}