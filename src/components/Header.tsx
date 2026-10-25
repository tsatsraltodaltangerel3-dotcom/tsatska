import React from 'react';
import { ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface HeaderProps {
  isPlaying: boolean;
  onToggleAudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isPlaying, onToggleAudio }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#040918]/80 backdrop-blur-md border-b border-[#8492ff]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <a
          href="#hero"
          className="font-serif-display text-xl sm:text-2xl text-white font-medium tracking-tight whitespace-nowrap shrink-0 hover:text-[#dfe3fb] transition-colors"
        >
          {PERSONAL_INFO.name}
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#b9c4ea]">
          <a
            href="#hero"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Эхлэл
          </a>
          <a
            href="#works"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Миний бүтээлүүд
          </a>
          <a
            href="#profession"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Мөрөөдлийн мэргэжил
          </a>
          <a
            href="#facts"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Сонирхолтой баримтууд
          </a>
          <a
            href="#youtube"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            YouTube хуудас
          </a>
        </nav>

        {/* Zone 3: Primary Action & Ambient Audio Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleAudio}
            title={isPlaying ? "Борооны аясыг зогсоох" : "Борооны аясыг тоглуулах"}
            aria-label={isPlaying ? "Борооны аясыг зогсоох" : "Борооны аясыг тоглуулах"}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono-code text-[#dfe3fb] bg-[#0c163b] hover:bg-[#162254] border border-[#8492ff]/30 rounded-lg transition-all"
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#86a2ff] animate-pulse" />
                <span className="hidden sm:inline">Бороо асаалттай</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#7583bd]" />
                <span className="hidden sm:inline">Борооны аяс</span>
              </>
            )}
          </button>

          <a
            href={PERSONAL_INFO.netlifyBase}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#5560FF] hover:bg-[#4651e6] active:scale-95 rounded-lg transition-all shadow-md shadow-[#5560FF]/25 whitespace-nowrap shrink-0"
          >
            <span>Netlify сайт үзэх</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};
