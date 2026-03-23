import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-charcoalDark text-charcoalDark dark:text-white font-body w-full relative transition-colors duration-300">
      <div className="w-full h-screen overflow-y-auto custom-scroll pb-24 md:pb-32 px-5 md:px-10 lg:px-20 max-w-[1400px] mx-auto pt-6">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
