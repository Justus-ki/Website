import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';

export const metadata: Metadata = {
  title: 'Clash Hub',
  description: 'A dynamic website for a Clash Royale content creator.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider defaultTheme="dark" storageKey="clash-hub-theme">
          <AuthProvider>
            <div className="fixed top-0 left-0 -z-50 h-full w-full bg-background">
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 right-0 -z-10 h-2/3 w-2/3 bg-gradient-to-bl from-primary/10 via-transparent to-transparent"></div>
            </div>
            <div className="relative z-10 flex min-h-screen flex-col">
              {children}
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
