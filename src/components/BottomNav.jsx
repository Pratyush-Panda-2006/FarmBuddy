import { Link, useLocation } from 'react-router-dom';
import { Home, ScanLine, User2, CloudSun, MessageSquare } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const items = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/weather', icon: CloudSun, label: 'Weather' },
    { to: '/camera', icon: ScanLine, label: 'Scan', isCenter: true },
    { to: '/chat', icon: MessageSquare, label: 'Chat' },
    { to: '/profile', icon: User2, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-[700px] lg:w-[760px] bg-charcoalDark md:rounded-xl flex items-center justify-evenly shadow-2xl z-50 border-t md:border border-charcoalDark/10 md:border-white/10 h-16 sm:h-[68px]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = path === item.to;

        if (item.isCenter) {
          return (
            <Link
              key={item.to}
              to={item.to}
              className="relative -mt-7 w-14 h-14 sm:w-16 sm:h-16 bg-goldenYellow rounded-xl flex items-center justify-center shadow-lg shadow-goldenYellow/20 border-4 border-[#f8f9fa] dark:border-charcoalDark text-charcoalDark transition-transform active:scale-95 hover:scale-105"
            >
              <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
            </Link>
          );
        }

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center py-2 transition-all ${isActive ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
          >
            <Icon className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
            <span className="font-display text-[9px] sm:text-[10px] mt-1 tracking-widest uppercase leading-none">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
