import { useState, useEffect } from "react";

export function ModernNoData() {
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Animated geometric shapes */}
      <div className="relative mb-8">
        <div className="w-32 h-32 relative">
          {/* Rotating outer ring */}
          <div
            className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin"
            style={{ animationDuration: "8s" }}
          />

          {/* Pulsing inner circles */}
          <div className="absolute inset-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse" />
          <div
            className="absolute inset-8 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />

          {/* Floating dots */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-blue-500 rounded-full animate-ping"
              style={{
                top: `${20 + Math.sin((i * Math.PI) / 3) * 40}px`,
                left: `${20 + Math.cos((i * Math.PI) / 3) * 40}px`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Dynamic text content */}
      <div className="space-y-4 max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 animate-fade-in">
          {currentPhase === 0 && "Ma'lumotlar mavjuda emas"}
        </h2>
      </div>

      {/* Animated wave pattern */}
      <div className="mt-12 w-full max-w-lg overflow-hidden">
        <svg viewBox="0 0 400 60" className="w-full h-16 opacity-30">
          <path
            d="M0,30 Q100,10 200,30 T400,30"
            stroke="url(#gradient)"
            strokeWidth="3"
            fill="none"
            className="animate-draw-line"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes draw-line {
          0% {
            stroke-dasharray: 0 1000;
          }
          100% {
            stroke-dasharray: 1000 0;
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out 0.3s both;
        }

        .animate-draw-line {
          animation: draw-line 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
