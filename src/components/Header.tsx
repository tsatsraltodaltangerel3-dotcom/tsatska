import React, { useState } from 'react';
import { ExternalLink, Menu, X } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

const NAV_ITEMS = [
  { href: '#hero', label: 'Эхлэл' },
  { href: '#works', label: 'Бүтээлүүд' },
  { href: '#profession', label: 'Мөрөөдөл' },
  { href: '#youtube', label: 'Видео' },
  { href: '#services', label: 'Services' },
  { href: '#community', label: 'Дэмжигчид' },
];

interface HeaderProps {
  onOpenContact: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenContact, onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#021327]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 text-white font-display text-xl sm:text-2xl font-bold uppercase tracking-wide whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded"
        >
          <span
            aria-hidden="true"
            className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0284C7] via-[#38BDF8] to-[#BAE6FD] shadow-[0_0_16px_rgba(56,189,248,0.45)] inline-block shrink-0"
          />
          <span>football</span>
        </a>

        {/* Zone 2: Single-line Navigation Links */}
        <nav
          aria-label="Үндсэн цэс"
          className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-semibold text-[#CBD5E1]"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#38BDF8] hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onOpenContact}
            className="relative py-1 hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#38BDF8] hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded"
          >
            Contact
          </button>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="relative py-1 text-[#38BDF8] hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#38BDF8] hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded"
          >
            Admin
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={PERSONAL_INFO.netlifyBase}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#021327] bg-[#38BDF8] hover:bg-[#7DD3FC] rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Netlify сайт үзэх</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Цэс хаах' : 'Цэс нээх'}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#021327] border-b border-white/10 px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 text-sm font-semibold text-[#CBD5E1] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenContact();
            }}
            className="block w-full text-left py-2.5 px-3 text-sm font-semibold text-[#CBD5E1] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            Contact
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="block w-full text-left py-2.5 px-3 text-sm font-semibold text-[#38BDF8] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            Admin
          </button>
          <a
            href={PERSONAL_INFO.netlifyBase}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-[#021327] bg-[#38BDF8] rounded-full"
          >
            <span>Netlify сайт үзэх</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </header>
  );
};
