'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Settings', href: '/settings' }
] as const;

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold">Post9000</h1>
        <div className="flex gap-4">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium ${
                pathname === href
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
      <UserButton afterSignOutUrl="/" />
    </nav>
  );
} 