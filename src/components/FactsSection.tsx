import React from 'react';
import { Compass } from 'lucide-react';
import { FACTS, PERSONAL_INFO } from '../data/portfolioData';

export const FactsSection: React.FC = () => {
  return (
    <section id="facts" className="py-20 lg:py-28 bg-[#120306] text-white border-t border-red-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 mb-12 border-b border-red-500/20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EF4444] mb-2">
              Хувийн мэдээлэл ба сонирхол
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white [text-wrap:balance]">
              СОНИРХОЛТОЙ <span className="text-[#EF4444]">БАРИМТУУД</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#CBD5E1] max-w-md leading-relaxed">
            Өдөр тутмын амьдралын хэв маяг, уран бүтээлийн сонирхол болон чөлөөт цагаа өнгөрүүлдэг зүйлс.
          </p>
        </div>

        {/* Clean 4-Column Architectural Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FACTS.map((fact) => (
            <div
              key={fact.id}
              className="bg-[#070102] border border-red-500/20 hover:border-[#EF4444]/60 rounded-xl p-6 flex flex-col justify-between transition-colors duration-200"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-[#94A3B8] mb-4">
                  <span className="uppercase tracking-wider text-[#EF4444]">{fact.label}</span>
                  <span className="font-mono-code tabular-nums text-white/40">{fact.index}</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-2">
                  {fact.value}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#CBD5E1] pt-4 mt-4 border-t border-red-500/15 leading-relaxed">
                {fact.subtext}
              </p>
            </div>
          ))}

          {/* Editorial Travel & Vision Spotlight Card */}
          <div className="bg-gradient-to-br from-[#991B1B] via-[#B91C1C] to-[#450A0A] text-white rounded-xl p-6 flex flex-col justify-between border border-red-400/20">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#FEE2E2]">
                  Дэлхийгээр аялах
                </span>
                <Compass className="w-5 h-5 text-white" aria-hidden="true" />
              </div>

              <h3 className="font-display text-2xl font-bold uppercase tracking-tight leading-snug text-white">
                «ДЭЛХИЙН ОЛОН ОРОНД АЯЛЖ, ХӨЛ БӨМБӨГ ТОГЛОХЫГ МӨРӨӨДДӨГ»
              </h3>
            </div>

            <p className="text-xs font-semibold text-[#FEE2E2] pt-4 mt-4 border-t border-white/20">
              {PERSONAL_INFO.name} · {PERSONAL_INFO.age}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
