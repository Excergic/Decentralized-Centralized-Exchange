// components/Navbar.tsx
'use client';

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { PrimaryButton } from "./Button";

export const Appbar = () => {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 w-full bg-[#111827]/80 backdrop-blur-sm z-50 border-b border-gray-700/50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-xl font-bold">
          CoinEX
        </Link>
        <div>
          {session ? (
            <PrimaryButton onClick={() => window.location.href = '/dashboard'}>
              Dashboard
            </PrimaryButton>
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
