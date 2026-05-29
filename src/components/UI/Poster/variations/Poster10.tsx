import { DigitalClock } from "../../Clock";

export const Poster = ({ isMarketOpen }: any) => {

  return (
    <section className="h-screen w-full bg-black text-white p-6 md:p-12 flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-1000">
      
      <div className="flex-1 flex flex-col justify-start space-y-[4vh] mt-[5vh]">
        
        <div className="flex justify-between w-full font-bold text-[1.5vw] uppercase tracking-[0.2em]">
          {"asset management system".split("").map((l, i) => <span key={i}>{l}</span>)}
        </div>

        <div className="flex justify-between w-full font-bold text-[1.5vw] uppercase opacity-80">
          {"asset m n gement sy tem".split("").map((l, i) => <span key={i}>{l === " " ? "\u00A0" : l}</span>)}
        </div>

        <div className="flex justify-between w-full font-bold text-[1.5vw] uppercase opacity-60">
          {"a s t   m a n a g e m e n t".split("").map((l, i) => <span key={i}>{l}</span>)}
        </div>

        <div className="flex justify-between w-full font-bold text-[1.5vw] uppercase opacity-40">
          {"s s e t               s y s t e m".split("").map((l, i) => <span key={i}>{l}</span>)}
        </div>

        <div className="flex justify-between w-full font-bold text-[1.5vw] uppercase opacity-20">
          {"a                         m".split("").map((l, i) => <span key={i}>{l}</span>)}
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4 mb-[10vh]">
        <div className="font-bold text-[2vw] uppercase tracking-[2em] translate-x-[1em]">
          asset management system
        </div>
        <div className="font-bold text-[3vw] uppercase tracking-[1em] translate-x-[0.5em]">
          asset management system
        </div>
        <div className="font-bold text-[4vw] uppercase tracking-[0.1em] leading-none">
          asset management system
        </div>
      </div>

      <div className="w-full border-t border-white/20 pt-4 flex justify-between items-end font-mono text-[9px] uppercase tracking-[0.3em]">
        <div className="flex gap-8">
          <span>AMS TERMINAL V.2.0</span>
          <span>BUILD 2026 MAY 05</span>
        </div>
        <div className="flex gap-12 items-end">
          <div className="text-right">
            <div className="text-[12px] font-bold"><DigitalClock /></div>
            <div className="opacity-40 text-[7px]">System Time</div>
          </div>
          <div className="text-right">
            <div className="text-[12px] font-bold">{isMarketOpen ? "ACTIVE" : "SUSPENDED"}</div>
          </div>
        </div>
      </div>

      <div className="fixed inset-4 border border-white/5 pointer-events-none" />
    </section>
  );
};