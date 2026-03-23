import { useState, useEffect } from 'react';
import { Key, Save, CheckCircle2, Languages, Moon, Sun } from 'lucide-react';
import { getTranslation, LANGUAGES } from '../utils/i18n';
import { useTheme } from '../utils/ThemeContext';

export default function Profile() {
  const [apiKey, setApiKey] = useState('');
  const [language, setLanguage] = useState('English');
  const [saved, setSaved] = useState(false);
  const [showError, setShowError] = useState(false);
  const { dark, toggle } = useTheme();

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
      window.location.reload();
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const t = getTranslation;

  return (
    <>
      <header className="mb-6 sm:mb-8 mt-2">
        <h2 className="text-charcoal dark:text-white font-black text-xl sm:text-2xl tracking-tighter">{t("Settings")}</h2>
        <p className="text-sage font-semibold text-[10px] sm:text-xs mt-1">{t("Configure your app preferences")}</p>
      </header>

      <div className="bg-white dark:bg-charcoal/60 rounded-2xl sm:rounded-[20px] p-4 sm:p-6 border border-sage/10 dark:border-white/10 shadow-sm mb-6">
        {/* API Key Section */}
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-teal/10 rounded-xl flex items-center justify-center text-teal">
            <Key className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-charcoal dark:text-white font-bold text-xs sm:text-sm">Gemini API Key</h3>
            <p className="text-sage text-[8px] sm:text-[10px] uppercase font-bold tracking-widest">From Google AI Studio</p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <input 
            type="password" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..." 
            className="w-full bg-offWhite dark:bg-white/10 h-10 sm:h-12 rounded-xl px-3 sm:px-4 text-xs sm:text-sm font-bold text-charcoal dark:text-white placeholder-sage/50 outline-none border border-sage/20 dark:border-white/10 focus:border-teal transition-colors"
          />
          {showError && (
            <p className="text-[9px] sm:text-[10px] text-coralRed font-bold leading-tight">
              * Note: Do NOT use your Firebase App config API key here. It will result in a 404 error. Please generate a dedicated Gemini API key at aistudio.google.com
            </p>
          )}
        </div>

        {/* Language Section */}
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-charcoal dark:bg-white/10 rounded-xl flex items-center justify-center text-white">
            <Languages className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-charcoal dark:text-white font-bold text-xs sm:text-sm">{t("Primary Language")}</h3>
            <p className="text-sage text-[8px] sm:text-[10px] uppercase font-bold tracking-widest">App & AI Translations</p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-offWhite dark:bg-white/10 h-10 sm:h-12 rounded-xl px-3 sm:px-4 text-xs sm:text-sm font-bold text-charcoal dark:text-white outline-none border border-sage/20 dark:border-white/10 focus:border-teal transition-colors appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23a3b1ac' viewBox='0 0 16 16'%3E%3Cpath d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
          >
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang} className="bg-white dark:bg-charcoal text-charcoal dark:text-white py-2">
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Dark Mode Section */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-amber-500/10 text-amber-400' : 'bg-charcoal text-white'}`}>
              {dark ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>
            <div>
              <h3 className="text-charcoal dark:text-white font-bold text-xs sm:text-sm">{t("Dark Mode")}</h3>
              <p className="text-sage text-[8px] sm:text-[10px] uppercase font-bold tracking-widest">{t("Toggle dark/light theme")}</p>
            </div>
          </div>
          <button 
            onClick={toggle}
            className={`w-12 h-7 sm:w-14 sm:h-8 rounded-full flex items-center transition-all duration-300 px-1 ${dark ? 'bg-teal justify-end' : 'bg-sage/30 justify-start'}`}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-md transition-transform" />
          </button>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          className="w-full h-10 sm:h-12 bg-charcoal dark:bg-teal text-white rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
        >
           {saved ? <><CheckCircle2 className="w-4 h-4 text-teal dark:text-white" /> {t("Saved!")}</> : <><Save className="w-4 h-4" /> {t("Save Key")}</>}
        </button>
      </div>
    </>
  );
}
