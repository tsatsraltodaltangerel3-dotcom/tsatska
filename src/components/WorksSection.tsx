import React, { useState } from 'react';
import { ArrowUpRight, Layers } from 'lucide-react';
import { MY_WORKS, WorkProject } from '../data/portfolioData';

const WorkCard: React.FC<{ work: WorkProject }> = ({ work }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={work.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${work.title} төслийг шинэ цонхонд үзэх`}
      className="group bg-white border border-slate-200 hover:border-[#0284C7] rounded-xl overflow-hidden flex flex-col justify-between transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
    >
      <div>
        {/* Image Frame */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#021327]">
          {!imgError ? (
            <img
              src={work.image}
              alt={work.title}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#021327] to-[#0B3B69] text-white/80 p-6">
              <Layers className="w-8 h-8 text-[#38BDF8] mb-2" />
              <span className="font-display text-xl uppercase tracking-wide">{work.title}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#021327]/70 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-[#021327] flex items-center justify-center shadow-sm group-hover:bg-[#38BDF8] transition-colors duration-150">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {/* Unboxed Metadata Line */}
          <div className="flex items-center gap-2 text-xs font-medium text-[#0284C7] mb-2 tabular-nums">
            <span className="font-mono-code font-semibold">{work.index}</span>
            <span aria-hidden="true">·</span>
            <span>{work.category}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">{work.subtitle}</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#021327] group-hover:text-[#0284C7] transition-colors duration-150 mb-3">
            {work.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5">
            {work.description}
          </p>

          {/* Unboxed Highlights Row */}
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            {work.highlights.join(' · ')}
          </p>
        </div>
      </div>

      {/* Hairline Footer */}
      <div className="px-6 sm:px-8 py-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#021327]">
        <span className="font-mono-code text-slate-400 truncate max-w-[220px]">
          {work.url.replace('https://', '')}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[#0284C7] group-hover:translate-x-0.5 transition-transform duration-150 whitespace-nowrap shrink-0">
          <span>Шинэ цонхонд үзэх</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </a>
  );
};

export const WorksSection: React.FC = () => {
  return (
    <section id="works" className="py-20 lg:py-28 bg-[#F4F7FA] text-[#021327]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 mb-12 border-b border-slate-200">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0284C7] mb-2">
              Бүтээлүүдийн цуглуулга
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#021327] [text-wrap:balance]">
              МИНИЙ <span className="text-[#0284C7]">БҮТЭЭЛҮҮД</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">
            Миний хөгжүүлсэн вэб хуудсууд болон интерактив JavaScript төслүүд. Төсөл бүр дээр дарж шинэ цонхонд шууд үзнэ үү.
          </p>
        </div>

        {/* 2-Column Editorial Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MY_WORKS.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      </div>
    </section>
  );
};
