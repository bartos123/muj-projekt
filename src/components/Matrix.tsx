import { useState } from 'react';

const Matrix = ({assets, onHoverChange}: { assets: { symbol: string; percentage: number }[], onHoverChange: (symbol: string | null) => void }) => {
    const [hovered, setHovered] = useState<string | null>(null);

    const width = 1000;
    const height = 600;

    let currentX = 0;
    let currentY = 0;
    let currentW = width;
    let currentH = height;
    

    return (
        <div className="w-full border-l-4 border-black bg-white overflow-hidden">
            <svg
                viewBox = {`0 0 ${width} ${height}`}
                className="w-full h-auto">
                {assets.map((asset, index) => {
                    const isVertical = index % 2 === 0;
                    
                    let x = currentX;
                    let y = currentY;
                    let w, h;

                    const remainingWeight = assets.slice(index).reduce((sum, a) => sum + a.percentage, 0);
                    const ratio = asset.percentage / remainingWeight;
                    
                    if (isVertical) {
                        w = currentW * ratio;
                        h = currentH;
                        currentX += w;
                        currentW -= w;
                    }
                    else {
                        w = currentW;
                        h = currentH * ratio;
                        currentY += h;
                        currentH -= h;
                    }

                    const isHovered = hovered === asset.symbol;
                    return (
                        <g key={asset.symbol}
                            onMouseEnter={() => {setHovered(asset.symbol); onHoverChange(asset.symbol)}}
                            onMouseLeave={() => {setHovered(null); onHoverChange(null)}} 
                     >
                        <rect x={x} y={y} width={w} height={h} fill={isHovered ? 'black' : 'white'} stroke="black" strokeWidth="0.5" />
                            <text
                            x={x + w/2} y={y + h/2}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={isHovered ? 'white' : 'black'}
                            className="font-black text-4xl uppercase tracking-tighter"
                            style={{ fontSize: Math.min(w, h) * 0.3 }} 
                            >
                            {asset.symbol}
                            </text>
                        




                            <text
                            x={x + w/2} y={y + h/2 + (Math.min(w, h) * 0.3 * 0.45) + 8}
                            textAnchor="middle"
                            fill={isHovered ? 'white' : 'black'}
                            dominantBaseline="middle"
                            className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-50"
                            >
                            {asset.percentage.toFixed(1)}%
                            </text>
                        
                        </g>
                    );
                    })}
                </svg>
                </div>
            );
            };
export default Matrix;
