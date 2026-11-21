import React, { useState } from 'react';
import { ArrowUpRight, Trophy } from 'lucide-react';
import { DREAM_PROFESSION, PERSONAL_INFO } from '../data/portfolioData';
import { TopographicBg } from './TopographicBg';

export const DreamProfessionSection: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="profession"
      className="relative py-20 lg:py-28 bg-[#070102] bg-[radial-gradient(ellipse_at_bottom_left,_rgba(127,29,29,0.28)_0%,_rgba(7,1,2,1)_70%)] text-white overflow-hidden"
    >
      <TopographicBg className="absolute inset-0 w-full h-full opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 mb-12 border-b border-red-500/20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EF4444] mb-2">
              Зорилго ба тэмүүлэл
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white [text-wrap:balance]">
              МӨРӨӨДЛИЙН <span className="text-[#EF4444]">МЭРГЭЖИЛ</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#CBD5E1] max-w-md leading-relaxed">
            {DREAM_PROFESSION.subtitle}. Багаасаа хөл бөмбөгөөр хичээллэж, олон улсын тавцанд өрсөлдөх чин хүсэлтэй.
          </p>
        </div>

        {/* 12-Column Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Stadium Visual & Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#140407] border border-red-500/20 rounded-xl overflow-hidden">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-72 w-full overflow-hidden bg-[#0D0204]">
              {!imgError ? (
                <img
                  src={PERSONAL_INFO.stadiumPitch}
                  alt="Хөл бөмбөгийн орчин үеийн цэнгэлдэх хүрээлэн"
                  onError={() => setImgError(true)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#140407] to-[#450A0A]">
                  <Trophy className="w-10 h-10 text-[#EF4444] mb-2" />
                  <span className="font-display text-lg uppercase">Цэнгэлдэх хүрээлэн</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#140407] via-[#140407]/35 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#EF4444] mb-1">
                  Талбайн замнал
                </p>
                <p className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                  {DREAM_PROFESSION.motto}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
              <div className="space-y-4 text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
                <p>{DREAM_PROFESSION.description}</p>
                <p>{PERSONAL_INFO.bioParagraph2}</p>
              </div>

              <div className="pt-5 border-t border-red-500/15 flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-[#94A3B8]">
                  {PERSONAL_INFO.name} · {PERSONAL_INFO.age}
                </span>
                <a
                  href="https://graceful-meringue-2b7911.netlify.app/minii-mergjil.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-[#DC2626] text-white text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  <span>Дэлгэрэнгүй хуудас</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Reasons & 4 Goals */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            {/* 4 Reasons */}
            <div className="bg-[#140407] border border-red-500/20 rounded-xl p-6 sm:p-8">
              <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-6">
                ЯАГААД ЭНЭ МЭРГЭЖЛИЙГ СОНГОСОН БЭ?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DREAM_PROFESSION.reasons.map((reason) => (
                  <div
                    key={reason.index}
                    className="p-5 rounded-lg bg-[#070102]/75 border border-red-500/15"
                  >
                    <span className="font-mono-code text-xs font-semibold text-[#EF4444] tabular-nums block mb-1.5">
                      {reason.index} · {reason.title}
                    </span>
                    <p className="text-sm sm:text-base text-white font-medium leading-snug">
                      {reason.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Strategic Goals */}
            <div className="bg-[#140407] border border-red-500/20 rounded-xl p-6 sm:p-8">
              <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-6">
                МИНИЙ <span className="text-[#EF4444]">4 ТОМ</span> ЗОРИЛГО
              </h3>

              <div className="divide-y divide-red-500/15">
                {DREAM_PROFESSION.goals.map((goal) => (
                  <div
                    key={goal.number}
                    className="py-4 first:pt-0 last:pb-0 flex items-baseline gap-5"
                  >
                    <span className="font-display text-2xl font-bold text-[#EF4444] tabular-nums shrink-0">
                      {goal.number}
                    </span>
                    <p className="text-sm sm:text-base text-[#E2E8F0] font-medium leading-relaxed">
                      {goal.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
