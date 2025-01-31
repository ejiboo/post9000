import { ClerkProvider } from '@clerk/nextjs';
import { UserButton } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-50">
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Post9000</h1>
                <div className="flex gap-4">
                  <UserButton afterSignOutUrl="/"/>
                </div>
              </div>
            </div>
          </nav>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
} 