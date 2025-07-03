// components/Perps.tsx
'use client';

import { Rocket, TrendingUp, BarChart3, Zap } from "lucide-react";

export const Perps = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-24 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* Main Coming Soon Card */}
        <div className="bg-[#1a1b23] rounded-2xl p-12 border border-gray-700/50 text-center mb-8">
          
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-[#00D4FF] to-[#9945FF] p-6 rounded-full">
              <Rocket size={48} className="text-white" />
            </div>
          </div>
          
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#00D4FF] via-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
              PERPS
            </span>
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Perpetual Futures Trading
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Trade crypto perpetuals with up to 100x leverage. Advanced trading tools, 
            real-time analytics, and institutional-grade execution.
          </p>
          
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00D4FF]/20 to-[#9945FF]/20 border border-[#00D4FF]/30 rounded-full px-6 py-3 mb-8">
            <Zap size={20} className="text-[#00D4FF]" />
            <span className="text-xl font-bold text-white">FUNCTIONALITY COMING SOON</span>
          </div>
          
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30">
              <TrendingUp size={32} className="text-[#00D4FF] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">High Leverage</h3>
              <p className="text-gray-400 text-sm">Trade with up to 100x leverage on major crypto pairs</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30">
              <BarChart3 size={32} className="text-[#9945FF] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Advanced Charts</h3>
              <p className="text-gray-400 text-sm">Professional trading tools and real-time analytics</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30">
              <Zap size={32} className="text-[#14F195] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400 text-sm">Instant execution with minimal slippage</p>
            </div>
          </div>
          
          {/* Newsletter Signup */}
          <div className="mt-12 p-6 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/30">
            <h3 className="text-xl font-bold text-white mb-3">Get Notified When We Launch</h3>
            <p className="text-gray-400 mb-4">Be the first to know when perpetual futures trading goes live</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D4FF]"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#9945FF] text-white font-semibold rounded-lg hover:from-[#00B8E6] hover:to-[#8A3FE6] transition-all duration-200">
                Notify Me
              </button>
            </div>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="text-center text-gray-500">
          <p>🚀 Building the future of decentralized perpetual trading on Solana</p>
        </div>
      </div>
    </div>
  );
};
