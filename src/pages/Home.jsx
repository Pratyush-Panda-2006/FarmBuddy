import { useState, useEffect } from 'react';
import { TrendingUp, Activity, AlertTriangle, Image as ImageIcon, X, Trash2, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../utils/i18n';
import { useTheme } from '../utils/ThemeContext';
import ExportShare from '../components/ExportShare';

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Pratyushhh');
  const [scans, setScans] = useState([]);
  const [filter, setFilter] = useState('Recent');
  const [selectedScan, setSelectedScan] = useState(null);
  const { dark, toggle } = useTheme();

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
      <header className="flex justify-between items-center mb-6 sm:mb-8 mt-2">
        <div>
          <p className="font-display text-goldenYellow text-xs sm:text-sm uppercase tracking-[0.2em] mb-2 drop-shadow-sm font-semibold">{t("Welcome to FarmBuddy")}</p>
          <h1 className="font-display text-charcoalDark dark:text-white text-4xl sm:text-5xl uppercase leading-none font-bold tracking-tight">{username}</h1>
        </div>
        <div className="relative">
          <button onClick={toggle} className="w-12 h-12 bg-[#f8f9fa] dark:bg-white/5 rounded-xl border border-charcoalDark/10 dark:border-white/10 flex items-center justify-center text-charcoalDark dark:text-white shadow-sm transition-colors hover:bg-charcoalDark/5 dark:hover:bg-white/10">
            {dark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Stats Card */}
      <div className="bg-charcoalDark rounded-2xl p-6 sm:p-8 text-white mb-6 relative overflow-hidden shadow-xl border border-charcoalDark/10 dark:border-white/5">
        <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full ${healthBg} blur-3xl opacity-20 pointer-events-none`}></div>
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="font-display text-white/50 text-xs sm:text-sm uppercase tracking-widest mb-2">{t("Overall Health")}</p>
            <h2 className="font-display text-5xl sm:text-6xl tracking-normal leading-[0.9] mb-2 text-white uppercase">
              {t(healthStatus)}
            </h2>
          </div>
          
          <div className="flex flex-col items-end shrink-0 pt-2">
            <div className={`flex items-center gap-2 font-display text-sm sm:text-base tracking-widest px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border ${healthBorder}`}>
              <TrendingUp className={`${healthColor} w-5 h-5`} />
              <span className={healthColor}>{healthScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
        <div className="bg-[#f8f9fa] dark:bg-white/5 rounded-xl p-4 sm:p-5 border border-charcoalDark/10 dark:border-white/10 shadow-sm flex flex-col justify-center">
          <Activity className="text-charcoalDark/40 dark:text-white/40 w-5 h-5 mb-2 sm:mb-3" />
          <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest">{t("Total Scans")}</p>
          <p className="font-display text-charcoalDark dark:text-white text-3xl sm:text-4xl mt-1">{scans.length}</p>
        </div>
        <div className="bg-[#f8f9fa] dark:bg-white/5 rounded-xl p-4 sm:p-5 border border-charcoalDark/10 dark:border-white/10 shadow-sm flex flex-col justify-center">
          <AlertTriangle className={`${issuesPicked > 0 ? 'text-coralRed' : 'text-charcoalDark/40 dark:text-white/40'} w-5 h-5 mb-2 sm:mb-3`} />
          <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest">{t("Issues Picked")}</p>
          <p className="font-display text-charcoalDark dark:text-white text-3xl sm:text-4xl mt-1">{issuesPicked}</p>
        </div>
        <div className="bg-charcoalDark rounded-xl p-4 sm:p-5 col-span-2 flex justify-between items-center shadow-sm text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-goldenYellow/5 rounded-full blur-2xl -mt-10 -mr-10"></div>
          <div className="relative z-10 w-full flex justify-between items-center">
            <div className="overflow-hidden pr-2">
              <p className="font-display text-white/50 text-[10px] uppercase tracking-widest">{t("Recent AI Insight")}</p>
              <p className="font-body text-goldenYellow font-medium text-sm sm:text-base truncate max-w-[200px] sm:max-w-[300px] mt-1">{recentInsight}</p>
            </div>
            <div className="w-10 h-10 bg-goldenYellow/10 rounded-lg flex items-center justify-center shrink-0">
              <TrendingUp className="text-goldenYellow w-5 h-5" />
            </div>
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
              className={`px-4 sm:px-5 py-2 rounded-lg font-display text-xs uppercase tracking-widest whitespace-nowrap shadow-sm transition-all border ${
                filter === cat 
                  ? 'bg-charcoalDark text-white border-charcoalDark' 
                  : 'bg-[#f8f9fa] dark:bg-white/5 text-charcoalDark/60 dark:text-white/60 border-charcoalDark/10 dark:border-white/10 hover:border-charcoalDark/30'
              }`}
            >
              {t(cat)}
            </button>
          ))}
        </div>
        {scans.length > 0 && (
          <button onClick={clearAllScans} className="text-coralRed/80 hover:text-coralRed font-display text-[10px] uppercase tracking-widest whitespace-nowrap ml-2 px-3 py-2 rounded-lg bg-coralRed/5 border border-coralRed/10 transition-colors flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" /> {t("Clear All")}
          </button>
        )}
      </div>

      {/* Recent Scans List */}
      <h3 className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-3 sm:mb-4">{t("Recent Scans")}</h3>

      <div className="space-y-3 pb-24">
        {filteredScans.length === 0 ? (
          <div className="text-center py-10 opacity-50 border border-dashed border-charcoalDark/20 dark:border-white/20 rounded-xl">
            <p className="font-display text-charcoalDark dark:text-white text-xs uppercase tracking-widest">{t("No scans found.")}</p>
          </div>
        ) : (
          filteredScans.map((scan) => (
            <div key={scan.id} className="w-full bg-[#f8f9fa] dark:bg-white/5 p-3 sm:p-4 rounded-xl flex items-center justify-between border border-charcoalDark/10 dark:border-white/10 shadow-sm text-left hover:border-charcoalDark/20 transition-colors">
              <button onClick={() => setSelectedScan(scan)} className="flex items-center gap-3 sm:gap-4 overflow-hidden flex-1 min-w-0 active:scale-[0.98] transition-all">
                {scan.image ? (
                  <img src={scan.image} alt={scan.identity} className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover bg-charcoalDark/5 border border-charcoalDark/10 shrink-0" />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-charcoalDark/5 rounded-lg flex items-center justify-center text-charcoalDark/40 shrink-0 border border-charcoalDark/10"><ImageIcon className="w-5 h-5"/></div>
                )}
                <div className="overflow-hidden pr-2 min-w-0">
                  <p className="font-display text-charcoalDark dark:text-white text-base sm:text-lg uppercase leading-tight truncate">{scan.identity}</p>
                  <p className="font-body font-medium text-charcoalDark/50 dark:text-white/50 text-xs sm:text-sm mt-0.5 truncate">{scan.type || 'Unknown'} &bull; {scan.date}</p>
                </div>
              </button>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span className={`font-display text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${scan.severity === 'Healthy' ? 'bg-teal/10 text-teal border-teal/20' : 'bg-coralRed/10 text-coralRed border-coralRed/20'}`}>
                  {scan.severity}
                </span>
                <button onClick={(e) => deleteScan(scan.id, e)} className="w-8 h-8 rounded-lg flex items-center justify-center text-charcoalDark/30 hover:text-coralRed hover:bg-coralRed/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Scan Details Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-charcoalDark/80 backdrop-blur-sm p-0 sm:p-6">
          <div className="bg-[#f8f9fa] dark:bg-charcoalDark w-full max-w-lg h-[95dvh] sm:h-[85vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-t sm:border border-charcoalDark/20 dark:border-white/10 animate-in slide-in-from-bottom-5">
            {/* Fixed header */}
            <div className="p-5 flex justify-between items-center bg-white dark:bg-white/5 border-b border-charcoalDark/10 dark:border-white/10 shrink-0">
               <h3 className="font-display text-charcoalDark dark:text-white text-xl uppercase tracking-widest">{t("Scan Details")}</h3>
               <div className="flex items-center gap-3">
                 <button onClick={(e) => deleteScan(selectedScan.id, e)} className="w-10 h-10 rounded-xl bg-coralRed/10 flex items-center justify-center text-coralRed hover:bg-coralRed/20 transition-colors">
                   <Trash2 className="w-5 h-5" />
                 </button>
                 <button onClick={() => setSelectedScan(null)} className="w-10 h-10 rounded-xl bg-charcoalDark/5 dark:bg-white/10 flex items-center justify-center text-charcoalDark dark:text-white hover:bg-charcoalDark/10 dark:hover:bg-white/20 transition-colors">
                   <X className="w-6 h-6" />
                 </button>
               </div>
            </div>
            
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto custom-scroll p-5 sm:p-6 space-y-5">
              {selectedScan.image && (
                 <div className="w-full h-56 rounded-xl overflow-hidden border border-charcoalDark/10 dark:border-white/10 shadow-sm relative">
                   <img src={selectedScan.image} alt="Scanned subject" className="w-full h-full object-cover" />
                   <div className="absolute bottom-3 right-3 bg-white dark:bg-charcoalDark font-display text-xs px-3 py-1.5 rounded-lg shadow-md text-charcoalDark dark:text-white uppercase tracking-widest">
                     {selectedScan.date}
                   </div>
                 </div>
              )}
              
              <div className="flex items-center gap-4 bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-display text-2xl border shrink-0 ${selectedScan.healthPercentage >= 80 ? 'bg-teal/10 text-teal border-teal/20' : selectedScan.healthPercentage >= 50 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-coralRed/10 text-coralRed border-coralRed/20'}`}>
                  {selectedScan.healthPercentage || 0}%
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest truncate">{t("Identified")} {t(selectedScan.type)}</p>
                  <p className="font-display text-charcoalDark dark:text-white text-2xl uppercase leading-tight truncate mt-1">{selectedScan.identity}</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm border-l-4" style={{ borderLeftColor: selectedScan.severity === 'Healthy' ? '#2ec4b6' : '#e63946' }}>
                 <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-2">{t("Diagnosis")}</p>
                 <p className="font-body font-bold text-charcoalDark dark:text-white text-base sm:text-lg">{selectedScan.diagnosis}</p>
                 <div className="flex flex-wrap gap-2 mt-4">
                   <div className={`font-display text-[10px] px-3 py-1.5 rounded-lg inline-block uppercase tracking-widest border ${selectedScan.severity === 'Critical' ? 'bg-coralRed/10 text-coralRed border-coralRed/20' : selectedScan.severity === 'Healthy' ? 'bg-teal/10 text-teal border-teal/20' : 'bg-charcoalDark/5 dark:bg-white/10 text-charcoalDark dark:text-white border-charcoalDark/10 dark:border-white/20'}`}>
                     {t("Severity")}: {selectedScan.severity}
                   </div>
                   {selectedScan.urgency && (
                     <div className={`font-display text-[10px] px-3 py-1.5 rounded-lg inline-block uppercase tracking-widest border ${selectedScan.urgency === 'Immediate' ? 'bg-coralRed/10 text-coralRed border-coralRed/20' : selectedScan.urgency === 'Within 24h' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-teal/10 text-teal border-teal/20'}`}>
                       🕐 {selectedScan.urgency}
                     </div>
                   )}
                 </div>
              </div>

              {selectedScan.affectedArea && (
                <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm">
                  <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-2">{t("Affected Area")}</p>
                  <p className="font-body font-medium text-charcoalDark dark:text-white text-sm sm:text-base">{selectedScan.affectedArea}</p>
                </div>
              )}

              {selectedScan.possibleConditions && selectedScan.possibleConditions.length > 0 && (
                <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm">
                  <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-4">{t("Possible Conditions")}</p>
                  <div className="space-y-3">
                    {selectedScan.possibleConditions.map((cond, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className={`w-6 h-6 mt-0.5 rounded-lg flex items-center justify-center font-display text-[10px] text-white shrink-0 ${i === 0 ? 'bg-coralRed' : i === 1 ? 'bg-amber-500' : 'bg-charcoalDark/40 dark:bg-white/40'}`}>{i + 1}</span>
                        <p className="font-body font-medium text-sm sm:text-base text-charcoalDark dark:text-white/90 leading-relaxed">{cond}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedScan.immediateCare && (
                <div className="bg-amber-500/5 dark:bg-amber-500/10 p-5 rounded-xl border border-amber-500/20 shadow-sm border-l-4 border-l-amber-500">
                  <p className="font-display text-amber-600 dark:text-amber-500 text-[10px] uppercase tracking-widest mb-2">⚡ {t("Immediate Care")}</p>
                  <p className="font-body font-medium text-sm sm:text-base text-charcoalDark/90 dark:text-white/90 leading-relaxed">{selectedScan.immediateCare}</p>
                </div>
              )}
              
              <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm border-t-4 border-t-goldenYellow">
                <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-4">{t("Precaution & Action Plan")}</p>
                <div className="font-body font-medium text-sm sm:text-base text-charcoalDark/90 dark:text-white/90 leading-relaxed whitespace-pre-wrap">
                  {selectedScan.actionPlan}
                </div>
              </div>

              {/* Export & Share Buttons */}
              <div className="pt-2">
                <ExportShare scan={selectedScan} />
              </div>

              {/* Bottom safe area spacer for mobile */}
              <div className="h-4 sm:h-2"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
