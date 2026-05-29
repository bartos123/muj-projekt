export const Poster = () => {
  const text = "ASSET MANAGEMENT SYSTEM";
  const letters = text.split("");
  
  const rowCount = 16;
  const rows = Array.from({ length: rowCount }, (_, i) => {
    const factor = (rowCount - 1 - i) / (rowCount - 1); 
    const spread = Math.pow(factor, 2.5) * 12; 

    return {
      gap: `${spread}vw`,
      opacity: 1 - factor * 0.9, 
      fontSize: `${1.5 + (1 - factor) * 1.5}vw`, 
    };
  });

  return (
    <section className="h-screen w-full bg-black text-white flex flex-col justify-end items-center overflow-hidden select-none p-0">
      
      <div className="w-full flex flex-col items-center space-y-[-0.5vh] mb-[10vh]">
        {rows.map((row, idx) => (
          <div 
            key={idx}
            className="flex justify-center w-full transition-all duration-1000"
            style={{ opacity: row.opacity }}
          >
            {letters.map((char, charIdx) => (
              <span 
                key={charIdx}
                className="font-black uppercase italic leading-none inline-block whitespace-pre"
                style={{ 
                  margin: `0 ${row.gap}`,
                  fontSize: row.fontSize,
                  filter: idx < 5 ? `blur(${5 - idx}px)` : 'none'
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="w-full px-12 pb-12 flex justify-between items-baseline border-t-2 border-white pt-6 relative z-50 bg-black">
        <div className="text-4xl font-black italic tracking-tighter">
          AMS_V2
        </div>
      </div>

    </section>
  );
};