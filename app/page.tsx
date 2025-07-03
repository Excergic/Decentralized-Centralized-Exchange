// app/page.tsx
'use client';

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "./components/Navbar";
import { SecondaryButton } from "./components/Button";
import { CryptoChart } from "./components/CryptoCharts";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleAuthAction = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      signIn("google");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20">
        
        {/* Hero Section with Dynamic CTA */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Your Secure Wallet on{' '}
              <span className="bg-gradient-to-r from-[#00D4FF] to-[#9945FF] bg-clip-text text-transparent">
                Sol
              </span>
              <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                ana
              </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            {session 
              ? "Welcome back! Access your secure wallet and start trading."
              : "Instantly create a secure, non-custodial wallet and start exploring the world of decentralized finance. Zero fees, maximum security."
            }
          </p>
          <SecondaryButton onClick={handleAuthAction} >
            {session ? "Go to Dashboard" : "Login to Get a Wallet"}
          </SecondaryButton>
        </div>

        {/* Real-time Price Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CryptoChart 
            coinId="solana"
            coinName="Solana"
            coinIconUrl="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
            chartColor="#9945FF"
          />
          <CryptoChart 
            coinId="usd-coin"
            coinName="USDC"
            coinIconUrl="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
            chartColor="#2775CA"
          />
          <CryptoChart 
            coinId="tether"
            coinName="USDT"
            coinIconUrl="https://cryptologos.cc/logos/tether-usdt-logo.png"
            chartColor="#26A17B"
          />
        </div>

      </main>
    </div>
  );
}
