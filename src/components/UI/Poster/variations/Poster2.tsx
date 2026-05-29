import { DigitalClock } from "../../Clock";

export const Poster = ({ watchlistCount }: any) => {
  const bars = Array.from({ length: 12 }); 

  return (
    <section className="h-screen w-full bg-white text-black flex flex-col overflow-hidden select-none font-sans">
      <div className="flex-1 flex border-b border-black">
        {Array.from({ length: 120 }).map((_, i) => (
          <div 
            key={i} 
            className="flex-1 border-r border-black/10 last:border-0 h-full relative"
          >
            {i % 8 === 0 && (
              <div 
                className="absolute bg-black w-full" 
                style={{ 
                  bottom: 0, 
                  height: `${Math.random() * 100}%`,
                  opacity: 0.1 
                }} 
              />
            )}
          </div>
        ))}
      </div>

      <div className="relative h-48 flex items-center px-6 md:px-12 border-b-2 border-black">
        <div className="max-w-[300px] font-bold text-[11px] leading-[1.1] uppercase tracking-tighter">
          convegno<br />
          Asset Management System<br />
          v. 2.0 / Fronzoni Protocol<br />
          {new Date().getFullYear()}<br />
          {watchlistCount} aktiv v evidenci<br />
          Technical Analysis Unit
        </div>
        
        <h1 className="absolute right-6 md:right-12 text-8xl font-black italic tracking-tighter uppercase leading-none">
          AMS
        </h1>
      </div>

      <div className="flex-1 flex bg-black">
        {bars.map((_, i) => (
          <div 
            key={i} 
            className="flex-1 border-r border-white/40 last:border-0 h-full flex flex-col justify-end p-2 group hover:bg-white/10 transition-colors"
          >
            <div 
              className="w-full bg-white opacity-20" 
              style={{ height: `${20 + (i * 7) % 60}%` }}
            />
          </div>
        ))}
      </div>

      <div className="p-6 md:p-12 flex justify-between items-baseline border-t border-black bg-white">
        <div className="font-mono text-[9px] tracking-[0.5em] uppercase font-bold">
          A.G. Fronzoni / Graphic Construction for Asset Management
        </div>
        <div className="font-mono text-xl font-black tabular-nums">
          <DigitalClock />
        </div>
      </div>

    </section>
  );
};