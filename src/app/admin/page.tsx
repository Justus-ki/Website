
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { Loader2 } from 'lucide-react';
import { AddVideoForm } from '@/components/admin/add-video-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { VideoManagement } from '@/components/admin/video-management';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    const totalLoading = authLoading || adminLoading;
    if (!totalLoading) {
      if (!user) {
        router.replace('/login');
      } else if (!isAdmin) {
        router.replace('/');
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, router]);

  if (authLoading || adminLoading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto flex-grow px-4 py-8 md:py-12">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Admin Panel</h1>
             <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
      <div className="grid gap-8">
        <VideoManagement />
        {/* Placeholder for User Management */}
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                 <CardDescription>Ban/unban users and handle appeals.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Coming soon...</p>
            </CardContent>
        </Card>
         {/* Placeholder for Card Management */}
        <Card>
            <CardHeader>
                <CardTitle>Card Management</CardTitle>
                <CardDescription>Add or remove cards from the game data.</CardDescription>
            </CardHeader>
            <CardContent>
                 <p className="text-muted-foreground">Coming soon...</p>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
