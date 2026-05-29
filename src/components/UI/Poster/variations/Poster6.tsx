export const Poster = () => {
  const text = "ASSET MANAGEMENT SYSTEM";
  const letters = text.split("");
  
  const rowCount = 18; 

  return (
    <section className="h-screen w-full bg-black text-white flex flex-col justify-end items-center overflow-hidden select-none">
      
      <div className="w-full flex-1 flex flex-col justify-center items-center px-4 md:px-12">
        <div className="w-full flex flex-col items-center">
          {Array.from({ length: rowCount }).map((_, idx) => {
            const factor = (rowCount - 1 - idx) / (rowCount - 1);
            
            const rowWidth = 20 + (factor * 80);
            
            return (
              <div 
                key={idx}
                className="flex justify-between items-center transition-all duration-700 ease-in-out"
                style={{ 
                  width: `${rowWidth}%`,
                  opacity: 1 - (factor * 0.8), 
                  filter: factor > 0.6 ? `blur(${factor * 2}px)` : 'none',
                  marginBottom: '-0.5vh'
                }}
              >
                {letters.map((char, charIdx) => (
                  <span 
                    key={charIdx}
                    className="font-black uppercase italic leading-none inline-block tabular-nums"
                    style={{ 
                      fontSize: `${1.2 + (1 - factor) * 1.5}vw`, 
                      transform: `scaleY(${1 + factor * 0.5})`, 
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

      <div className="w-full px-12 py-10 flex justify-between items-baseline border-t border-white/20 bg-black z-50">
        <div className="text-5xl font-black italic tracking-tighter leading-none">
          AMS
        </div>
      </div>
    </section>
  );
};