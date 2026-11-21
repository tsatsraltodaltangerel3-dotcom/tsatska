import React, { useMemo, useState } from 'react';
import { ArrowRight, Pause, Play, Volume2 } from 'lucide-react';
import { KEY_METRICS, PERSONAL_INFO } from '../data/portfolioData';
import { TopographicBg } from './TopographicBg';

interface HeroMurmurSceneProps {
  isPlaying: boolean;
  onToggleAudio: () => void;
}

export const HeroMurmurScene: React.FC<HeroMurmurSceneProps> = ({ isPlaying, onToggleAudio }) => {
  const [videoError, setVideoError] = useState(false);
  const [imgError, setImgError] = useState(false);

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
      className="relative w-full pt-24 pb-16 lg:pt-28 lg:pb-24 bg-[#070102] bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.38)_0%,_rgba(69,10,10,0.22)_42%,_rgba(7,1,2,1)_82%)] text-white overflow-hidden"
    >
      {/* Topographic Contour Lines Background */}
      <TopographicBg className="absolute inset-0 w-full h-full opacity-95" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Framed Editorial Video Stage */}
        <div className="relative mx-auto max-w-6xl">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/8.2] w-full overflow-hidden bg-[#140306] border border-red-500/20 shadow-[0_32px_90px_rgba(20,0,4,0.9)]">
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
              <div className="w-full h-full bg-gradient-to-br from-[#1A0307] via-[#450A0A] to-[#070102]" />
            )}

            {/* Measured Black-Red Scrim for Guaranteed Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070102] via-[#1C0307]/50 to-[#070102]/25 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070102]/95 via-[#220409]/45 to-transparent pointer-events-none" />
          </div>

          {/* Left-Anchored Bold Athletic Display Typographic Overlay */}
          <div className="relative sm:absolute sm:bottom-8 sm:left-0 lg:bottom-12 lg:-left-4 z-20 mt-6 sm:mt-0 max-w-3xl">
            <p className="text-sm sm:text-base font-semibold tracking-wide text-[#CBD5E1] mb-2">
              {PERSONAL_INFO.name} · Хувийн портфолио
            </p>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-[76px] font-bold uppercase leading-[0.96] tracking-tight text-white [text-wrap:balance] drop-shadow-[0_6px_28px_rgba(12,2,4,0.95)]">
              ХӨЛ БӨМБӨГИЙН{' '}
              <span className="text-[#EF4444]">ЕРТӨНЦ</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm sm:text-base text-[#E2E8F0] leading-relaxed">
              {PERSONAL_INFO.tagline}. Өдөр тутмын бэлтгэл сургуулилт, аялал болон вэб хөгжүүлэлтийн бүтээлүүд.
            </p>

            {/* Primary CTA & Controls */}
            <div className="mt-6 flex flex-wrap items-center gap-3.5">

              <a
                href="#works"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-[#E2E8F0] hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444]"
              >
                <span>Бүтээлүүд үзэх</span>
                <ArrowRight className="w-4 h-4 text-[#EF4444]" />
              </a>

              <button
                type="button"
                onClick={onToggleAudio}
                aria-label={
                  isPlaying
                    ? 'Love Me Again дууг зогсоох'
                    : 'Love Me Again дуу тоглуулах'
                }
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#160407]/90 hover:bg-[#2A070D] border border-red-500/25 text-xs font-medium text-[#F1F5F9] transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444]"
              >
                <span className="w-5 h-5 rounded-full bg-[#DC2626] text-white flex items-center justify-center shrink-0">
                  {isPlaying ? (
                    <Pause className="w-3 h-3 fill-current" />
                  ) : (
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  )}
                </span>
                <span>{isPlaying ? 'Зогсоох' : 'Love Me Again'}</span>

                <span className="flex items-end gap-[2px] h-3" aria-hidden="true">
                  {waveformBars.map((bar) => (
                    <span
                      key={bar.id}
                      className={`w-[2px] rounded-full bg-[#EF4444] transition-opacity duration-200 ${
                        isPlaying ? 'animate-bar opacity-100' : 'opacity-40'
                      }`}
                      style={{
                        height: `${bar.height}%`,
                        animationDelay: `${bar.delay}s`,
                      }}
                    />
                  ))}
                </span>
                <Volume2 className="w-3.5 h-3.5 text-[#EF4444] hidden sm:inline" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Key Metrics Strip Below Hero Split */}
        <div className="mt-14 lg:mt-16 pt-8 border-t border-red-500/20 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {KEY_METRICS.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-bold text-[#EF4444] tabular-nums tracking-tight">
                {metric.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#CBD5E1]">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
