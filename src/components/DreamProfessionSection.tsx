import React from 'react';
import { Trophy, Target, Sparkles, ExternalLink } from 'lucide-react';
import { DREAM_PROFESSION, PERSONAL_INFO } from '../data/portfolioData';

export const DreamProfessionSection: React.FC = () => {
  return (
    <section id="profession" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs font-mono-code text-[#86a2ff] uppercase tracking-widest">
          <Trophy className="w-4 h-4" />
          <span>ЗОРИЛГО БА ТЭМҮҮЛЭЛ</span>
        </div>
        <h2 className="font-serif-display text-4xl sm:text-5xl text-white font-medium">
          {DREAM_PROFESSION.title}
        </h2>
        <p className="text-lg text-[#dfe3fb] font-light max-w-2xl mx-auto">
          {DREAM_PROFESSION.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Story & Photo */}
        <div className="lg:col-span-5 flex flex-col justify-between glass-card rounded-2xl p-6 sm:p-8 overflow-hidden relative">
          <div className="space-y-6">
            <div className="relative w-full h-64 rounded-xl overflow-hidden border border-[#8492ff]/30 shadow-lg">
              <img
                src={PERSONAL_INFO.soccerPitch}
                alt="Хөл бөмбөгийн талбай"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08153e]/90 via-[#08153e]/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="font-mono-code text-xs text-[#86a2ff] uppercase tracking-wider block mb-1">
                  Талбайн замнал
                </span>
                <p className="text-white font-serif-display text-xl leading-tight">
                  "Мэргэжлийн хөл бөмбөгчин болох хүсэл мөрөөдөл"
                </p>
              </div>
            </div>

            <div className="space-y-4 text-[#dfe3fb] leading-relaxed text-sm sm:text-base">
              <p>{DREAM_PROFESSION.description}</p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#8492ff]/20 flex items-center justify-between">
            <span className="font-serif-display text-lg text-white italic">
              {DREAM_PROFESSION.motto}
            </span>
            <a
              href="https://graceful-meringue-2b7911.netlify.app/minii-mergjil.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code text-[#86a2ff] hover:text-white bg-[#0c163b] hover:bg-[#192866] border border-[#8492ff]/30 rounded-lg transition-all"
            >
              <span>Дэлгэрэнгүй хуудас</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Column: 4 Reasons & 4 Goals */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Box 1: Why I chose this profession (4 Reasons) */}
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-[#5560FF]/20 border border-[#8492ff]/30 flex items-center justify-center text-[#86a2ff]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif-display text-2xl text-white font-medium">
                Яагаад энэ мэргэжлийг сонгосон бэ?
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DREAM_PROFESSION.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#09153d]/70 border border-[#8492ff]/20 hover:border-[#8492ff]/40 transition-colors flex items-start gap-3.5"
                >
                  <span className="text-2xl shrink-0 select-none">{reason.icon}</span>
                  <p className="text-sm text-[#dfe3fb] font-medium leading-snug">
                    {reason.text.replace(/^[^\s]+\s/, '')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Box 2: My 4 Goals */}
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-[#5560FF]/20 border border-[#8492ff]/30 flex items-center justify-center text-[#86a2ff]">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-serif-display text-2xl text-white font-medium">
                Миний 4 том зорилго
              </h3>
            </div>

            <div className="space-y-3.5">
              {DREAM_PROFESSION.goals.map((goal, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-[#09153d]/70 border border-[#8492ff]/20 hover:border-[#8492ff]/40 transition-all"
                >
                  <span className="font-mono-code text-sm font-semibold text-[#86a2ff] px-2.5 py-1 rounded bg-[#0c1a4e] border border-[#8492ff]/30">
                    {goal.number}
                  </span>
                  <span className="text-sm text-[#dfe3fb] font-medium">
                    {goal.text.replace(/^\d+\.\s*/, '')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
