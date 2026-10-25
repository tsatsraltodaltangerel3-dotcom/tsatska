import React, { useMemo } from 'react';
import { Play, Pause, ExternalLink, Globe, Award, Video, Compass } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface HeroMurmurSceneProps {
  isPlaying: boolean;
  onToggleAudio: () => void;
}

export const HeroMurmurScene: React.FC<HeroMurmurSceneProps> = ({ isPlaying, onToggleAudio }) => {
  // Generate 62 waveform bars matching the exact prompt spec:
  // "62 thin rounded bars (1.9px) across 335×34 at (203, 138). Most are quiet; there's a tall bright burst at about 25%,
  // softer bumps at 33% and 68%, and a colour drift from blue #5560FF through periwinkle #86A2FF to violet #A083FF"
  const waveformBars = useMemo(() => {
    const barsCount = 62;
    return Array.from({ length: barsCount }, (_, i) => {
      const pos = i / (barsCount - 1);
      // Tall burst near 25% (0.25)
      const burst1 = Math.exp(-Math.pow((pos - 0.25) / 0.06, 2)) * 0.95;
      // Soft bump near 33% (0.33)
      const burst2 = Math.exp(-Math.pow((pos - 0.35) / 0.07, 2)) * 0.65;
      // Soft bump near 68% (0.68)
      const burst3 = Math.exp(-Math.pow((pos - 0.68) / 0.08, 2)) * 0.75;
      // Base quiet ripple
      const base = 0.18 + 0.12 * Math.sin(i * 0.45);
      const heightPercent = Math.min(100, Math.max(16, (base + burst1 + burst2 + burst3) * 100));

      // Color interpolation: #5560FF -> #86A2FF -> #A083FF
      let color = '#5560FF';
      if (pos > 0.5) {
        color = '#A083FF';
      } else if (pos > 0.25) {
        color = '#86A2FF';
      }

      // Delay for staggered breathing loop
      const delay = (i % 8) * 0.2;

      return {
        id: i,
        heightPercent,
        color,
        delay,
      };
    });
  }, []);

  return (
    <section id="hero" className="relative w-full min-h-screen pt-16 flex items-center justify-center overflow-hidden bg-[#040918]">
      {/* ==============================================================
          1. SCENE BACKGROUND (PLATE & VIDEO)
          ============================================================== */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* The 16:10 Plate Image */}
        <img
          src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/7a7598ba-a6f8-42b4-ac39-98279dac4192.jpg"
          alt="Rainy blue hour window view"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
        />

        {/* Looping Video: 111.11% width, left -5.556% */}
        <video
          src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/d41b8c1d-f175-43b3-af22-7081133aa8de.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 h-full max-w-none object-cover opacity-80 mix-blend-screen pointer-events-none"
          style={{
            width: '111.11%',
            left: '-5.556%',
          }}
        />

        {/* ==============================================================
            2. LIGHTING LAYERS (Bloom & Headlight Sweep)
            ============================================================== */}
        {/* Bloom 1: Pink radial glow over city lights */}
        <div
          className="absolute top-[28%] left-[45%] w-[380px] h-[380px] rounded-full blur-[90px] pointer-events-none mix-blend-screen animate-bloom-1"
          style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.45) 0%, rgba(244,114,182,0) 70%)' }}
        />

        {/* Bloom 2: Amber radial glow over warm bokeh */}
        <div
          className="absolute top-[35%] right-[25%] w-[420px] h-[420px] rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-bloom-2"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.38) 0%, rgba(251,191,36,0) 70%)' }}
        />

        {/* Bloom 3: Periwinkle radial glow */}
        <div
          className="absolute top-[20%] left-[25%] w-[460px] h-[460px] rounded-full blur-[110px] pointer-events-none mix-blend-screen animate-bloom-3"
          style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.4) 0%, rgba(129,140,248,0) 70%)' }}
        />

        {/* Sweep: Pale diagonal light band sweeping every 7s */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen overflow-hidden"
        >
          <div
            className="w-[200%] h-[300px] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-3xl animate-sweep"
            style={{ top: '35%' }}
          />
        </div>

        {/* Subtle dark vignette scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040918]/60 via-transparent to-[#040918]/90" />
      </div>

      {/* ==============================================================
          3. SCALED CONTENT FRAME (Responsive Desktop & Mobile)
          ============================================================== */}
      <div className="relative z-10 w-full max-w-[1440px] min-h-[850px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center justify-between">
        
        {/* --- Top Titles & Wordmark --- */}
        <div className="text-center pt-2 sm:pt-6 space-y-2 max-w-3xl">
          {/* Wordmark: Newsreader, white, tracking +.05em with soft navy shadow */}
          <h1
            className="font-serif-display text-5xl sm:text-7xl md:text-8xl lg:text-[104px] leading-tight font-medium text-white tracking-[0.05em]"
            style={{
              textShadow: '0 12px 35px rgba(2, 6, 23, 0.85), 0 2px 10px rgba(132, 146, 255, 0.35)',
            }}
          >
            {PERSONAL_INFO.name}
          </h1>

          {/* Subtitle: Inter, lavender #dfe3fb */}
          <p className="text-lg sm:text-2xl md:text-3xl text-[#dfe3fb] font-light tracking-wide">
            Хувийн портфолио & Мөрөөдлийн аялал
          </p>

          {/* Label: IBM Plex Mono 12.6px, tracking .05em */}
          <div className="pt-2">
            <span className="font-mono-code text-xs sm:text-[13px] tracking-[0.08em] text-[#b9c4ea] uppercase px-3 py-1 rounded bg-[#08153e]/60 border border-[#8492ff]/25 backdrop-blur-sm">
              МИНИЙ МЭДЭЭЛЭЛ, ЗУРАГ & БҮТЭЭЛҮҮД
            </span>
          </div>
        </div>

        {/* --- Middle: The Iconic Player Card --- */}
        <div className="my-6 w-full max-w-[660px]">
          <div className="glass-card rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-all duration-300">
            {/* Subtle glow highlight */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#5560FF]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Cover Art: 158x156 (user photo from index.html) */}
              <div className="relative w-36 h-36 sm:w-[158px] sm:h-[156px] shrink-0 rounded-[10px] overflow-hidden border border-[#8492ff]/40 shadow-lg group">
                <img
                  src={PERSONAL_INFO.avatar}
                  alt={PERSONAL_INFO.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08153e]/90 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2.5 font-serif-display text-sm font-semibold text-white tracking-wide drop-shadow-md">
                  {PERSONAL_INFO.name}
                </span>
              </div>

              {/* Card Meta & Controls */}
              <div className="flex-1 w-full flex flex-col justify-between min-h-[145px]">
                <div>
                  <h3 className="text-white text-lg sm:text-xl font-medium leading-snug line-clamp-2">
                    Миний мөрөөдөл бол мэргэжлийн хөл бөмбөгчин болох
                  </h3>
                  <div className="font-mono-code text-xs text-[#7583bd] mt-1.5 flex items-center gap-2">
                    <span>18 настай</span>
                    <span>·</span>
                    <span>Хөл бөмбөгчин</span>
                    <span>·</span>
                    <span>Цацралт-Од</span>
                  </div>
                </div>

                {/* Waveform & Play Button Row */}
                <div className="mt-4 pt-2 border-t border-[#8492ff]/15 flex items-center justify-between gap-3">
                  {/* Waveform: 62 thin rounded bars with breathing motion */}
                  <div
                    className="flex-1 h-8 flex items-end justify-between gap-[2px] px-1 cursor-pointer"
                    onClick={onToggleAudio}
                    title="Аудио тоглуулах / түр зогсоох"
                  >
                    {waveformBars.map((bar) => (
                      <span
                        key={bar.id}
                        className={`w-[2.2px] rounded-full transition-all duration-300 ${
                          isPlaying ? 'animate-bar' : 'opacity-65'
                        }`}
                        style={{
                          height: `${bar.heightPercent}%`,
                          backgroundColor: bar.color,
                          animationDelay: `${bar.delay}s`,
                          boxShadow: isPlaying ? `0 0 6px ${bar.color}88` : 'none',
                        }}
                      />
                    ))}
                  </div>

                  {/* Play Button: 37px off-white circle with navy play triangle */}
                  <button
                    onClick={onToggleAudio}
                    className="w-10 h-10 shrink-0 rounded-full bg-[#f4f6ff] hover:bg-white text-[#08153e] flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(134,162,255,0.8)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                    aria-label={isPlaying ? "Түр зогсоох" : "Борооны аяс тоглуулах"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-[#08153e]" />
                    ) : (
                      <Play className="w-4 h-4 fill-[#08153e] ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Bottom: About Lines & Platform Links Row --- */}
        <div className="w-full max-w-4xl space-y-6 pt-2">
          {/* About Section: IBM Plex Mono */}
          <div className="glass-card rounded-xl p-5 sm:p-6 text-left">
            <h4 className="font-mono-code text-xs uppercase tracking-[0.12em] text-[#86a2ff] font-semibold mb-2.5 flex items-center gap-2">
              <span>●</span>
              <span>МИНИЙ ТУХАЙ (ABOUT)</span>
            </h4>
            <div className="font-mono-code text-xs sm:text-sm text-[#dfe3fb] leading-relaxed space-y-1.5 opacity-90">
              <p>Сайн байна уу, намайг Цацралт-Од гэдэг. Би 18 настай.</p>
              <p>Хөл бөмбөг тоглох, өдөр бүр бэлтгэл сургуулилт хийж чадвараа сайжруулах дуртай.</p>
              <p>Миний мөрөөдөл бол ирээдүйд мэргэжлийн хөл бөмбөгчин болж, олон тэмцээнд амжилт гаргах.</p>
              <p className="text-[#86a2ff]">Хобби: Хөл бөмбөг · Кино: Гоол · Дуучин: Гангаа · Тоглоом: eFootball · Сонирхол: Аялал</p>
            </div>
          </div>

          {/* Platform / Netlify Links Row */}
          <div className="glass-card rounded-xl px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mono-code text-xs uppercase tracking-[0.08em] text-[#b9c4ea] text-center sm:text-left">
              МИНИЙ БҮТЭЭЛҮҮД БА ШУУД ХОЛБООСУУД
            </span>

            <div className="flex items-center gap-2.5">
              <a
                href="https://graceful-meringue-2b7911.netlify.app/index.html"
                target="_blank"
                rel="noopener noreferrer"
                title="Нүүр хуудас (Шинэ цонхонд)"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c163b] hover:bg-[#182760] border border-[#8492ff]/30 text-xs font-mono-code text-white hover:text-[#86a2ff] transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-[#86a2ff]" />
                <span>Нүүр хуудас</span>
                <ExternalLink className="w-3 h-3 text-[#7583bd]" />
              </a>

              <a
                href="https://graceful-meringue-2b7911.netlify.app/minii-mergjil.html"
                target="_blank"
                rel="noopener noreferrer"
                title="Миний мэргэжил (Шинэ цонхонд)"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c163b] hover:bg-[#182760] border border-[#8492ff]/30 text-xs font-mono-code text-white hover:text-[#86a2ff] transition-all"
              >
                <Award className="w-3.5 h-3.5 text-[#86a2ff]" />
                <span>Миний мэргэжил</span>
                <ExternalLink className="w-3 h-3 text-[#7583bd]" />
              </a>

              <a
                href="https://graceful-meringue-2b7911.netlify.app/youtube.html"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube хуудас (Шинэ цонхонд)"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c163b] hover:bg-[#182760] border border-[#8492ff]/30 text-xs font-mono-code text-white hover:text-[#86a2ff] transition-all"
              >
                <Video className="w-3.5 h-3.5 text-[#86a2ff]" />
                <span>YouTube хуудас</span>
                <ExternalLink className="w-3 h-3 text-[#7583bd]" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
