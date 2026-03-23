import { useState, useEffect } from 'react';
import { TrendingUp, Activity, AlertTriangle, Image as ImageIcon, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../utils/i18n';
import ExportShare from '../components/ExportShare';

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
  const recentInsight = scans.length > 0 ? scans[0].diagnosis : getTranslation("No scans yet");
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
    if (filter === 'Crops') return scans.filter(s => s.type === 'Crop');
    if (filter === 'Livestock') return scans.filter(s => s.type === 'Livestock');
    return scans;
  };

  const filteredScans = getFilteredScans();
  const t = getTranslation;

  // Delete a single scan
  const deleteScan = (scanId, e) => {
    e?.stopPropagation();
    const updated = scans.filter(s => s.id !== scanId);
    setScans(updated);
    localStorage.setItem('smartAgHistory', JSON.stringify(updated));
    if (selectedScan?.id === scanId) setSelectedScan(null);
  };

  // Clear all scans
  const clearAllScans = () => {
    if (!window.confirm(t('Are you sure you want to delete all scans?'))) return;
    setScans([]);
    localStorage.setItem('smartAgHistory', '[]');
  };

  return (
    <>
      <header className="flex justify-between items-center mb-4 sm:mb-6 mt-2">
        <div>
          <p className="text-charcoal dark:text-white/60 text-xs sm:text-sm font-black uppercase tracking-widest mb-1">{t("Welcome to FarmBuddy")}</p>
          <h1 className="text-charcoal dark:text-white text-2xl sm:text-3xl font-black">{username}</h1>
        </div>
        <div className="relative">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white dark:bg-charcoal/60 rounded-full border border-sage/30 dark:border-white/10 flex items-center justify-center text-lg sm:text-xl">
            👨‍🌾
          </div>
          <span className="absolute top-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-teal border-2 border-offWhite dark:border-[#0d1210] rounded-full"></span>
        </div>
      </header>

      {/* Main Stats Card */}
      <div className="bg-charcoal rounded-[20px] sm:rounded-[24px] p-5 sm:p-8 text-white mb-4 sm:mb-6 relative overflow-hidden shadow-2xl bg-gradient-to-br from-charcoal to-[#2A332E]">
        <div className={`absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 ${healthGlow1} rounded-full blur-2xl -mr-10 -mt-10 animate-pulse`}></div>
        <div className={`absolute bottom-0 right-10 w-24 sm:w-32 h-24 sm:h-32 ${healthGlow2} rounded-full blur-xl -mb-10 animate-pulse`} style={{ animationDelay: '1.5s' }}></div>
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-sage/80 text-xs sm:text-sm font-bold uppercase tracking-widest mb-1 sm:mb-2">{t("Overall Health")}</p>
            <h2 className="text-[36px] sm:text-[42px] md:text-[52px] font-black tracking-tighter leading-none mb-2 sm:mb-4 bg-gradient-to-r from-white to-offWhite bg-clip-text text-transparent">{t(healthStatus)}</h2>
          </div>
          
          <div className="flex flex-col items-end shrink-0">
            <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-black ${healthBg} backdrop-blur-md px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${healthBorder} shadow-lg`}>
              <TrendingUp className={`${healthColor} w-4 h-4 sm:w-5 sm:h-5`} />
              <span className={healthColor}>{healthScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="bento-grid mb-4 sm:mb-6">
        <div className="bg-white dark:bg-charcoal/60 rounded-2xl p-3 sm:p-4 border border-sage/20 dark:border-white/10 shadow-sm flex flex-col justify-center">
          <Activity className="text-teal w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2" />
          <p className="text-sage text-[9px] sm:text-[10px] font-bold uppercase tracking-wide">{t("Total Scans")}</p>
          <p className="text-charcoal dark:text-white text-base sm:text-lg font-extrabold">{scans.length}</p>
        </div>
        <div className="bg-white dark:bg-charcoal/60 rounded-2xl p-3 sm:p-4 border border-sage/20 dark:border-white/10 shadow-sm flex flex-col justify-center">
          <AlertTriangle className="text-coralRed w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2" />
          <p className="text-sage text-[9px] sm:text-[10px] font-bold uppercase tracking-wide">{t("Issues Picked")}</p>
          <p className="text-charcoal dark:text-white text-base sm:text-lg font-extrabold">{issuesPicked}</p>
        </div>
        <div className="bg-charcoal rounded-2xl p-3 sm:p-4 col-span-2 flex items-center justify-between shadow-sm text-white">
          <div className="overflow-hidden">
            <p className="text-white/40 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide">{t("Recent AI Insight")}</p>
            <p className="text-teal text-xs sm:text-sm md:text-base font-extrabold truncate max-w-[180px] sm:max-w-[250px] mt-1">{recentInsight}</p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0 ml-2">
            <TrendingUp className="text-teal w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Categories + Clear All */}
      <div className="flex items-center justify-between mb-4">
        <div className="overflow-x-auto flex gap-2 custom-scroll pb-1">
          {['Recent', 'Crops', 'Livestock'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold whitespace-nowrap shadow-sm transition-all ${
                filter === cat ? 'bg-charcoal text-white' : 'bg-white dark:bg-charcoal/40 text-charcoal dark:text-white/70 border border-sage/20 dark:border-white/10'
              }`}
            >
              {t(cat)}
            </button>
          ))}
        </div>
        {scans.length > 0 && (
          <button onClick={clearAllScans} className="text-coralRed text-[9px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ml-2 px-2 py-1 rounded-lg hover:bg-coralRed/10 transition-colors flex items-center gap-1">
            <Trash2 className="w-3 h-3" /> {t("Clear All")}
          </button>
        )}
      </div>

      {/* Recent Scans List */}
      <h3 className="text-charcoal dark:text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4">{t("Recent Scans")}</h3>

      <div className="space-y-2 sm:space-y-3 pb-24">
        {filteredScans.length === 0 ? (
          <div className="text-center py-8 opacity-50">
            <p className="text-sage font-bold text-sm">{t("No scans found.")}</p>
          </div>
        ) : (
          filteredScans.map((scan) => (
            <div key={scan.id} className="w-full bg-white dark:bg-charcoal/60 p-2.5 sm:p-3 rounded-2xl flex items-center justify-between border border-sage/10 dark:border-white/10 shadow-sm text-left">
              <button onClick={() => setSelectedScan(scan)} className="flex items-center gap-2 sm:gap-3 overflow-hidden flex-1 min-w-0 active:scale-[0.98] transition-all">
                {scan.image ? (
                  <img src={scan.image} alt={scan.identity} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover bg-offWhite border border-sage/20 dark:border-white/10 shrink-0" />
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-offWhite dark:bg-white/10 rounded-xl flex items-center justify-center text-sage shrink-0 border border-sage/20 dark:border-white/10"><ImageIcon className="w-4 h-4 sm:w-5 sm:h-5"/></div>
                )}
                <div className="overflow-hidden pr-2 min-w-0">
                  <p className="text-charcoal dark:text-white font-bold text-xs sm:text-sm truncate">{scan.identity}</p>
                  <p className="text-sage text-[8px] sm:text-[9px] font-bold uppercase tracking-tight truncate">{scan.type || 'Unknown'} &bull; {scan.date}</p>
                </div>
              </button>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <span className={`font-extrabold text-[9px] sm:text-[10px] uppercase tracking-wider ${scan.severity === 'Healthy' ? 'text-teal' : 'text-coralRed'}`}>
                  {scan.severity}
                </span>
                <button onClick={(e) => deleteScan(scan.id, e)} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-coralRed/60 hover:text-coralRed hover:bg-coralRed/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Scan Details Modal - Full screen overlay above bottom nav */}
      {selectedScan && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-charcoal/60 backdrop-blur-sm">
          <div className="bg-offWhite dark:bg-[#0d1210] w-full max-w-md h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:rounded-[30px] shadow-2xl flex flex-col overflow-hidden border-0 sm:border border-sage/20 dark:border-white/10 sm:m-4">
            {/* Fixed header */}
            <div className="p-4 sm:p-5 flex justify-between items-center bg-white dark:bg-charcoal/80 border-b border-sage/10 dark:border-white/10 shrink-0">
               <h3 className="font-extrabold text-charcoal dark:text-white text-base sm:text-lg">{t("Scan Details")}</h3>
               <div className="flex items-center gap-2">
                 <button onClick={(e) => deleteScan(selectedScan.id, e)} className="w-8 h-8 rounded-full bg-coralRed/10 flex items-center justify-center text-coralRed hover:bg-coralRed/20 transition-colors">
                   <Trash2 className="w-4 h-4" />
                 </button>
                 <button onClick={() => setSelectedScan(null)} className="w-8 h-8 rounded-full bg-offWhite dark:bg-white/10 flex items-center justify-center text-charcoal dark:text-white hover:bg-sage/20 transition-colors">
                   <X className="w-5 h-5" />
                 </button>
               </div>
            </div>
            
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto custom-scroll p-4 sm:p-6">
              {selectedScan.image && (
                 <div className="w-full h-44 sm:h-56 rounded-2xl overflow-hidden mb-4 sm:mb-6 border border-sage/20 dark:border-white/10 shadow-sm relative">
                   <img src={selectedScan.image} alt="Scanned subject" className="w-full h-full object-cover" />
                   <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white/90 dark:bg-charcoal/90 backdrop-blur text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-sm text-charcoal dark:text-white">
                     {selectedScan.date}
                   </div>
                 </div>
              )}
              
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 bg-white dark:bg-charcoal/60 p-3 sm:p-4 rounded-2xl border border-sage/10 dark:border-white/10 shadow-sm">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal/10 rounded-xl flex items-center justify-center text-teal font-black text-lg sm:text-xl border border-teal/20 shrink-0">
                  {selectedScan.healthPercentage || 0}%
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-sage font-bold uppercase tracking-widest truncate">{t("Identified")} {t(selectedScan.type)}</p>
                  <p className="text-charcoal dark:text-white font-black text-lg sm:text-xl leading-tight truncate">{selectedScan.identity}</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-charcoal/60 p-4 sm:p-5 rounded-2xl border border-sage/10 dark:border-white/10 shadow-sm mb-3 sm:mb-4 border-l-4 border-l-coralRed" style={{ borderLeftColor: selectedScan.severity === 'Healthy' ? '#2ec4b6' : '#e63946' }}>
                 <p className="text-[9px] sm:text-[10px] text-sage font-bold uppercase tracking-widest mb-1">{t("Diagnosis")}</p>
                 <p className="font-extrabold text-charcoal dark:text-white text-sm sm:text-base">{selectedScan.diagnosis}</p>
                 <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                   <div className={`text-[9px] sm:text-[10px] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg inline-block font-black uppercase tracking-widest shadow-sm ${selectedScan.severity === 'Critical' ? 'bg-coralRed/10 text-coralRed border border-coralRed/20' : selectedScan.severity === 'Healthy' ? 'bg-teal/10 text-teal border border-teal/20' : 'bg-sage/20 text-charcoal dark:text-white border border-sage/30'}`}>
                     {t("Severity")}: {selectedScan.severity}
                   </div>
                   {selectedScan.urgency && (
                     <div className={`text-[9px] sm:text-[10px] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg inline-block font-black uppercase tracking-widest shadow-sm ${selectedScan.urgency === 'Immediate' ? 'bg-coralRed/10 text-coralRed border border-coralRed/20' : selectedScan.urgency === 'Within 24h' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-teal/10 text-teal border border-teal/20'}`}>
                       🕐 {selectedScan.urgency}
                     </div>
                   )}
                 </div>
              </div>

              {selectedScan.affectedArea && (
                <div className="bg-white dark:bg-charcoal/60 p-4 sm:p-5 rounded-2xl border border-sage/10 dark:border-white/10 shadow-sm mb-3 sm:mb-4">
                  <p className="text-[9px] sm:text-[10px] text-sage font-bold uppercase tracking-widest mb-1">{t("Affected Area")}</p>
                  <p className="font-bold text-charcoal dark:text-white text-xs sm:text-sm">{selectedScan.affectedArea}</p>
                </div>
              )}

              {selectedScan.possibleConditions && selectedScan.possibleConditions.length > 0 && (
                <div className="bg-white dark:bg-charcoal/60 p-4 sm:p-5 rounded-2xl border border-sage/10 dark:border-white/10 shadow-sm mb-3 sm:mb-4">
                  <p className="text-[9px] sm:text-[10px] text-sage font-bold uppercase tracking-widest mb-2 sm:mb-3">{t("Possible Conditions")}</p>
                  <div className="space-y-1.5 sm:space-y-2">
                    {selectedScan.possibleConditions.map((cond, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-black text-white shrink-0 ${i === 0 ? 'bg-coralRed' : i === 1 ? 'bg-amber-500' : 'bg-sage'}`}>{i + 1}</span>
                        <p className="text-xs sm:text-sm font-semibold text-charcoal dark:text-white/80">{cond}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedScan.immediateCare && (
                <div className="bg-white dark:bg-charcoal/60 p-4 sm:p-5 rounded-2xl border border-sage/10 dark:border-white/10 shadow-sm mb-3 sm:mb-4 border-l-4 border-l-amber-500">
                  <p className="text-[9px] sm:text-[10px] text-sage font-bold uppercase tracking-widest mb-1">⚡ {t("Immediate Care")}</p>
                  <p className="text-xs sm:text-[13px] font-semibold text-charcoal/80 dark:text-white/70 leading-relaxed">{selectedScan.immediateCare}</p>
                </div>
              )}
              
              <div className="bg-white dark:bg-charcoal/60 p-4 sm:p-5 rounded-2xl border border-sage/10 dark:border-white/10 shadow-sm">
                <p className="text-[9px] sm:text-[10px] text-sage font-bold uppercase tracking-widest mb-2 sm:mb-3">{t("Precaution & Action Plan")}</p>
                <div className="text-xs sm:text-[13px] font-semibold text-charcoal/80 dark:text-white/70 leading-relaxed whitespace-pre-wrap">
                  {selectedScan.actionPlan}
                </div>
              </div>

              {/* Export & Share Buttons */}
              <ExportShare scan={selectedScan} />

              {/* Bottom safe area spacer for mobile */}
              <div className="h-6 sm:h-4"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
