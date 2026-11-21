import React, { useState } from 'react';
import { ArrowUpRight, Video } from 'lucide-react';
import { PERSONAL_INFO, YOUTUBE_VIDEOS } from '../data/portfolioData';

export const YouTubeSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Бүгд');
  const [avatarError, setAvatarError] = useState(false);

  const categories = ['Бүгд', 'Хөгжим', 'Тоглоом', 'Live', 'Аниме'];

  const filteredVideos =
    activeCategory === 'Бүгд'
      ? YOUTUBE_VIDEOS
      : YOUTUBE_VIDEOS.filter((v) => v.category === activeCategory || v.category === 'Бүгд');

  return (
    <section id="youtube" className="py-20 lg:py-28 bg-white text-[#070102]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 mb-10 border-b border-slate-200">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#DC2626] mb-2">
              Видео цуглуулга ба медиа
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#070102] [text-wrap:balance]">
              YOUTUBE <span className="text-[#DC2626]">ХУУДАС</span>
            </h2>
          </div>

          {/* Channel Action Row */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 bg-[#070102] shrink-0">
                {!avatarError ? (
                  <img
                    src={PERSONAL_INFO.studioImage}
                    alt="YouTube суваг"
                    onError={() => setAvatarError(true)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#EF4444]">
                    <Video className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-[#070102]">{PERSONAL_INFO.name} — Суваг</p>
                <p className="text-xs text-slate-500">youtube.html төслийн шууд цомог</p>
              </div>
            </div>

            <a
              href="https://graceful-meringue-2b7911.netlify.app/youtube.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#070102] hover:bg-[#DC2626] text-white text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              <span>YouTube хуудсыг нээх</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Interactive Category Filter Segmented Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div
            role="tablist"
            aria-label="Видео төрөл шүүх"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200"
          >
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#070102] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#DC2626]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <p className="text-xs font-medium text-slate-500 tabular-nums">
            Нийт {filteredVideos.length} видео харагдаж байна
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, idx) => (
            <div
              key={`${video.id}-${idx}`}
              className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div className="relative w-full aspect-video bg-[#070102]">
                <iframe
                  src={video.embedUrl}
                  title={video.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              <div className="p-4 flex items-center justify-between gap-3 bg-white border-t border-slate-200">
                <h3 className="text-sm sm:text-base font-bold text-[#070102] truncate">
                  {video.title}
                </h3>
                <span className="text-xs font-semibold text-[#DC2626] whitespace-nowrap shrink-0">
                  {video.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
