import { useState, useEffect } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Injecting Satoshi font and custom keyframes for the authentic spec feel
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.cdnfonts.com/css/satoshi');
      .auth-container { font-family: 'Satoshi', sans-serif; }
      @keyframes float-shape {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      .animate-float-shape { animation: float-shape 6s ease-in-out infinite; }
      .delay-2s { animation-delay: 2s; }
      .delay-4s { animation-delay: 4s; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleStart = () => {
    if (username.trim().length > 2) {
      localStorage.setItem('SMART_AG_USER', username);
      navigate('/');
    }
  };

  return (
    <div className="auth-container min-h-[100dvh] flex flex-col md:flex-row bg-[#F3F4F6] text-[#111827]">
      
      {/* Visual Branding Section (Left/Top) */}
      <div className="w-full md:w-1/2 h-[400px] md:h-auto bg-[#F3F4F6] relative overflow-hidden flex items-center justify-center">
        <div className="relative w-full h-full max-w-lg mx-auto flex items-center justify-center scale-75 sm:scale-100">
          
          {/* Purple Rectangle */}
          <div className="absolute animate-float-shape bg-[#8B5CF6] w-[128px] h-[160px] rounded-lg shadow-2xl -ml-40 -mt-20 flex items-center justify-center">
            <div className="flex gap-4">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Black Rounded Rectangle */}
          <div className="absolute animate-float-shape delay-2s bg-[#111827] w-[144px] h-[176px] rounded-[40px] shadow-2xl ml-32 mt-10 flex flex-col items-center justify-center gap-2">
            <div className="flex gap-4">
              <div className="w-3 h-4 bg-white rounded-full"></div>
              <div className="w-3 h-4 bg-white rounded-full"></div>
            </div>
            <div className="w-8 h-2 bg-white rounded-full mt-2"></div>
          </div>
          
          {/* Orange Semicircle */}
          <div className="absolute animate-float-shape delay-4s bg-[#F97316] w-[160px] h-[80px] rounded-t-full shadow-2xl top-[15%] right-[10%] flex items-end justify-center pb-4">
             <div className="flex gap-6">
               <div className="w-2 h-2 bg-white rounded-full"></div>
               <div className="w-2 h-2 bg-white rounded-full"></div>
             </div>
          </div>
          
          {/* Yellow Blob */}
          <div className="absolute animate-float-shape delay-2s bg-[#FACC15] w-[144px] h-[144px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] shadow-2xl bottom-[15%] left-[5%] flex items-center justify-center">
             <div className="flex gap-4">
               <div className="w-4 h-4 bg-white rounded-full"></div>
               <div className="w-4 h-4 bg-white rounded-full"></div>
             </div>
          </div>

        </div>
      </div>

      {/* Authentication Form (Right/Bottom) */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen bg-[#FFFFFF] flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-[448px] flex flex-col space-y-8">
          
          <div className="mb-4">
            <h1 className="text-[36px] font-bold text-[#111827] tracking-tight leading-[1.1]">
              Welcome to<br/>FarmBuddy
            </h1>
            <p className="text-slate-500 font-normal text-[14px] sm:text-[16px] mt-3">
              Sign in to manage your crops and livestock.
            </p>
          </div>

          <div className="space-y-[32px]">
            {/* Animated Underline Input */}
            <div className="relative group">
              <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.1em] block mb-2">
                Username
              </label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Farmer Alex..."
                className="w-full bg-transparent text-[16px] text-[#111827] py-2 outline-none border-b-2 border-[#F1F5F9] transition-colors peer"
              />
              <div className="absolute bottom-0 left-0 h-[2px] bg-[#000000] w-0 transition-all duration-300 ease-out peer-focus:w-full"></div>
            </div>

            {/* Custom Styled Checkbox */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative w-[20px] h-[20px]">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="opacity-0 absolute inset-0 z-10 cursor-pointer" 
                  />
                  <div className={`absolute inset-0 border-2 rounded-[6px] transition-all duration-200 flex items-center justify-center
                    ${rememberMe ? 'bg-[#000000] border-[#000000]' : 'border-slate-200 bg-transparent group-hover:border-slate-400'}`}>
                    <Check className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${rememberMe ? 'scale-100' : 'scale-0'}`} />
                  </div>
                </div>
                <span className="text-[14px] text-slate-500 font-medium select-none">Remember me</span>
              </label>
              
              <button className="text-[14px] text-slate-500 hover:text-[#111827] font-medium transition-colors">
                Need help?
              </button>
            </div>

            <button 
              onClick={handleStart}
              disabled={username.trim().length <= 2}
              className={`w-full py-4 text-[16px] font-semibold flex items-center justify-center gap-2 transition-all duration-150
                ${username.trim().length > 2 
                  ? 'bg-[#111827] text-[#FFFFFF] shadow-black/5 hover:bg-black active:scale-[0.98]' 
                  : 'bg-[#F3F4F6] text-[#94A3B8] cursor-not-allowed'}`}
            >
              Login <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 flex justify-center">
            <p className="text-[16px] text-slate-500">
              New here? <button className="font-bold text-[#111827] hover:underline decoration-2 underline-offset-4 ml-1">Sign Up</button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
