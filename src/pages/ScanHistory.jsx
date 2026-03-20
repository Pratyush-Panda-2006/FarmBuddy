import { Search } from 'lucide-react';

export default function ScanHistory() {
  return (
    <>
      <div className="bg-charcoal p-6 pt-10 rounded-b-[20px] shadow-lg mb-4 -mx-5 -mt-5">
        <h2 className="text-white font-black text-2xl mb-4 tracking-tighter">Scan History</h2>
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
          <input type="text" placeholder="Search past scans" className="w-full bg-white/10 h-11 rounded-xl pl-11 pr-4 text-xs font-bold text-white placeholder-white/30 outline-none border border-white/5" />
        </div>
        <div className="flex gap-2 overflow-x-auto custom-scroll pb-2">
            <span className="bg-white text-charcoal px-4 py-2 rounded-lg text-[10px] font-black uppercase whitespace-nowrap shadow-md">All Time</span>
            <span className="bg-white/10 text-white/60 px-4 py-2 rounded-lg text-[10px] font-black uppercase whitespace-nowrap border border-white/5">This Week</span>
            <span className="bg-white/10 text-white/60 px-4 py-2 rounded-lg text-[10px] font-black uppercase whitespace-nowrap border border-white/5">Critical Only</span>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <div className="flex justify-between items-center mb-3 border-b border-sage/10 pb-2">
            <p className="text-sage font-bold text-[9px] uppercase tracking-widest">Today, Oct 14</p>
            <p className="text-charcoal font-black text-[10px]">2 Scans</p>
          </div>
          <div className="space-y-2">
            <div className="bg-white p-3.5 rounded-[12px] flex items-center justify-between border border-sage/10 shadow-sm cursor-pointer hover:border-charcoal transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-offWhite rounded-lg flex items-center justify-center text-lg">🍅</div>
                <div>
                  <p className="text-charcoal font-extrabold text-sm">Tomato Plant</p>
                  <p className="text-sage text-[9px] font-bold uppercase tracking-tight">12:45 PM &bull; Early Blight</p>
                </div>
              </div>
              <p className="text-coralRed font-black text-xs uppercase bg-coralRed/10 px-2 py-1 rounded">Moderate</p>
            </div>
            <div className="bg-white p-3.5 rounded-[12px] flex items-center justify-between border border-sage/10 shadow-sm cursor-pointer hover:border-charcoal transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-offWhite rounded-lg flex items-center justify-center text-lg">🐄</div>
                <div>
                  <p className="text-charcoal font-extrabold text-sm">Cow (Angus)</p>
                  <p className="text-sage text-[9px] font-bold uppercase tracking-tight">09:20 AM &bull; Healthy</p>
                </div>
              </div>
              <p className="text-teal font-black text-xs uppercase bg-teal/10 px-2 py-1 rounded">Healthy</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-3 border-b border-sage/10 pb-2">
            <p className="text-sage font-bold text-[9px] uppercase tracking-widest">Yesterday, Oct 13</p>
            <p className="text-charcoal font-black text-[10px]">1 Scan</p>
          </div>
          <div className="bg-white p-3.5 rounded-[12px] flex items-center justify-between border border-sage/10 shadow-sm cursor-pointer hover:border-charcoal transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-offWhite rounded-lg flex items-center justify-center text-lg">🌽</div>
                <div>
                  <p className="text-charcoal font-extrabold text-sm">Corn Field C</p>
                  <p className="text-sage text-[9px] font-bold uppercase tracking-tight">06:15 PM &bull; Nitrogen Def.</p>
                </div>
              </div>
              <p className="text-coralRed font-black text-xs uppercase bg-coralRed/10 px-2 py-1 rounded">Critical</p>
            </div>
        </section>
      </div>
    </>
  );
}
