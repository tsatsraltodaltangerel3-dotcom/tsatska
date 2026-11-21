import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Layers, Trophy, X } from 'lucide-react';
import {
  FOOTBALL_INFO_ITEMS,
  FootballInfoItem,
  TOP5_LEAGUES_2000_2026,
  Top5LeagueSeason,
} from '../data/portfolioData';

type LeagueFilterKey = 'all' | 'premierLeague' | 'laLiga' | 'serieA' | 'bundesliga' | 'ligue1';

const LEAGUE_TABS: { key: LeagueFilterKey; label: string; country: string }[] = [
  { key: 'all', label: 'Бүх 5 лиг', country: '2000–2026' },
  { key: 'premierLeague', label: 'Premier League', country: 'Англи' },
  { key: 'laLiga', label: 'La Liga', country: 'Испани' },
  { key: 'serieA', label: 'Serie A', country: 'Итали' },
  { key: 'bundesliga', label: 'Bundesliga', country: 'Герман' },
  { key: 'ligue1', label: 'Ligue 1', country: 'Франц' },
];

const FootballInfoCard: React.FC<{
  item: FootballInfoItem;
  onSelect: (item: FootballInfoItem) => void;
}> = ({ item, onSelect }) => {
  const [imgError, setImgError] = useState(false);

  const cardContent = (
    <>
      <div className="w-full">
        {/* Image Frame */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#070102]">
          {!imgError ? (
            <img
              src={item.image}
              alt={item.title}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#070102] to-[#450A0A] text-white/80 p-6">
              <Layers className="w-8 h-8 text-[#EF4444] mb-2" />
              <span className="font-display text-xl uppercase tracking-wide">{item.title}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070102]/70 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-[#070102] flex items-center justify-center shadow-sm group-hover:bg-[#DC2626] group-hover:text-white transition-colors duration-150">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {/* Unboxed Metadata Line */}
          <div className="flex items-center gap-2 text-xs font-medium text-[#DC2626] mb-2 tabular-nums">
            <span className="font-mono-code font-semibold">{item.index}</span>
            <span aria-hidden="true">·</span>
            <span>{item.category}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">{item.subtitle}</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#070102] group-hover:text-[#DC2626] transition-colors duration-150 mb-3">
            {item.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5">
            {item.description}
          </p>

          {/* Unboxed Highlights Row */}
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            {item.highlights.join(' · ')}
          </p>
        </div>
      </div>

      {/* Hairline Footer */}
      <div className="w-full px-6 sm:px-8 py-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#070102]">
        <span className="font-mono-code text-slate-400 truncate max-w-[220px]">
          {item.sourceLabel}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[#DC2626] group-hover:translate-x-0.5 transition-transform duration-150 whitespace-nowrap shrink-0">
          <span>{item.url ? 'Шинэ цонхонд үзэх' : 'Дэлгэрэнгүй унших'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </>
  );

  const sharedClasses =
    'group text-left bg-white border border-slate-200 hover:border-[#DC2626] rounded-xl overflow-hidden flex flex-col justify-between transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]';

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.title} — шинэ цонхонд үзэх`}
        className={sharedClasses}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-label={`${item.title} мэдээллийг дэлгэрэнгүй үзэх`}
      className={sharedClasses}
    >
      {cardContent}
    </button>
  );
};

export const FootballInfoSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<FootballInfoItem | null>(null);
  const [activeLeague, setActiveLeague] = useState<LeagueFilterKey>('all');

  useEffect(() => {
    if (!selectedItem) return;
    setActiveLeague('all');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  const singleLeagueLeaderboard = useMemo(() => {
    if (activeLeague === 'all') return [];
    const counts = new Map<string, number>();
    TOP5_LEAGUES_2000_2026.forEach((row: Top5LeagueSeason) => {
      const club = row[activeLeague];
      if (!club || club.includes('Олгогдоогүй')) return;
      const cleanName = club.replace('*', '');
      counts.set(cleanName, (counts.get(cleanName) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([club, titles]) => ({ club, titles }))
      .sort((a, b) => b.titles - a.titles);
  }, [activeLeague]);

  return (
    <section
      id="football-info"
      className="py-20 lg:py-28 bg-[#F4F7FA] text-[#070102] border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 mb-12 border-b border-slate-200">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#DC2626] mb-2">
              Спортын мэдээлэл ба шинжилгээ
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#070102] [text-wrap:balance]">
              ХӨЛ БӨМБӨГИЙН <span className="text-[#DC2626]">МЭДЭЭЛЭЛ</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">
            Олон улсын лигүүдийн онцлох үйл явдал, 2000–2026 оны Топ 5 лигийн аваргууд, тактик болон бэлтгэлийн мэдээллүүд.
          </p>
        </div>

        {/* 2-Column Editorial Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FOOTBALL_INFO_ITEMS.map((item) => (
            <FootballInfoCard key={item.id} item={item} onSelect={setSelectedItem} />
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="football-info-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedItem(null);
            }
          }}
          className="fixed inset-0 z-50 bg-[#070102]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <div
            className={`relative w-full ${
              selectedItem.hasTop5Archive ? 'max-w-5xl' : 'max-w-2xl'
            } my-auto bg-[#140407] border border-red-500/25 rounded-2xl overflow-hidden text-white shadow-2xl max-h-[90vh] flex flex-col`}
          >
            <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-[#070102] shrink-0">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140407] via-[#140407]/50 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Цонх хаах"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#070102]/85 hover:bg-[#DC2626] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EF4444] mb-1">
                  {selectedItem.index} · {selectedItem.category} · {selectedItem.subtitle}
                </p>
                <h3
                  id="football-info-modal-title"
                  className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white"
                >
                  {selectedItem.title}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              <div className="space-y-3 text-sm sm:text-base text-[#E2E8F0] leading-relaxed">
                {selectedItem.fullDetails.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {selectedItem.hasTop5Archive && (
                <div className="space-y-5 pt-2">
                  {/* League Filter Tabs */}
                  <div
                    role="tablist"
                    aria-label="Лиг сонгох"
                    className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#070102] border border-red-500/20 rounded-xl"
                  >
                    {LEAGUE_TABS.map((tab) => {
                      const active = activeLeague === tab.key;
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setActiveLeague(tab.key)}
                          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                            active
                              ? 'bg-[#DC2626] text-white'
                              : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {tab.label} <span className="opacity-70">({tab.country})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Single League Title Leaderboard */}
                  {activeLeague !== 'all' && singleLeagueLeaderboard.length > 0 && (
                    <div className="bg-[#070102] border border-red-500/20 rounded-xl p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EF4444] mb-3">
                        <Trophy className="w-4 h-4" aria-hidden="true" />
                        <span>2000–2026 оны түрүүний тоогоор</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {singleLeagueLeaderboard.map((entry) => (
                          <div
                            key={entry.club}
                            className="p-3 rounded-lg bg-[#140407] border border-red-500/15 flex items-center justify-between gap-2"
                          >
                            <span className="text-xs sm:text-sm font-semibold text-white truncate">
                              {entry.club}
                            </span>
                            <span className="font-display text-lg font-bold text-[#EF4444] tabular-nums shrink-0">
                              {entry.titles}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Full 2000–2026 Champions Table */}
                  <div className="bg-[#070102] border border-red-500/20 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-[#1B0509] border-b border-red-500/20 text-[#EF4444] uppercase text-xs tracking-wider">
                            <th className="py-3 px-4 font-semibold whitespace-nowrap">Улирал</th>
                            {(activeLeague === 'all' || activeLeague === 'premierLeague') && (
                              <th className="py-3 px-4 font-semibold whitespace-nowrap">Premier League</th>
                            )}
                            {(activeLeague === 'all' || activeLeague === 'laLiga') && (
                              <th className="py-3 px-4 font-semibold whitespace-nowrap">La Liga</th>
                            )}
                            {(activeLeague === 'all' || activeLeague === 'serieA') && (
                              <th className="py-3 px-4 font-semibold whitespace-nowrap">Serie A</th>
                            )}
                            {(activeLeague === 'all' || activeLeague === 'bundesliga') && (
                              <th className="py-3 px-4 font-semibold whitespace-nowrap">Bundesliga</th>
                            )}
                            {(activeLeague === 'all' || activeLeague === 'ligue1') && (
                              <th className="py-3 px-4 font-semibold whitespace-nowrap">Ligue 1</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-red-500/10">
                          {TOP5_LEAGUES_2000_2026.map((row) => (
                            <tr key={row.season} className="hover:bg-white/[0.03] transition-colors">
                              <td className="py-2.5 px-4 font-mono-code font-semibold text-[#EF4444] tabular-nums whitespace-nowrap">
                                {row.season}
                              </td>
                              {(activeLeague === 'all' || activeLeague === 'premierLeague') && (
                                <td className="py-2.5 px-4 text-white font-medium whitespace-nowrap">
                                  {row.premierLeague}
                                </td>
                              )}
                              {(activeLeague === 'all' || activeLeague === 'laLiga') && (
                                <td className="py-2.5 px-4 text-[#E2E8F0] whitespace-nowrap">
                                  {row.laLiga}
                                </td>
                              )}
                              {(activeLeague === 'all' || activeLeague === 'serieA') && (
                                <td className="py-2.5 px-4 text-[#E2E8F0] whitespace-nowrap">
                                  {row.serieA}
                                </td>
                              )}
                              {(activeLeague === 'all' || activeLeague === 'bundesliga') && (
                                <td className="py-2.5 px-4 text-[#E2E8F0] whitespace-nowrap">
                                  {row.bundesliga}
                                </td>
                              )}
                              {(activeLeague === 'all' || activeLeague === 'ligue1') && (
                                <td className="py-2.5 px-4 text-[#E2E8F0] whitespace-nowrap">
                                  {row.ligue1}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    * Тэмдэглэл: 2004–05 оны Serie A-ийн цомыг Calciopoli хэргийн улмаас олгоогүй бөгөөд 2005–06 оны цомыг Inter Milan-д шилжүүлсэн.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-red-500/20 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-medium text-[#94A3B8]">
                  {selectedItem.highlights.join(' · ')}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Хаах
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
