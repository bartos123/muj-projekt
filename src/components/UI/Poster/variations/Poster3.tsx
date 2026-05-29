import { useState, useEffect } from 'react';
import { DigitalClock } from "../../Clock";

export const Poster = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const text = "ASSET MANAGEMENT SYSTEM";
  const letters = text.split("");
  const rowCount = 22; 

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <section className="h-screen w-full bg-[#050505] text-white flex flex-col justify-end items-center overflow-hidden select-none relative perspective-[1200px]">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay z-50" />
      <div className="flex-1 w-full flex flex-col justify-center items-center px-4 relative z-10">
        <div 
          className="w-full flex flex-col items-center transition-transform duration-700 ease-out will-change-transform"
          style={{ 
            transform: `rotateX(${mouse.y * -4}deg) rotateY(${mouse.x * 6}deg)` 
          }}
        >
          {Array.from({ length: rowCount }).map((_, idx) => {
            const factor = (rowCount - 1 - idx) / (rowCount - 1);
            
            const rowWidth = 28 + (Math.pow(factor, 2.2) * 72);
            
            const vStretch = 1 + (factor * 0.5);
            
            return (
              <div 
                key={idx}
                className="flex justify-between items-center whitespace-nowrap"
                style={{ 
                  width: `${rowWidth}%`,
                  opacity: Math.max(0.05, 1 - (Math.pow(factor, 1.5) * 0.95)),
                  filter: factor > 0.4 ? `blur(${factor * 2.5}px)` : 'none',
                  transform: `translateZ(${factor * 180}px)`,
                  marginBottom: '-0.35vh'
                }}
              >
                {letters.map((char, charIdx) => (
                  <span 
                    key={charIdx}
                    className="font-black uppercase italic leading-none inline-block tabular-nums transition-all duration-1000"
                    style={{ 
                      fontSize: `${1.3 + (1 - factor) * 1.5}vw`,
                      transform: `scaleY(${vStretch})`,
                      animation: `drift ${4 + charIdx * 0.2}s ease-in-out infinite alternate`
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full px-12 py-12 flex justify-between items-end border-t border-white/10 bg-black/80 backdrop-blur-2xl z-[60]">
        <div className="flex flex-col gap-2">
          <div className="font-mono text-[7px] tracking-[0.8em] uppercase text-white/30">
            A.G. FRONZONI / POSTER FOR AN EXHIBITION / 1979 - 2026
          </div>
          <div className="flex gap-6 items-baseline font-mono text-[7px] tracking-[0.4em] uppercase text-white/15">
            <span>MILANO_ITALIA</span>
            <span>SHEET_00_MASTER</span>
          </div>
        </div>

        <div className="flex items-baseline gap-12">
          <div className="hidden lg:block font-mono text-[10px] font-bold text-white/40 tabular-nums">
             <DigitalClock />
          </div>
          <div className="text-7xl font-black italic tracking-tighter leading-none hover:tracking-[-0.05em] transition-all duration-700 cursor-none">
            AMS
          </div>
        </div>
      </div>

      <style>{`
        @keyframes drift {
          from { transform: translateY(0px) scaleY(var(--v-stretch)); }
          to { transform: translateY(-4px) scaleY(var(--v-stretch)); }
        }
        .perspective-container { perspective: 1200px; }
      `}</style>
    </section>
  );
};