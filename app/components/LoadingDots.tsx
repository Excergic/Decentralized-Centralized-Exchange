// components/LoadingDots.tsx
export const LoadingDots = () => {
    return (
      <span className="flex items-center gap-2">
        <span>Swapping</span>
        <span className="flex gap-1">
          <span 
            className="w-2 h-2 bg-white rounded-full animate-bounce" 
            style={{ animationDelay: '0ms' }}
          ></span>
          <span 
            className="w-2 h-2 bg-white rounded-full animate-bounce" 
            style={{ animationDelay: '150ms' }}
          ></span>
          <span 
            className="w-2 h-2 bg-white rounded-full animate-bounce" 
            style={{ animationDelay: '300ms' }}
          ></span>
        </span>
      </span>
    );
  };
  