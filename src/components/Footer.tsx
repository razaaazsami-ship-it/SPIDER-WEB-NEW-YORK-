import React from 'react';
import { Shield, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'missions' | 'patrol' | 'suits' | 'profile') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative z-20 border-t border-red-900/30 bg-slate-950/90 backdrop-blur-xl mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          
          {/* Brand & Note */}
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-black">
                🕸️
              </div>
              <span className="font-black text-white text-base" style={{ fontFamily: "'Changa', sans-serif" }}>
                حامي المدينة: تجربة بطل العنكبوت التفاعلية
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              تطبيق ويب تفاعلي مستوحى من أجواء أبطال العنكبوت ومدينة نيويورك ليلًا. جميع الرسومات والتصاميم والعناصر الصوتية أصلية ومطورة خصيصًا.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-400">
            <button onClick={() => onNavigate('home')} className="hover:text-red-400 transition-colors">
              الرئيسية
            </button>
            <button onClick={() => onNavigate('missions')} className="hover:text-red-400 transition-colors">
              المهام والمغامرات
            </button>
            <button onClick={() => onNavigate('patrol')} className="hover:text-red-400 transition-colors">
              خريطة الدوريات
            </button>
            <button onClick={() => onNavigate('suits')} className="hover:text-red-400 transition-colors">
              معمل البدل
            </button>
            <button onClick={() => onNavigate('profile')} className="hover:text-red-400 transition-colors">
              الملف الشخصي
            </button>
          </div>

          {/* Hero Motto */}
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="text-red-400 font-bold">«مع القوة العظيمة.. تأتي مسؤولية أعظم»</span>
          </div>

        </div>
      </div>
    </footer>
  );
};
