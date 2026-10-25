import React, { useState } from 'react';
import { Video, ExternalLink, PlaySquare } from 'lucide-react';
import { YOUTUBE_VIDEOS, PERSONAL_INFO } from '../data/portfolioData';

export const YouTubeSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Бүгд');

  const categories = ['Бүгд', 'Хөгжим', 'Тоглоом', 'Live', 'Аниме'];

  const filteredVideos = activeCategory === 'Бүгд'
    ? YOUTUBE_VIDEOS
    : YOUTUBE_VIDEOS.filter((v) => v.category === activeCategory || v.category === 'Бүгд');

  return (
    <section id="youtube" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs font-mono-code text-[#86a2ff] uppercase tracking-widest">
          <Video className="w-4 h-4" />
          <span>ВИДЕО ЦУГЛУУЛГА & МЕДИА</span>
        </div>
        <h2 className="font-serif-display text-4xl sm:text-5xl text-white font-medium">
          YouTube хуудас
        </h2>
        <p className="text-base sm:text-lg text-[#b9c4ea] max-w-2xl mx-auto">
          Миний бэлтгэсэн YouTube клон төсөл дээрх сонирхолтой бичлэгүүд болон төрлүүд.
        </p>
      </div>

      {/* Top Banner with Profile & External Link */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#8492ff]/40 shrink-0">
            <img
              src={PERSONAL_INFO.playerProfile}
              alt="YouTube Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="font-serif-display text-lg text-white font-medium">
              {PERSONAL_INFO.name} — YouTube суваг
            </h3>
            <p className="font-mono-code text-xs text-[#7583bd]">
              youtube.html төслийн шууд бүрэлдэхүүн
            </p>
          </div>
        </div>

        {/* Link to Netlify version */}
        <a
          href="https://graceful-meringue-2b7911.netlify.app/youtube.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5560FF] hover:bg-[#4651e6] active:scale-95 text-white text-xs font-mono-code transition-all shadow-md shadow-[#5560FF]/25"
        >
          <PlaySquare className="w-4 h-4" />
          <span>YouTube хуудсыг нээх</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Filter Tabs / Categories */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono-code transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#5560FF] text-white shadow-lg shadow-[#5560FF]/30 font-semibold'
                : 'bg-[#08153e]/80 text-[#b9c4ea] hover:text-white hover:bg-[#122361] border border-[#8492ff]/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Videos Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video, idx) => (
          <div
            key={video.id + idx}
            className="glass-card rounded-xl overflow-hidden p-3.5 flex flex-col justify-between border border-[#8492ff]/25 hover:border-[#86a2ff]/60 transition-all group"
          >
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/60 shadow-inner">
              <iframe
                src={video.embedUrl}
                title={video.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="pt-3 px-1 flex items-center justify-between">
              <span className="font-serif-display text-base text-white font-medium group-hover:text-[#86a2ff] transition-colors">
                {video.title}
              </span>
              <span className="font-mono-code text-xs text-[#86a2ff] px-2 py-0.5 rounded bg-[#0b1742] border border-[#8492ff]/20">
                {video.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
