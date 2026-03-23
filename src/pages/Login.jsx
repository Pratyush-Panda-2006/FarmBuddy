import { useState } from 'react';
import { User, ArrowRight, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LANGUAGES, getTranslation } from '../utils/i18n';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('English');
  const t = getTranslation;

  const handleStart = () => {
    if (username.trim().length > 2) {
      localStorage.setItem('SMART_AG_USER', username);
      localStorage.setItem('SMART_AG_LANG', language);
      navigate('/');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-offWhite dark:bg-[#0d1210] flex justify-center items-center py-4 sm:py-6 md:py-12 px-4 md:px-8">
      <div className="w-full max-w-lg min-h-[500px] sm:min-h-[600px] md:border border-sage/20 dark:border-white/10 md:rounded-[40px] bg-white dark:bg-charcoal/60 relative overflow-hidden shadow-2xl flex flex-col mx-auto">
        <div className="flex-1 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-charcoal rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-lg">
            <span className="text-2xl sm:text-3xl">🌱</span>
          </div>
          
          <h1 className="text-charcoal dark:text-white text-3xl sm:text-4xl font-black tracking-tighter mb-2">
            {t("Welcome to")} <br /> FarmBuddy
          </h1>
          <p className="text-sage text-xs sm:text-sm font-semibold mb-8 sm:mb-10">
            {t("Configure your profile to start diagnosing crops and livestock worldwide.")}
          </p>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <p className="text-sage text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-2">{t("Your Name")}</p>
              <div className="bg-white dark:bg-white/10 rounded-xl p-3 sm:p-4 flex items-center gap-3 border border-sage/20 dark:border-white/10 shadow-sm focus-within:border-teal transition-colors">
                <User className="text-sage w-4 h-4 sm:w-5 sm:h-5" />
                <input 
                  type="text" 
                  placeholder="Farmer Alex..." 
                  className="bg-transparent w-full text-sm sm:text-base outline-none font-bold text-charcoal dark:text-white placeholder-sage/50"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <p className="text-sage text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-2">{t("Primary Language")}</p>
              <div className="bg-white dark:bg-white/10 rounded-xl p-3 sm:p-4 flex items-center gap-3 border border-sage/20 dark:border-white/10 shadow-sm focus-within:border-teal transition-colors">
                <Languages className="text-sage w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <select 
                  className="bg-transparent w-full text-sm sm:text-base outline-none font-bold text-charcoal dark:text-white appearance-none"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang} className="bg-white dark:bg-charcoal text-charcoal dark:text-white">
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={handleStart}
              className={`w-full h-12 sm:h-14 rounded-xl text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2 mt-2 sm:mt-4 ${
                username.trim().length > 2 ? 'bg-teal active:scale-95' : 'bg-sage cursor-not-allowed opacity-50'
              }`}
            >
              {t("Get Started")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
