import { useState, useEffect } from 'react';
import { Key, Save, CheckCircle2, Languages, Moon, Sun, User2 } from 'lucide-react';
import { getTranslation, LANGUAGES } from '../utils/i18n';
import { useTheme } from '../utils/ThemeContext';

export default function Profile() {
  const [apiKey, setApiKey] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('English');
  const [saved, setSaved] = useState(false);
  const [showError, setShowError] = useState(false);
  const { dark, toggle } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem('SMART_AG_USER');
    if (storedUser) setUsername(storedUser);

    const storedPhone = localStorage.getItem('SMART_AG_PHONE');
    if (storedPhone) setPhone(storedPhone);

    const storedKey = localStorage.getItem('GEMINI_API_KEY');
    if (storedKey) setApiKey(storedKey);
    
    const storedLang = localStorage.getItem('SMART_AG_LANG');
    if (storedLang) setLanguage(storedLang);

    if (localStorage.getItem('GEMINI_KEY_ERROR') === 'true') {
      setShowError(true);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('SMART_AG_USER', username);
    localStorage.setItem('SMART_AG_PHONE', phone);
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
      <header className="mb-6 mt-2">
        <h2 className="font-display text-charcoalDark dark:text-white text-3xl sm:text-4xl uppercase leading-none">{t("Settings")}</h2>
        <p className="font-display tracking-widest uppercase text-charcoalDark/50 dark:text-white/50 text-[10px] sm:text-xs mt-2">{t("Configure your app preferences")}</p>
      </header>

      <div className="bg-[#f8f9fa] dark:bg-white/5 rounded-xl p-5 sm:p-6 border border-charcoalDark/10 dark:border-white/10 shadow-sm mb-6">
        
        {/* Personal Info Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-charcoalDark dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-charcoalDark shrink-0">
            <User2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-charcoalDark dark:text-white text-sm sm:text-base uppercase tracking-wider">{t("Personal Info")}</h3>
            <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest">{t("Update your details")}</p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Name" 
            className="w-full bg-white dark:bg-charcoalDark h-14 rounded-lg px-4 font-body text-sm font-medium text-charcoalDark dark:text-white placeholder-charcoalDark/30 outline-none border border-charcoalDark/20 dark:border-white/10 focus:border-charcoalDark dark:focus:border-white transition-colors"
          />
          <input 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number" 
            className="w-full bg-white dark:bg-charcoalDark h-14 rounded-lg px-4 font-body text-sm font-medium text-charcoalDark dark:text-white placeholder-charcoalDark/30 outline-none border border-charcoalDark/20 dark:border-white/10 focus:border-charcoalDark dark:focus:border-white transition-colors"
          />
        </div>

        {/* API Key Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-charcoalDark rounded-lg flex items-center justify-center text-white shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-charcoalDark dark:text-white text-sm sm:text-base uppercase tracking-wider">Gemini API Key</h3>
            <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest">From Google AI Studio</p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <input 
            type="password" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..." 
            className="w-full bg-white dark:bg-charcoalDark h-14 rounded-lg px-4 font-body text-sm font-medium text-charcoalDark dark:text-white placeholder-charcoalDark/30 outline-none border border-charcoalDark/20 dark:border-white/10 focus:border-charcoalDark dark:focus:border-white transition-colors"
          />
          {showError && (
            <p className="font-body text-[10px] sm:text-xs text-coralRed font-medium leading-relaxed bg-coralRed/5 p-3 rounded-lg border border-coralRed/20">
              * Note: Do NOT use your Firebase App config API key here. It will result in a 404 error. Please generate a dedicated Gemini API key at aistudio.google.com
            </p>
          )}
        </div>

        {/* Language Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-goldenYellow rounded-lg flex items-center justify-center text-charcoalDark shrink-0">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-charcoalDark dark:text-white text-sm sm:text-base uppercase tracking-wider">{t("Primary Language")}</h3>
            <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest">App & AI Translations</p>
          </div>
        </div>

        <div className="space-y-3 mb-8 relative">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-white dark:bg-charcoalDark h-14 rounded-lg px-4 font-body text-sm font-medium text-charcoalDark dark:text-white outline-none border border-charcoalDark/20 dark:border-white/10 focus:border-charcoalDark dark:focus:border-white transition-colors appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23171e19' viewBox='0 0 16 16'%3E%3Cpath d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
          >
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang} className="bg-white dark:bg-charcoalDark text-charcoalDark dark:text-white py-2">
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Dark Mode Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors shrink-0 ${dark ? 'bg-amber-500 text-white' : 'bg-charcoalDark text-white'}`}>
              {dark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-display text-charcoalDark dark:text-white text-sm sm:text-base uppercase tracking-wider">{t("Dark Mode")}</h3>
              <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest">{t("Toggle dark/light theme")}</p>
            </div>
          </div>
          <button 
            onClick={toggle}
            className={`w-14 h-8 sm:w-16 sm:h-9 rounded-full flex items-center transition-all duration-300 px-1 border border-charcoalDark/20 dark:border-white/20 ${dark ? 'bg-charcoalDark justify-end' : 'bg-white justify-start'}`}
          >
            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full shadow-md transition-transform ${dark ? 'bg-goldenYellow' : 'bg-charcoalDark'}`} />
          </button>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          className="w-full h-14 bg-charcoalDark dark:bg-white text-white dark:text-charcoalDark rounded-xl font-display text-sm sm:text-base uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_4px_14px_0_rgba(23,30,25,0.39)] hover:shadow-[0_6px_20px_rgba(23,30,25,0.23)] border border-transparent dark:border-white/10 active:scale-[0.98] transition-all"
        >
           {saved ? <><CheckCircle2 className="w-5 h-5 text-teal" /> {t("Saved!")}</> : <><Save className="w-5 h-5 opacity-70" /> {t("Save Preferences")}</>}
        </button>
      </div>
    </>
  );
}
