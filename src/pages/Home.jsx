import { useState, useEffect } from 'react';
import { TrendingUp, Activity, AlertTriangle, Image as ImageIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../utils/i18n';

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [scans, setScans] = useState([]);
  const [filter, setFilter] = useState('Recent');
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('SMART_AG_USER');
    if (!user) {
      navigate('/login');
      return;
    }
    setUsername(user);
    const history = JSON.parse(localStorage.getItem('smartAgHistory') || '[]');
    setScans(history);
  }, [navigate]);

  const issuesPicked = scans.filter(s => s.severity && s.severity !== 'Healthy').length;
  const recentInsight = scans.length > 0 ? scans[0].diagnosis : "No scans yet";
  const healthScore = scans.length > 0 ? Math.round(((scans.length - issuesPicked) / scans.length) * 100) : 100;

  let healthStatus = "Good";
  let healthColor = "text-teal";
  let healthBg = "bg-teal/20";
  let healthBorder = "border-teal/20";
  let healthGlow1 = "bg-teal/10";
  let healthGlow2 = "bg-sage/10";

  if (healthScore < 50) {
    healthStatus = "Critical";
    healthColor = "text-coralRed";
    healthBg = "bg-coralRed/20";
    healthBorder = "border-coralRed/20";
    healthGlow1 = "bg-coralRed/10";
    healthGlow2 = "bg-coralRed/5";
  } else if (healthScore < 80) {
    healthStatus = "Fair";
    healthColor = "text-amber-500";
    healthBg = "bg-amber-500/20";
    healthBorder = "border-amber-500/20";
    healthGlow1 = "bg-amber-500/10";
    healthGlow2 = "bg-amber-500/5";
  }

  const getFilteredScans = () => {
    if (filter === 'Crops') return scans.filter(s => s.type === 'Crop' || s.identity?.toLowerCase().includes('plant'));
    if (filter === 'Livestock') return scans.filter(s => s.type === 'Livestock' || s.identity?.toLowerCase().includes('cow') || s.identity?.toLowerCase().includes('animal'));
    return scans;
  };

  const filteredScans = getFilteredScans();

  const t = getTranslation;

  return (
    <>
      <header className="flex justify-between items-center mb-6 mt-2">
        <div>
          <p className="text-charcoal text-sm font-black uppercase tracking-widest mb-1">{t("Welcome to FarmBuddy")}</p>
          <h1 className="text-charcoal text-3xl font-black">{username}</h1>
        </div>
        <div className="relative">
          <div className="w-11 h-11 bg-white rounded-full border border-sage/30 flex items-center justify-center text-xl">
            👨‍🌾
          </div>
          <span className="absolute top-0 right-0 w-3 h-3 bg-teal border-2 border-offWhite rounded-full"></span>
        </div>
      </header>

      {/* Main Stats Card */}
      <div className="bg-charcoal rounded-[24px] p-8 text-white mb-6 relative overflow-hidden shadow-2xl bg-gradient-to-br from-charcoal to-[#2A332E]">
        <div className={`absolute top-0 right-0 w-48 h-48 ${healthGlow1} rounded-full blur-2xl -mr-10 -mt-10 animate-pulse`}></div>
        <div className={`absolute bottom-0 right-10 w-32 h-32 ${healthGlow2} rounded-full blur-xl -mb-10 animate-pulse`} style={{ animationDelay: '1.5s' }}></div>
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-sage/80 text-sm font-bold uppercase tracking-widest mb-2">{t("Overall Health")}</p>
            <h2 className="text-[42px] sm:text-[52px] font-black tracking-tighter leading-none mb-4 bg-gradient-to-r from-white to-offWhite bg-clip-text text-transparent">{t(healthStatus)}</h2>
          </div>
          
          <div className="flex flex-col items-end shrink-0">
            <div className={`flex items-center gap-2 text-sm font-black ${healthBg} backdrop-blur-md px-4 py-3 rounded-xl border ${healthBorder} shadow-lg`}>
              <TrendingUp className={`${healthColor} w-5 h-5`} />
              <span className={healthColor}>{healthScore}% Healthy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="bento-grid mb-6">
        <div className="bg-white rounded-[20px] p-4 border border-sage/20 shadow-sm flex flex-col justify-center">
          <Activity className="text-teal w-5 h-5 mb-2" />
          <p className="text-sage text-[10px] font-bold uppercase tracking-wide">{t("Total Scans")}</p>
          <p className="text-charcoal text-lg font-extrabold">{scans.length}</p>
        </div>
        <div className="bg-white rounded-[20px] p-4 border border-sage/20 shadow-sm flex flex-col justify-center">
          <AlertTriangle className="text-coralRed w-5 h-5 mb-2" />
          <p className="text-sage text-[10px] font-bold uppercase tracking-wide">{t("Issues Picked")}</p>
          <p className="text-charcoal text-lg font-extrabold">{issuesPicked}</p>
        </div>
        <div className="bg-charcoal rounded-[20px] p-4 col-span-2 flex items-center justify-between shadow-sm text-white">
          <div className="overflow-hidden">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-wide">{t("Recent AI Insight")}</p>
            <p className="text-teal text-sm md:text-base font-extrabold truncate w-[200px] mt-1">{recentInsight}</p>
          </div>
          <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0 ml-2">
            <TrendingUp className="text-teal w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6 overflow-x-auto flex gap-2 custom-scroll -mx-5 px-5 pb-2">
        {['Recent', 'Crops', 'Livestock'].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm transition-all ${
              filter === cat ? 'bg-charcoal text-white' : 'bg-white text-charcoal border border-sage/20'
            }`}
          >
            {t(cat)}
          </button>
        ))}
      </div>

      {/* Recent Scans List */}
      <h3 className="text-charcoal font-extrabold text-xs uppercase tracking-wider mb-4">{t("Recent Scans")}</h3>

      <div className="space-y-3 pb-24">
        {filteredScans.length === 0 ? (
          <div className="text-center py-8 opacity-50">
            <p className="text-sage font-bold text-sm">No scans found.</p>
          </div>
        ) : (
          filteredScans.map((scan) => (
            <button key={scan.id} onClick={() => setSelectedScan(scan)} className="w-full bg-white p-3 rounded-[16px] flex items-center justify-between border border-sage/10 shadow-sm text-left active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3 overflow-hidden">
                {scan.image ? (
                  <img src={scan.image} alt={scan.identity} className="w-12 h-12 rounded-xl object-cover bg-offWhite border border-sage/20 shrink-0" />
                ) : (
                  <div className="w-12 h-12 bg-offWhite rounded-xl flex items-center justify-center text-sage shrink-0 border border-sage/20"><ImageIcon className="w-5 h-5"/></div>
                )}
                <div className="overflow-hidden pr-2">
                  <p className="text-charcoal font-bold text-sm truncate">{scan.identity}</p>
                  <p className="text-sage text-[9px] font-bold uppercase tracking-tight truncate">{scan.type || 'Unknown'} &bull; {scan.date}</p>
                </div>
              </div>
              <p className={`font-extrabold text-[10px] uppercase tracking-wider shrink-0 ${scan.severity === 'Healthy' ? 'text-teal' : 'text-coralRed'}`}>
                {scan.severity}
              </p>
            </button>
          ))
        )}
      </div>
      
      {/* Scan Details Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/40 backdrop-blur-sm p-4 sm:p-6 pb-0 sm:items-center">
          <div className="bg-offWhite w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[90vh] rounded-t-[30px] sm:rounded-[30px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom border border-sage/20">
            <div className="p-5 flex justify-between items-center bg-white border-b border-sage/10 shrink-0">
               <h3 className="font-extrabold text-charcoal text-lg">Scan Details</h3>
               <button onClick={() => setSelectedScan(null)} className="w-8 h-8 rounded-full bg-offWhite flex items-center justify-center text-charcoal hover:bg-sage/20 transition-colors">
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scroll">
              {selectedScan.image && (
                 <div className="w-full h-56 rounded-[20px] overflow-hidden mb-6 border border-sage/20 shadow-sm relative">
                   <img src={selectedScan.image} alt="Scanned subject" className="w-full h-full object-cover" />
                   <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                     {selectedScan.date}
                   </div>
                 </div>
              )}
              
              <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-2xl border border-sage/10 shadow-sm">
                <div className="w-14 h-14 bg-teal/10 rounded-[14px] flex items-center justify-center text-teal font-black text-xl border border-teal/20 shrink-0 shadow-[inset_0_2px_10px_rgba(46,196,182,0.1)]">
                  {selectedScan.healthPercentage || 0}%
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-sage font-bold uppercase tracking-widest truncate">Identified {selectedScan.type}</p>
                  <p className="text-charcoal font-black text-xl leading-tight truncate">{selectedScan.identity}</p>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-2xl border border-sage/10 shadow-sm mb-4 border-l-4 border-l-coralRed" style={{ borderLeftColor: selectedScan.severity === 'Healthy' ? '#2ec4b6' : '#e63946' }}>
                 <p className="text-[10px] text-sage font-bold uppercase tracking-widest mb-1">Diagnosis</p>
                 <p className="font-extrabold text-charcoal text-base">{selectedScan.diagnosis}</p>
                 <div className={`mt-3 text-[10px] px-3 py-1.5 rounded-lg inline-block font-black uppercase tracking-widest shadow-sm ${selectedScan.severity === 'Critical' ? 'bg-coralRed/10 text-coralRed border border-coralRed/20' : selectedScan.severity === 'Healthy' ? 'bg-teal/10 text-teal border border-teal/20' : 'bg-sage/20 text-charcoal border border-sage/30'}`}>
                   Severity: {selectedScan.severity}
                 </div>
              </div>
              
              <div className="bg-white p-5 rounded-2xl border border-sage/10 shadow-sm">
                <p className="text-[10px] text-sage font-bold uppercase tracking-widest mb-3">Precaution & Action Plan</p>
                <div className="text-[13px] font-semibold text-charcoal/80 leading-relaxed whitespace-pre-wrap">
                  {selectedScan.actionPlan}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
