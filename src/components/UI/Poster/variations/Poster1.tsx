import { DigitalClock } from "../../Clock";

export const Poster = () => {
  return (
    <section className="h-screen w-full bg-white text-black flex flex-col overflow-hidden select-none relative animate-in fade-in duration-1000">
      <div className="flex-1 w-full bg-black flex justify-between items-stretch px-[10%] pt-20">
        {Array.from({ length: 60 }).map((_, i) => (
          <div 
            key={i} 
            className="w-[1px] bg-white opacity-40 h-full"
            style={{ 
              height: `${70 + Math.sin(i * 0.5) * 30}%`,
              alignSelf: 'flex-end'
            }} 
          />
        ))}
      </div>
      <div className="flex-1 w-full bg-white flex justify-between items-stretch px-[10%] pb-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i} 
            className="w-[2px] bg-black h-full opacity-100"
            style={{ 
              height: `${100 - (i % 3) * 10}%`
            }} 
          />
        ))}
      </div>
      <div className="absolute top-1/2 left-[10%] -translate-y-1/2 z-50">
        <div className="bg-black text-white p-6 max-w-[300px] space-y-4 shadow-[20px_20px_0px_0px_rgba(255,255,255,1),21px_21px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-2xl font-black italic uppercase leading-[0.9] tracking-tighter">
            Asset<br />Management<br />System
          </h1>
          <div className="pt-4 flex justify-between items-end">
            <div className="font-mono text-[10px] font-bold">
              <DigitalClock />
            </div>
            <div className="w-4 h-4 bg-white" />
          </div>
        </div>
      </div>
      <div className="absolute top-12 left-12 font-mono text-[8px] uppercase tracking-[1em] vertical-text opacity-30">
        Data_Stream_Inquiry
      </div>
      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </section>
  );
};