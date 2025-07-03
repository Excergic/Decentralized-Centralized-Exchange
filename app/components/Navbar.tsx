// components/Navbar.tsx
'use client';

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { PrimaryButton, SecondaryButton } from "./Button";
import { LogOut, User } from "lucide-react";

// Custom SVG Logo Component
const CoinEXLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="url(#gradient1)" stroke="url(#gradient2)" strokeWidth="2"/>
    <path d="M8 12L16 8L24 12L20 16L16 20L12 16L8 12Z" fill="url(#gradient3)" opacity="0.9"/>
    <path d="M12 16L16 12L20 16L16 20L12 16Z" fill="url(#gradient4)" opacity="0.8"/>
    <circle cx="16" cy="16" r="3" fill="url(#gradient5)"/>
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D4FF" />
        <stop offset="50%" stopColor="#9945FF" />
        <stop offset="100%" stopColor="#14F195" />
      </linearGradient>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D4FF" />
        <stop offset="100%" stopColor="#9945FF" />
      </linearGradient>
      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#9945FF" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9945FF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#14F195" stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#00D4FF" />
      </linearGradient>
    </defs>
  </svg>
);

export const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { name: "Perps", href: "/perps" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-md z-50 border-b border-gray-700/50">
      <div className="container mx-auto flex justify-between items-center p-4">
        
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="transform transition-transform duration-200 group-hover:scale-110">
            <CoinEXLogo />
          </div>
          <div className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-[#00D4FF] to-[#9945FF] bg-clip-text text-transparent">
              Coin
            </span>
            <span className="text-white">EX</span>
          </div>
        </Link>

        {/* Navigation Links (only show when logged in) */}
        {session && (
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-[#00D4FF] to-[#9945FF] text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              {/* User Info */}
              <div className="hidden lg:flex items-center gap-2 text-gray-300">
                <User size={18} />
                <span className="text-sm">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              
              {/* Logout Button */}
              <SecondaryButton 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </SecondaryButton>
            </>
          ) : (
            <PrimaryButton onClick={() => signIn('google')}>
              Login
            </PrimaryButton>
          )}
        </div>
      </div>
    </header>
  );
};
