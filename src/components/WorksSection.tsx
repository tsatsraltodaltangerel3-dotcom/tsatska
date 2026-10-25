import React from 'react';
import { ExternalLink, Layers, ArrowUpRight } from 'lucide-react';
import { MY_WORKS, WorkProject } from '../data/portfolioData';

export const WorksSection: React.FC = () => {
  return (
    <section id="works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs font-mono-code text-[#86a2ff] uppercase tracking-widest">
          <Layers className="w-4 h-4" />
          <span>БҮТЭЭЛҮҮДИЙН ЦУГЛУУЛГА</span>
        </div>
        <h2 className="font-serif-display text-4xl sm:text-5xl text-white font-medium">
          Миний бүтээлүүд
        </h2>
        <p className="text-base sm:text-lg text-[#b9c4ea] max-w-2xl mx-auto">
          Миний бэлтгэсэн вэб хуудсууд болон төслүүдийн жагсаалт. Карт бүр дээр дарж шинэ цонхонд шууд нээж үзэх боломжтой.
        </p>
      </div>

      {/* Works Grid - Array items rendered as cards opening in new tab */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MY_WORKS.map((work: WorkProject) => (
          <a
            key={work.id}
            href={work.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative cursor-pointer text-left block"
            aria-label={`${work.title} төслийг шинэ цонхонд үзэх`}
          >
            {/* Top Image Preview */}
            <div>
              <div className="relative w-full h-52 rounded-xl overflow-hidden mb-6 border border-[#8492ff]/25 bg-[#030712]">
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08153e]/85 via-transparent to-transparent" />
                
                {/* Clean Unboxed Category & Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 bg-[#08153e]/90 backdrop-blur-md rounded-md border border-[#8492ff]/30 text-xs font-mono-code text-[#dfe3fb]">
                  {work.badge}
                </div>

                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#08153e]/80 backdrop-blur-md border border-[#8492ff]/30 flex items-center justify-center text-[#dfe3fb] group-hover:text-white group-hover:bg-[#5560FF] transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>

                <div className="absolute bottom-3 left-3 text-xs font-mono-code text-[#dfe3fb]/80">
                  {work.category}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-serif-display text-2xl text-white font-medium group-hover:text-[#86a2ff] transition-colors mb-2">
                {work.title}
              </h3>
              
              <p className="text-sm text-[#b9c4ea] leading-relaxed mb-5">
                {work.description}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2 mb-6">
                {work.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="text-xs font-mono-code text-[#dfe3fb] bg-[#0d1c4b]/80 border border-[#8492ff]/20 px-2.5 py-1 rounded"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Action Row */}
            <div className="pt-4 border-t border-[#8492ff]/20 flex items-center justify-between text-xs font-mono-code text-[#86a2ff]">
              <span className="truncate max-w-[200px] text-[#7583bd] group-hover:text-[#b9c4ea] transition-colors">
                {work.url.replace('https://', '')}
              </span>
              <span className="flex items-center gap-1 font-medium group-hover:translate-x-0.5 transition-transform">
                Шинэ цонхонд үзэх
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
