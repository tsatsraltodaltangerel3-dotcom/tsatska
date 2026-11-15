import React from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { TopographicBg } from './TopographicBg';

const FOOTER_LINKS = [
  { label: 'Нүүр хуудас', url: 'https://graceful-meringue-2b7911.netlify.app/index.html' },
  { label: 'Миний мэргэжил', url: 'https://graceful-meringue-2b7911.netlify.app/minii-mergjil.html' },
  { label: 'YouTube клон', url: 'https://graceful-meringue-2b7911.netlify.app/youtube.html' },
  { label: 'JavaScript апп-ууд', url: 'https://splendid-shortbread-fbecb0.netlify.app/' },
];

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#021327] text-white border-t border-white/10 overflow-hidden">
      <TopographicBg className="absolute inset-0 w-full h-full opacity-35" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0284C7] via-[#38BDF8] to-[#BAE6FD] inline-block"
              />
              <span className="font-display text-2xl font-bold uppercase tracking-wide">
                {PERSONAL_INFO.name}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Хувийн портфолио · {PERSONAL_INFO.age} · Хөл бөмбөг & Вэб төслүүд
            </p>
          </div>

          {/* External Project Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-[#CBD5E1]">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#38BDF8] transition-colors whitespace-nowrap"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#38BDF8]" />
              </a>
            ))}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-[#38BDF8] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>Admin</span>
            </button>
          </div>

          {/* Scroll to Top */}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Хуудасны дээд хэсэг рүү очих"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-[#38BDF8] text-white hover:text-[#021327] text-xs font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Дээш очих</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#94A3B8]">
          <span>© 2026 {PERSONAL_INFO.name}. Бүх эрх хамгаалагдсан.</span>
          <span>{PERSONAL_INFO.latinName} · Portfolio</span>
        </div>
      </div>
    </footer>
  );
};
