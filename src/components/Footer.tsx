import React from 'react';
import { ExternalLink, ArrowUp } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#8492ff]/20 bg-[#030612]/90 backdrop-blur-lg relative z-20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Bio */}
        <div className="text-center md:text-left space-y-1">
          <span className="font-serif-display text-xl text-white font-medium">
            {PERSONAL_INFO.name}
          </span>
          <p className="text-xs text-[#7583bd] font-mono-code">
            Хувийн портфолио сайт · 18 нас · Хөл бөмбөг & Вэб төслүүд
          </p>
        </div>

        {/* Links to Netlify Pages */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono-code text-[#b9c4ea]">
          <a
            href="https://graceful-meringue-2b7911.netlify.app/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Нүүр хуудас</span>
            <ExternalLink className="w-3 h-3 text-[#7583bd]" />
          </a>
          <a
            href="https://graceful-meringue-2b7911.netlify.app/minii-mergjil.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Миний мэргэжил</span>
            <ExternalLink className="w-3 h-3 text-[#7583bd]" />
          </a>
          <a
            href="https://graceful-meringue-2b7911.netlify.app/youtube.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>YouTube клон</span>
            <ExternalLink className="w-3 h-3 text-[#7583bd]" />
          </a>
        </div>

        {/* Scroll To Top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a153a] hover:bg-[#14235c] border border-[#8492ff]/30 text-xs font-mono-code text-[#dfe3fb] hover:text-white transition-all cursor-pointer"
          aria-label="Хуудасны дээд хэсэг рүү очих"
        >
          <span>Дээш очих</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#8492ff]/10 text-center text-xs font-mono-code text-[#7583bd]">
        © 2026 {PERSONAL_INFO.name}. Бүх эрх хамгаалагдсан.
      </div>
    </footer>
  );
};
