import React from 'react';
import { Calendar, Activity, Music, Film, Gamepad2, Dumbbell, Compass, Info } from 'lucide-react';
import { FACTS, PERSONAL_INFO } from '../data/portfolioData';

export const FactsSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calendar':
        return <Calendar className="w-5 h-5 text-[#86a2ff]" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-[#86a2ff]" />;
      case 'Music':
        return <Music className="w-5 h-5 text-[#86a2ff]" />;
      case 'Film':
        return <Film className="w-5 h-5 text-[#86a2ff]" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5 text-[#86a2ff]" />;
      case 'Dumbbell':
        return <Dumbbell className="w-5 h-5 text-[#86a2ff]" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-[#86a2ff]" />;
      default:
        return <Info className="w-5 h-5 text-[#86a2ff]" />;
    }
  };

  return (
    <section id="facts" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs font-mono-code text-[#86a2ff] uppercase tracking-widest">
          <Info className="w-4 h-4" />
          <span>ХУВИЙН МЭДЭЭЛЭЛ & СОНИРХОЛ</span>
        </div>
        <h2 className="font-serif-display text-4xl sm:text-5xl text-white font-medium">
          Сонирхолтой фактууд
        </h2>
        <p className="text-base sm:text-lg text-[#b9c4ea] max-w-2xl mx-auto">
          Миний тухай, дуртай зүйлс болон чөлөөт цагаа хэрхэн өнгөрүүлдэг тухай товч мэдээллүүд.
        </p>
      </div>

      {/* Facts Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {FACTS.map((fact) => (
          <div
            key={fact.id}
            className="glass-card glass-card-hover rounded-xl p-6 flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#0d1c4b] border border-[#8492ff]/30 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-[#86a2ff]/60 transition-all">
                {getIcon(fact.icon)}
              </div>
              <span className="font-mono-code text-xs text-[#7583bd] uppercase tracking-wider block mb-1">
                {fact.label}
              </span>
              <h3 className="font-serif-display text-xl sm:text-2xl text-white font-medium mb-1">
                {fact.value}
              </h3>
            </div>
            
            {fact.subtext && (
              <p className="text-xs text-[#b9c4ea] mt-3 pt-3 border-t border-[#8492ff]/15">
                {fact.subtext}
              </p>
            )}
          </div>
        ))}

        {/* Highlight Card: Travel Quote */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between bg-gradient-to-br from-[#0c1844] to-[#122361] border border-[#8492ff]/40 sm:col-span-2 lg:col-span-2 xl:col-span-1">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#5560FF]/30 border border-[#8492ff]/40 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-mono-code text-xs text-[#86a2ff] uppercase tracking-wider block mb-1">
              Дэлхийгээр аялах
            </span>
            <h3 className="font-serif-display text-xl text-white font-medium">
              "Дэлхийн олон оронд аялж, хөл бөмбөг тоглохыг мөрөөддөг"
            </h3>
          </div>
          <p className="text-xs text-[#dfe3fb]/80 mt-4 pt-3 border-t border-[#8492ff]/20">
            {PERSONAL_INFO.name} · 18 настай
          </p>
        </div>
      </div>
    </section>
  );
};
