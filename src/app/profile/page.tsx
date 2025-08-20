
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuth, sendPasswordResetEmail, verifyBeforeUpdateEmail } from 'firebase/auth';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth();
  const [newEmail, setNewEmail] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);


  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setIsSendingPasswordReset(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({ title: 'Password Reset Email Sent', description: 'Check your inbox to reset your password.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not send password reset email.' });
    } finally {
      setIsSendingPasswordReset(false);
    }
  };
  
  const handleEmailChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.currentUser || !newEmail) return;
    setIsUpdatingEmail(true);
    try {
      await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
      toast({
        title: 'Verification Email Sent',
        description: `Please check your new email inbox (${newEmail}) to complete the change.`,
      });
      setNewEmail('');
    } catch (error: any) {
       console.error(error);
      let description = 'Could not update your email.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'This email address is already in use.'
      } else if (error.code === 'auth/requires-recent-login') {
        description = 'This operation is sensitive and requires recent authentication. Please log out and log in again before retrying.'
      }
       toast({ variant: 'destructive', title: 'Error', description });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  return (
    <main className="container mx-auto flex-grow px-4 py-8 md:py-12">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Your Profile</CardTitle>
          <CardDescription>
            Manage your account settings and profile information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <UserIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{user.displayName}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Change Email</h3>
             <form onSubmit={handleEmailChange} className="flex items-end gap-2">
                <div className="flex-grow">
                    <Label htmlFor="new-email">New Email Address</Label>
                    <Input id="new-email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new.email@example.com" required/>
                </div>
                <Button type="submit" disabled={isUpdatingEmail}>
                    {isUpdatingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Email
                </Button>
            </form>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
             <Button onClick={handlePasswordReset} disabled={isSendingPasswordReset}>
                {isSendingPasswordReset && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Password Reset Email
            </Button>
            <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
            </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
