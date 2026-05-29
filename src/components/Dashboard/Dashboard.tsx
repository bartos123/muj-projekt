import Matrix from './Matrix';
import { DashboardData } from '../../types/portfolio';

const Dashboard = ({
    stats,
    celkovyZisk,
    ziskProcento,
    watchlist,
    matrixData,
    hovered,
    setHovered,
    chart
}: DashboardData) => {
const activeAsset = chart.find(a => a.symbol === hovered);

    return (
                
        <div className="col-span-full grid grid-cols-1 lg:grid-cols-4 border-2 border-black bg-black gap-0.5 mb-12">
        
        
        {/*LEVÝ PANEL*/}
        <div className="p-8 flex flex-col justify-center  bg-white">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40 mb-2">
            Portfolio Capital
          </div>
          <div className="text-6xl font-black text-black tracking-tighter leading-none mb-4">
            ${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-2 py-1 text-[10px] font-black text-white uppercase ${celkovyZisk} bg-black`}>
              {celkovyZisk >= 0 ? 'Profit' : 'Loss'}
            </div>
            <div className="text-sm font-black text-black uppercase tracking-widest">
              {celkovyZisk !== 0 && `${celkovyZisk > 0 ? '▲' : '▼'} ${ziskProcento.toFixed(2)}%`}
            </div>
          </div>
        </div>
          
        {/*PRAVÝ PANEL: MATRIX */}
        <div className="lg:col-span-3 flex flex-col bg-black gap-0.5">
            <div className="flex-1 bg-white">
                {watchlist.length > 0 ? (
                    <Matrix assets={matrixData} onHoverChange={setHovered} />
                        ) : (
                    <div className="h-full flex items-center justify-center p-20 text-black/20 font-black uppercase tracking-widest">
              No Data for Matrix
            </div>
          )}
        </div>

        {/*LEGENDA POD MATRIXEM*/}
            <div className=" pl-2 font-mono text-[12px] uppercase tracking-[0.2em] text-black bg-white">
            <div className="flex gap-6">
                <div className="flex flex-col">
                    <span className="opacity-50">Active Asset</span>
                    <span className="font-bold">
                        {hovered ? (hovered === '+' ? 'Diversified Others: '+ chart.filter(a => a.percentage < 5).map(a => `${a.symbol} (${a.percentage.toFixed(2)}%)`).join(',  ') : hovered) : '\u00A0'}
                    </span>
                </div>

                
                {hovered && hovered !== '+' && activeAsset && (
                  <>
                <div className="flex flex-col">
                    <span className="opacity-50">Price</span>
                    <span className="font-bold">${activeAsset.price.toFixed(2)}</span>
                </div>

                <div className="flex flex-col">
                    <span className="opacity-50">Position Value</span>
                    <span className="font-bold">${(activeAsset.price * (watchlist.find(a => a.symbol === hovered)?.shares || 0)).toFixed(2)}  </span>
                </div>
                <div className="flex flex-col">
                    <span className="opacity-50">Day Delta</span>
                    <span className="font-bold">{activeAsset.delta.toFixed(2)}%
                   </span>
                </div>
                <div className="flex flex-col">
                    <span className="opacity-50">Profit</span>
                    <span className="font-bold">{activeAsset.yield.toFixed(2)}%
                   </span>
                </div>
                </>
                )}
                


            </div>
        </div>
    </div>
    </div>);
};

export default Dashboard;