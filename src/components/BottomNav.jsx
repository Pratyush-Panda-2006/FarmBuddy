import { Link, useLocation } from 'react-router-dom';
import { Home, ScanLine, Clock, User2 } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 md:bottom-8 md:left-1/2 md:-translate-x-1/2 w-full md:w-[600px] lg:w-[800px] h-16 md:h-16 bg-slate md:rounded-3xl flex items-center justify-around px-4 md:px-12 shadow-2xl z-50">
      <Link to="/" className={`text-white transition-opacity ${path === '/' ? 'opacity-100' : 'opacity-40'}`}>
        <Home className="w-6 h-6 md:w-7 md:h-7" />
      </Link>
      
      <div className="relative">
        <Link to="/camera" className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 bg-coralRed rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg border-4 border-slate text-white transition-transform active:scale-90">
          <ScanLine className="w-8 h-8 md:w-10 md:h-10" />
        </Link>
      </div>

      <Link to="/profile" className={`text-white transition-opacity ${path === '/profile' ? 'opacity-100' : 'opacity-40'}`}>
        <User2 className="w-6 h-6 md:w-7 md:h-7" />
      </Link>
    </div>
  );
}
