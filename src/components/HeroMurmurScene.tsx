import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronRight, Pause, Play, Volume2, X } from 'lucide-react';
import { KEY_METRICS, PERSONAL_INFO } from '../data/portfolioData';
import { TopographicBg } from './TopographicBg';

interface HeroMurmurSceneProps {
  isPlaying: boolean;
  onToggleAudio: () => void;
}

export const HeroMurmurScene: React.FC<HeroMurmurSceneProps> = ({ isPlaying, onToggleAudio }) => {
  const [videoError, setVideoError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    if (!isVideoModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVideoModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoModalOpen]);

  const waveformBars = useMemo(() => {
    const count = 12;
    return Array.from({ length: count }, (_, i) => {
      const pos = i / (count - 1);
      const height = Math.round(35 + 65 * Math.abs(Math.sin(pos * Math.PI * 2.5 + 0.6)));
      return {
        id: i,
        height,
        delay: (i % 6) * 0.14,
      };
    });
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full pt-24 pb-16 lg:pt-28 lg:pb-24 bg-[#021327] text-white overflow-hidden"
    >
      {/* Topographic Contour Lines Background */}
      <TopographicBg className="absolute inset-0 w-full h-full opacity-95" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Framed Editorial Video Stage (City Football Group Style) */}
        <div className="relative mx-auto max-w-6xl">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/8.2] w-full overflow-hidden bg-[#051B36] border border-white/10 shadow-[0_32px_90px_rgba(0,8,20,0.85)]">
            {!videoError ? (
              <video
                poster={PERSONAL_INFO.heroImage}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onError={() => setVideoError(true)}
                aria-label="Хөл бөмбөгийн арын дэвсгэр видео"
                className="w-full h-full object-cover object-center opacity-85"
              >
                <source src={PERSONAL_INFO.heroVideo} type="video/mp4" />
                <source src={PERSONAL_INFO.heroVideoFallback} type="video/webm" />
              </video>
            ) : !imgError ? (
              <img
                src={PERSONAL_INFO.heroImage}
                alt="Хөл бөмбөгийн талбай дээрх залуу тамирчид"
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center opacity-80"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#031A34] via-[#06284D] to-[#021327]" />
            )}

            {/* Measured Scrim for Guaranteed Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#021327] via-[#021327]/45 to-[#021327]/20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#021327]/90 via-[#021327]/35 to-transparent pointer-events-none" />
          </div>

          {/* Left-Anchored Bold Athletic Display Typographic Overlay */}
          <div className="relative sm:absolute sm:bottom-8 sm:left-0 lg:bottom-12 lg:-left-4 z-20 mt-6 sm:mt-0 max-w-3xl">
            <p className="text-sm sm:text-base font-semibold tracking-wide text-[#CBD5E1] mb-2">
              {PERSONAL_INFO.name} · Хувийн портфолио
            </p>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-[76px] font-bold uppercase leading-[0.96] tracking-tight text-white [text-wrap:balance] drop-shadow-[0_6px_28px_rgba(2,19,39,0.9)]">
              ХӨЛ БӨМБӨГИЙН{' '}
              <span className="text-[#38BDF8]">ИРЭЭДҮЙН</span>{' '}
              ТЭРГҮҮН ЭГНЭЭНД
            </h1>

            <p className="mt-4 max-w-xl text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
              {PERSONAL_INFO.tagline}. Өдөр тутмын бэлтгэл сургуулилт, аялал болон вэб хөгжүүлэлтийн бүтээлүүд.
            </p>

            {/* Primary CTA & Controls */}
            <div className="mt-6 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/15 hover:bg-[#38BDF8] text-white hover:text-[#021327] border border-white/25 hover:border-[#38BDF8] backdrop-blur-sm text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
              >
                <span>Бүтэн видео үзэх</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href="#works"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-[#CBD5E1] hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
              >
                <span>Бүтээлүүд үзэх</span>
                <ArrowRight className="w-4 h-4 text-[#38BDF8]" />
              </a>

              <button
                type="button"
                onClick={onToggleAudio}
                aria-label={isPlaying ? 'Борооны аясыг зогсоох' : 'Борооны аясыг тоглуулах'}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#051B36]/90 hover:bg-[#09274A] border border-white/15 text-xs font-medium text-[#E2E8F0] transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
              >
                <span className="w-5 h-5 rounded-full bg-[#38BDF8] text-[#021327] flex items-center justify-center shrink-0">
                  {isPlaying ? (
                    <Pause className="w-3 h-3 fill-current" />
                  ) : (
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  )}
                </span>
                <span>{isPlaying ? 'Аяс зогсоох' : 'Борооны аяс'}</span>

                <span className="flex items-end gap-[2px] h-3" aria-hidden="true">
                  {waveformBars.map((bar) => (
                    <span
                      key={bar.id}
                      className={`w-[2px] rounded-full bg-[#38BDF8] transition-opacity duration-200 ${
                        isPlaying ? 'animate-bar opacity-100' : 'opacity-40'
                      }`}
                      style={{
                        height: `${bar.height}%`,
                        animationDelay: `${bar.delay}s`,
                      }}
                    />
                  ))}
                </span>
                <Volume2 className="w-3.5 h-3.5 text-[#38BDF8] hidden sm:inline" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Key Metrics Strip Below Hero Split */}
        <div className="mt-14 lg:mt-16 pt-8 border-t border-white/12 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {KEY_METRICS.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-bold text-[#38BDF8] tabular-nums tracking-tight">
                {metric.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#CBD5E1]">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Video Lightbox Modal */}
      {isVideoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Хөл бөмбөгийн бүрэн бичлэг"
          className="fixed inset-0 z-50 bg-[#021327]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-[#051B36] border border-white/15 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
              <span className="font-display text-lg uppercase tracking-wide text-white">
                Хөл бөмбөгийн тоглолтын бичлэг
              </span>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                aria-label="Видео хаах"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#38BDF8] text-white hover:text-[#021327] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <video
                poster={PERSONAL_INFO.heroImage}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              >
                <source src={PERSONAL_INFO.heroVideo} type="video/mp4" />
                <source src={PERSONAL_INFO.heroVideoFallback} type="video/webm" />
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
