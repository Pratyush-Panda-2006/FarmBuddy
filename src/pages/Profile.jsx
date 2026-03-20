import { useState, useEffect } from 'react';
import { Key, Save, CheckCircle2, Languages } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export default function Profile() {
  const [apiKey, setApiKey] = useState('');
  const [language, setLanguage] = useState('English');
  const [saved, setSaved] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('GEMINI_API_KEY');
    if (storedKey) setApiKey(storedKey);
    
    const storedLang = localStorage.getItem('SMART_AG_LANG');
    if (storedLang) setLanguage(storedLang);

    if (localStorage.getItem('GEMINI_KEY_ERROR') === 'true') {
      setShowError(true);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('GEMINI_API_KEY', apiKey);
    localStorage.removeItem('GEMINI_KEY_ERROR');
    setShowError(false);
    
    const currentLang = localStorage.getItem('SMART_AG_LANG');
    if (currentLang !== language) {
      localStorage.setItem('SMART_AG_LANG', language);
      window.location.reload(); // Quick refresh to apply translation globally
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const t = getTranslation;

  return (
    <>
      <header className="mb-8 mt-2">
        <h2 className="text-charcoal font-black text-2xl tracking-tighter">{t("Settings")}</h2>
        <p className="text-sage font-semibold text-xs mt-1">{t("Configure your app preferences")}</p>
      </header>

      <div className="bg-white rounded-[20px] p-6 border border-sage/10 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center text-teal">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-charcoal font-bold text-sm">Gemini API Key</h3>
            <p className="text-sage text-[10px] uppercase font-bold tracking-widest">From Google AI Studio</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <input 
            type="password" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..." 
            className="w-full bg-offWhite h-12 rounded-xl px-4 text-sm font-bold text-charcoal placeholder-sage/50 outline-none border border-sage/20 focus:border-teal transition-colors"
          />
          {showError && (
            <p className="text-[10px] text-coralRed font-bold leading-tight">
              * Note: Do NOT use your Firebase App config API key here. It will result in a 404 error. Please generate a dedicated Gemini API key at aistudio.google.com
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-charcoal rounded-xl flex items-center justify-center text-white">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-charcoal font-bold text-sm">Language</h3>
            <p className="text-sage text-[10px] uppercase font-bold tracking-widest">App & AI Translations</p>
          </div>
        </div>

        <div className="space-y-4">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-offWhite h-12 rounded-xl px-4 text-sm font-bold text-charcoal outline-none border border-sage/20 focus:border-teal transition-colors"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Telugu</option>
            <option>Odia</option>
          </select>
          <button 
            onClick={handleSave}
            className="w-full h-12 bg-charcoal text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all mt-4"
          >
             {saved ? <><CheckCircle2 className="w-4 h-4 text-teal" /> {t("Saved!")}</> : <><Save className="w-4 h-4" /> {t("Save Key")}</>}
          </button>
        </div>
      </div>
    </>
  );
}
