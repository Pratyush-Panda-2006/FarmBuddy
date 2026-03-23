import { useState, useEffect } from 'react';
import { TrendingUp, Milk, Weight, Wheat, AlertTriangle, Sparkles, Plus, Trash2, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getTranslation } from '../utils/i18n';

const STORAGE_KEYS = {
  MILK_YIELD: 'farmbuddy_milk_yield',
  CROP_YIELD: 'farmbuddy_crop_yield',
  WEIGHT: 'farmbuddy_weight_log',
  GROWTH: 'farmbuddy_growth_log',
};

function MiniBarChart({ data, maxVal, color = '#2ec4b6', label = '' }) {
  const max = maxVal || Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-32 mt-3">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <span className="text-[8px] font-black text-charcoal">{d.value}</span>
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{
              height: `${Math.max((d.value / max) * 100, 4)}%`,
              background: color,
              opacity: 0.7 + (i / data.length) * 0.3,
            }}
          />
          <span className="text-[7px] font-bold text-sage truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const t = getTranslation;
  const [scans, setScans] = useState([]);
  const [milkLog, setMilkLog] = useState([]);
  const [cropYieldLog, setCropYieldLog] = useState([]);
  const [weightLog, setWeightLog] = useState([]);
  const [growthLog, setGrowthLog] = useState([]);
  const [milkInput, setMilkInput] = useState('');
  const [milkAnimal, setMilkAnimal] = useState('');
  const [cropInput, setCropInput] = useState('');
  const [cropName, setCropName] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [weightAnimal, setWeightAnimal] = useState('');
  const [growthInput, setGrowthInput] = useState('');
  const [growthCrop, setGrowthCrop] = useState('');
  const [feedPlan, setFeedPlan] = useState('');
  const [fertilizerPlan, setFertilizerPlan] = useState('');
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [loadingFertilizer, setLoadingFertilizer] = useState(false);
  const [activeTab, setActiveTab] = useState('livestock');

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('smartAgHistory') || '[]');
    setScans(history);
    setMilkLog(JSON.parse(localStorage.getItem(STORAGE_KEYS.MILK_YIELD) || '[]'));
    setCropYieldLog(JSON.parse(localStorage.getItem(STORAGE_KEYS.CROP_YIELD) || '[]'));
    setWeightLog(JSON.parse(localStorage.getItem(STORAGE_KEYS.WEIGHT) || '[]'));
    setGrowthLog(JSON.parse(localStorage.getItem(STORAGE_KEYS.GROWTH) || '[]'));
  }, []);

  // Stats
  const livestockScans = scans.filter(s => s.type === 'Livestock');
  const cropScans = scans.filter(s => s.type === 'Crop');
  const criticalAlerts = scans.filter(s => s.severity === 'Critical').length;
  const avgHealth = scans.length > 0 ? Math.round(scans.reduce((a, s) => a + (s.healthPercentage || 0), 0) / scans.length) : 100;
  const uniqueBreeds = [...new Set(livestockScans.map(s => s.identity))];
  const uniqueCrops = [...new Set(cropScans.map(s => s.identity))];

  // Helpers
  const addMilkEntry = () => {
    if (!milkInput || isNaN(milkInput)) return;
    const entry = { value: parseFloat(milkInput), animal: milkAnimal || 'General', date: new Date().toLocaleDateString(), label: new Date().toLocaleDateString('en', { day: '2-digit', month: 'short' }) };
    const updated = [entry, ...milkLog].slice(0, 30);
    setMilkLog(updated);
    localStorage.setItem(STORAGE_KEYS.MILK_YIELD, JSON.stringify(updated));
    setMilkInput(''); setMilkAnimal('');
  };

  const addCropYieldEntry = () => {
    if (!cropInput || isNaN(cropInput)) return;
    const entry = { value: parseFloat(cropInput), crop: cropName || 'General', date: new Date().toLocaleDateString(), label: new Date().toLocaleDateString('en', { day: '2-digit', month: 'short' }) };
    const updated = [entry, ...cropYieldLog].slice(0, 30);
    setCropYieldLog(updated);
    localStorage.setItem(STORAGE_KEYS.CROP_YIELD, JSON.stringify(updated));
    setCropInput(''); setCropName('');
  };

  const addWeightEntry = () => {
    if (!weightInput || isNaN(weightInput)) return;
    const entry = { value: parseFloat(weightInput), animal: weightAnimal || 'General', date: new Date().toLocaleDateString(), label: new Date().toLocaleDateString('en', { day: '2-digit', month: 'short' }) };
    const updated = [entry, ...weightLog].slice(0, 30);
    setWeightLog(updated);
    localStorage.setItem(STORAGE_KEYS.WEIGHT, JSON.stringify(updated));
    setWeightInput(''); setWeightAnimal('');
  };

  const addGrowthEntry = () => {
    if (!growthInput || isNaN(growthInput)) return;
    const entry = { value: parseFloat(growthInput), crop: growthCrop || 'General', date: new Date().toLocaleDateString(), label: new Date().toLocaleDateString('en', { day: '2-digit', month: 'short' }) };
    const updated = [entry, ...growthLog].slice(0, 30);
    setGrowthLog(updated);
    localStorage.setItem(STORAGE_KEYS.GROWTH, JSON.stringify(updated));
    setGrowthInput(''); setGrowthCrop('');
  };

  const clearLog = (key, setter) => {
    localStorage.removeItem(key);
    setter([]);
  };

  // AI Feed / Fertilizer optimizer
  const getAIPlan = async (type) => {
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!apiKey) { alert('Please set your Gemini API key in Settings first.'); return; }

    const isLivestock = type === 'feed';
    if (isLivestock) setLoadingFeed(true); else setLoadingFertilizer(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const userLang = localStorage.getItem('SMART_AG_LANG') || 'English';

      let prompt = '';
      if (isLivestock) {
        const breedList = uniqueBreeds.join(', ') || 'General cattle';
        const recentMilk = milkLog.slice(0, 7).map(m => `${m.date}: ${m.value}L (${m.animal})`).join(', ') || 'No data';
        const recentWeight = weightLog.slice(0, 7).map(w => `${w.date}: ${w.value}kg (${w.animal})`).join(', ') || 'No data';
        prompt = `You are an expert veterinary nutritionist. Based on this farm data:
        - Livestock breeds: ${breedList}
        - Recent milk yield (last 7 entries): ${recentMilk}
        - Recent weight log (last 7 entries): ${recentWeight}
        - Average health score: ${avgHealth}%
        
        Provide a structured, practical daily feeding schedule optimized for maximum yield and health. 
        Include specific feed types, quantities, timing, and any supplements. 
        Format with clear sections. Respond in ${userLang}.`;
      } else {
        const cropList = uniqueCrops.join(', ') || 'General crops';
        const recentYield = cropYieldLog.slice(0, 7).map(c => `${c.date}: ${c.value}kg (${c.crop})`).join(', ') || 'No data';
        const recentGrowth = growthLog.slice(0, 7).map(g => `${g.date}: ${g.value}cm (${g.crop})`).join(', ') || 'No data';
        prompt = `You are an expert agronomist. Based on this farm data:
        - Crops: ${cropList}
        - Recent yield (last 7 entries): ${recentYield}
        - Recent growth log (last 7 entries): ${recentGrowth}
        - Average health score: ${avgHealth}%
        
        Provide a structured, practical fertilizer and care schedule optimized for maximum yield and plant health.
        Include specific fertilizer types, quantities, application timing, irrigation tips, and pest prevention.
        Format with clear sections. Respond in ${userLang}.`;
      }

      const modelNames = ['gemini-2.5-flash', 'gemini-1.5-flash'];
      let responseText = '';
      for (const modelName of modelNames) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const res = await model.generateContent(prompt);
          responseText = res.response.text();
          break;
        } catch (e) { console.warn(`${modelName} failed`, e); }
      }

      if (isLivestock) setFeedPlan(responseText);
      else setFertilizerPlan(responseText);
    } catch (err) {
      console.error('AI Plan error:', err);
      alert('Failed to generate plan. Check your API key and connection.');
    } finally {
      if (isLivestock) setLoadingFeed(false); else setLoadingFertilizer(false);
    }
  };

  const chartData = (log) => [...log].reverse().slice(-7);

  return (
    <>
      <header className="mb-6 mt-2">
        <h2 className="text-charcoal dark:text-white font-black text-2xl tracking-tighter">{t("Dashboard")}</h2>
        <p className="text-sage font-semibold text-xs mt-1">{t("Predictive Health & Yield Analytics")}</p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <div className="bg-charcoal rounded-2xl p-3 text-center text-white">
          <p className="text-[8px] font-bold uppercase tracking-widest text-white/50">Livestock</p>
          <p className="text-xl font-black">{livestockScans.length}</p>
        </div>
        <div className="bg-charcoal rounded-2xl p-3 text-center text-white">
          <p className="text-[8px] font-bold uppercase tracking-widest text-white/50">Crops</p>
          <p className="text-xl font-black">{cropScans.length}</p>
        </div>
        <div className="bg-charcoal rounded-2xl p-3 text-center text-white">
          <p className="text-[8px] font-bold uppercase tracking-widest text-white/50">Avg HP</p>
          <p className={`text-xl font-black ${avgHealth >= 80 ? 'text-teal' : avgHealth >= 50 ? 'text-amber-400' : 'text-coralRed'}`}>{avgHealth}%</p>
        </div>
        <div className="bg-coralRed/10 rounded-2xl p-3 text-center border border-coralRed/20">
          <p className="text-[8px] font-bold uppercase tracking-widest text-coralRed/60">Alerts</p>
          <p className="text-xl font-black text-coralRed">{criticalAlerts}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('livestock')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'livestock' ? 'bg-charcoal text-white shadow-lg' : 'bg-white dark:bg-charcoal/40 text-charcoal dark:text-white/70 border border-sage/20 dark:border-white/10'}`}>
          🐄 Livestock
        </button>
        <button onClick={() => setActiveTab('crops')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'crops' ? 'bg-charcoal text-white shadow-lg' : 'bg-white dark:bg-charcoal/40 text-charcoal dark:text-white/70 border border-sage/20 dark:border-white/10'}`}>
          🌾 Crops
        </button>
      </div>

      {activeTab === 'livestock' ? (
        <div className="space-y-4 pb-28">
          {/* Breed Registry */}
          {uniqueBreeds.length > 0 && (
            <div className="bg-white dark:bg-charcoal/60 rounded-[20px] p-5 border border-sage/10 dark:border-white/10 shadow-sm">
              <p className="text-[10px] text-sage font-bold uppercase tracking-widest mb-3">Detected Breeds</p>
              <div className="flex flex-wrap gap-2">
                {uniqueBreeds.map((b, i) => (
                  <span key={i} className="bg-charcoal text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">{b}</span>
                ))}
              </div>
            </div>
          )}

          {/* Milk Yield Tracker */}
          <div className="bg-white dark:bg-charcoal/60 rounded-[20px] p-5 border border-sage/10 dark:border-white/10 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Milk className="w-4 h-4 text-teal" />
                <p className="text-[10px] text-sage font-bold uppercase tracking-widest">Milk Yield (Litres)</p>
              </div>
              {milkLog.length > 0 && (
                <button onClick={() => clearLog(STORAGE_KEYS.MILK_YIELD, setMilkLog)} className="text-coralRed"><Trash2 className="w-3.5 h-3.5" /></button>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <input value={milkAnimal} onChange={e => setMilkAnimal(e.target.value)} placeholder="Animal" className="flex-1 bg-offWhite dark:bg-white/10 h-10 rounded-xl px-3 text-xs font-bold text-charcoal dark:text-white placeholder-sage/50 outline-none border border-sage/20 dark:border-white/10 focus:border-teal transition-colors" />
              <input value={milkInput} onChange={e => setMilkInput(e.target.value)} placeholder="Litres" type="number" className="w-20 bg-offWhite dark:bg-white/10 h-10 rounded-xl px-3 text-xs font-bold text-charcoal dark:text-white placeholder-sage/50 outline-none border border-sage/20 dark:border-white/10 focus:border-teal transition-colors" />
              <button onClick={addMilkEntry} className="h-10 w-10 bg-teal rounded-xl flex items-center justify-center text-white shrink-0 active:scale-90 transition-transform"><Plus className="w-5 h-5" /></button>
            </div>
            {milkLog.length > 0 && <MiniBarChart data={chartData(milkLog)} color="#2ec4b6" />}
          </div>

          {/* Weight Tracker */}
          <div className="bg-white rounded-[20px] p-5 border border-sage/10 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Weight className="w-4 h-4 text-amber-500" />
                <p className="text-[10px] text-sage font-bold uppercase tracking-widest">Weight Log (kg)</p>
              </div>
              {weightLog.length > 0 && (
                <button onClick={() => clearLog(STORAGE_KEYS.WEIGHT, setWeightLog)} className="text-coralRed"><Trash2 className="w-3.5 h-3.5" /></button>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <input value={weightAnimal} onChange={e => setWeightAnimal(e.target.value)} placeholder="Animal" className="flex-1 bg-offWhite dark:bg-white/10 h-10 rounded-xl px-3 text-xs font-bold text-charcoal dark:text-white placeholder-sage/50 outline-none border border-sage/20 dark:border-white/10 focus:border-teal transition-colors" />
              <input value={weightInput} onChange={e => setWeightInput(e.target.value)} placeholder="Kg" type="number" className="w-20 bg-offWhite dark:bg-white/10 h-10 rounded-xl px-3 text-xs font-bold text-charcoal dark:text-white placeholder-sage/50 outline-none border border-sage/20 dark:border-white/10 focus:border-teal transition-colors" />
              <button onClick={addWeightEntry} className="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shrink-0 active:scale-90 transition-transform"><Plus className="w-5 h-5" /></button>
            </div>
            {weightLog.length > 0 && <MiniBarChart data={chartData(weightLog)} color="#f59e0b" />}
          </div>

          {/* AI Feed Optimizer */}
          <div className="bg-gradient-to-br from-charcoal to-[#2A332E] rounded-[20px] p-5 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-teal" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">AI Feed Optimizer</p>
            </div>
            <p className="text-white/40 text-[10px] mb-4">Analyzes your logged data and scanned breeds to generate an optimal feeding schedule.</p>
            <button onClick={() => getAIPlan('feed')} disabled={loadingFeed} className="w-full bg-teal/20 border border-teal/30 text-teal font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {loadingFeed ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Feed Plan</>}
            </button>
            {feedPlan && (
              <div className="mt-4 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-teal mb-2">Recommended Plan</p>
                <div className="text-white/80 text-xs font-semibold leading-relaxed whitespace-pre-wrap">{feedPlan}</div>
              </div>
            )}
          </div>

          {/* Health Trend */}
          {livestockScans.length > 0 && (
            <div className="bg-white rounded-[20px] p-5 border border-sage/10 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-teal" />
                <p className="text-[10px] text-sage font-bold uppercase tracking-widest">Livestock Health Trend</p>
              </div>
              <MiniBarChart
                data={[...livestockScans].reverse().slice(-7).map(s => ({ value: s.healthPercentage || 0, label: s.identity?.slice(0, 6) || '?' }))}
                maxVal={100}
                color="#2ec4b6"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 pb-28">
          {/* Crop Registry */}  
          {uniqueCrops.length > 0 && (
            <div className="bg-white rounded-[20px] p-5 border border-sage/10 shadow-sm">
              <p className="text-[10px] text-sage font-bold uppercase tracking-widest mb-3">Detected Crops</p>
              <div className="flex flex-wrap gap-2">
                {uniqueCrops.map((c, i) => (
                  <span key={i} className="bg-teal text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Crop Yield Tracker */}
          <div className="bg-white rounded-[20px] p-5 border border-sage/10 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Wheat className="w-4 h-4 text-teal" />
                <p className="text-[10px] text-sage font-bold uppercase tracking-widest">Crop Yield (kg)</p>
              </div>
              {cropYieldLog.length > 0 && (
                <button onClick={() => clearLog(STORAGE_KEYS.CROP_YIELD, setCropYieldLog)} className="text-coralRed"><Trash2 className="w-3.5 h-3.5" /></button>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <input value={cropName} onChange={e => setCropName(e.target.value)} placeholder="Crop" className="flex-1 bg-offWhite dark:bg-white/10 h-10 rounded-xl px-3 text-xs font-bold text-charcoal dark:text-white placeholder-sage/50 outline-none border border-sage/20 dark:border-white/10 focus:border-teal transition-colors" />
              <input value={cropInput} onChange={e => setCropInput(e.target.value)} placeholder="Kg" type="number" className="w-20 bg-offWhite dark:bg-white/10 h-10 rounded-xl px-3 text-xs font-bold text-charcoal dark:text-white placeholder-sage/50 outline-none border border-sage/20 dark:border-white/10 focus:border-teal transition-colors" />
              <button onClick={addCropYieldEntry} className="h-10 w-10 bg-teal rounded-xl flex items-center justify-center text-white shrink-0 active:scale-90 transition-transform"><Plus className="w-5 h-5" /></button>
            </div>
            {cropYieldLog.length > 0 && <MiniBarChart data={chartData(cropYieldLog)} color="#2ec4b6" />}
          </div>

          {/* Growth Tracker */}
          <div className="bg-white rounded-[20px] p-5 border border-sage/10 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <p className="text-[10px] text-sage font-bold uppercase tracking-widest">Growth Log (cm)</p>
              </div>
              {growthLog.length > 0 && (
                <button onClick={() => clearLog(STORAGE_KEYS.GROWTH, setGrowthLog)} className="text-coralRed"><Trash2 className="w-3.5 h-3.5" /></button>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <input value={growthCrop} onChange={e => setGrowthCrop(e.target.value)} placeholder="Crop" className="flex-1 bg-offWhite dark:bg-white/10 h-10 rounded-xl px-3 text-xs font-bold text-charcoal dark:text-white placeholder-sage/50 outline-none border border-sage/20 dark:border-white/10 focus:border-teal transition-colors" />
              <input value={growthInput} onChange={e => setGrowthInput(e.target.value)} placeholder="cm" type="number" className="w-20 bg-offWhite dark:bg-white/10 h-10 rounded-xl px-3 text-xs font-bold text-charcoal dark:text-white placeholder-sage/50 outline-none border border-sage/20 dark:border-white/10 focus:border-teal transition-colors" />
              <button onClick={addGrowthEntry} className="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shrink-0 active:scale-90 transition-transform"><Plus className="w-5 h-5" /></button>
            </div>
            {growthLog.length > 0 && <MiniBarChart data={chartData(growthLog)} color="#f59e0b" />}
          </div>

          {/* AI Fertilizer Optimizer */}
          <div className="bg-gradient-to-br from-charcoal to-[#2A332E] rounded-[20px] p-5 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-teal" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">AI Crop Optimizer</p>
            </div>
            <p className="text-white/40 text-[10px] mb-4">Analyzes your crop data, growth logs, and scan results to recommend optimal fertilizer and care schedules.</p>
            <button onClick={() => getAIPlan('fertilizer')} disabled={loadingFertilizer} className="w-full bg-teal/20 border border-teal/30 text-teal font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {loadingFertilizer ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Care Plan</>}
            </button>
            {fertilizerPlan && (
              <div className="mt-4 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-teal mb-2">Recommended Plan</p>
                <div className="text-white/80 text-xs font-semibold leading-relaxed whitespace-pre-wrap">{fertilizerPlan}</div>
              </div>
            )}
          </div>

          {/* Health Trend */}
          {cropScans.length > 0 && (
            <div className="bg-white rounded-[20px] p-5 border border-sage/10 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-teal" />
                <p className="text-[10px] text-sage font-bold uppercase tracking-widest">Crop Health Trend</p>
              </div>
              <MiniBarChart
                data={[...cropScans].reverse().slice(-7).map(s => ({ value: s.healthPercentage || 0, label: s.identity?.slice(0, 6) || '?' }))}
                maxVal={100}
                color="#2ec4b6"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
