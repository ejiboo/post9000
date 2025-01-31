import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <Navigation />
              {children}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

export const metadata = {
  title: 'Post9000',
  description: 'Post to multiple social media platforms at once',
}; 