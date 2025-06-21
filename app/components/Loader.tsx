
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 border-4 border-t-transparent border-gray-300 rounded-full animate-spin animation-delay-[-0.5s]"></div>
      </div>
      {/* Loading Text */}
      <p className="mt-4 text-lg font-semibold text-white animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default Loader;