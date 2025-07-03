// components/Button.tsx
'use client';

import React from "react";
import { LoadingDots } from "./LoadingDots";

export function PrimaryButton({ 
  children, 
  onClick, 
  className = '', 
  disabled = false, 
  loading = false 
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  className?: string,
  disabled?: boolean,
  loading?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
        disabled || loading
          ? 'bg-gray-600 cursor-not-allowed opacity-50' 
          : 'bg-gradient-to-r from-[#00D4FF] to-[#9945FF] hover:from-[#00B8E6] hover:to-[#8A3FE6] hover:shadow-lg'
      } ${className}`}
    >
      {loading ? <LoadingDots /> : children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, className = '' }: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  className?: string 
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-semibold text-gray-200 bg-gray-800 border border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export function TabButton({ children, active, onClick, className = '' }: { 
  children: React.ReactNode, 
  active: boolean,
  onClick?: () => void, 
  className?: string 
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-[#00D4FF] to-[#9945FF] text-white shadow-lg transform scale-105' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      } ${className}`}
    >
      {children}
    </button>
  );
}
