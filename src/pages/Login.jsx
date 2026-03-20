import { useState } from 'react';
import { User, ArrowRight, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('English');

  const handleStart = () => {
    if (username.trim().length > 2) {
      localStorage.setItem('SMART_AG_USER', username);
      localStorage.setItem('SMART_AG_LANG', language);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-offWhite flex justify-center items-center py-6 md:py-12 px-4 md:px-8">
      <div className="w-full max-w-lg min-h-[600px] md:border border-sage/20 md:rounded-[40px] bg-white relative overflow-hidden shadow-2xl flex flex-col mx-auto">
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="w-16 h-16 bg-charcoal rounded-2xl flex items-center justify-center mb-8 shadow-lg">
            <span className="text-3xl">🌱</span>
          </div>
          
          <h1 className="text-charcoal text-4xl font-black tracking-tighter mb-2">
            Welcome to <br /> FarmBuddy
          </h1>
          <p className="text-sage text-sm font-semibold mb-10">
            Configure your profile to start diagnosing crops and livestock worldwide.
          </p>

          <div className="space-y-6">
            <div>
              <p className="text-sage text-[10px] font-bold uppercase tracking-widest mb-2">Your Name</p>
              <div className="bg-white rounded-[12px] p-4 flex items-center gap-3 border border-sage/20 shadow-sm focus-within:border-teal transition-colors">
                <User className="text-sage w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Farmer Alex..." 
                  className="bg-transparent w-full text-base outline-none font-bold text-charcoal placeholder-sage/50"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <p className="text-sage text-[10px] font-bold uppercase tracking-widest mb-2">Primary Language</p>
              <div className="bg-white rounded-[12px] p-4 flex items-center gap-3 border border-sage/20 shadow-sm focus-within:border-teal transition-colors">
                <Languages className="text-sage w-5 h-5" />
                <select 
                  className="bg-transparent w-full text-base outline-none font-bold text-charcoal"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Tamil</option>
                  <option>Telugu</option>
                  <option>Odia</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleStart}
              className={`w-full h-14 rounded-xl text-white font-extrabold text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2 mt-4 ${
                username.trim().length > 2 ? 'bg-teal active:scale-95' : 'bg-sage cursor-not-allowed opacity-50'
              }`}
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
