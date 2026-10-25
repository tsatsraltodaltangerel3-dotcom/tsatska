/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroMurmurScene } from './components/HeroMurmurScene';
import { WorksSection } from './components/WorksSection';
import { DreamProfessionSection } from './components/DreamProfessionSection';
import { FactsSection } from './components/FactsSection';
import { YouTubeSection } from './components/YouTubeSection';
import { Footer } from './components/Footer';
import { ambientAudio } from './utils/ambientAudio';

export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleToggleAudio = () => {
    const playing = ambientAudio.toggle();
    setIsPlaying(playing);
  };

  useEffect(() => {
    return () => {
      ambientAudio.stop();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#040918] text-[#dfe3fb] font-sans selection:bg-[#5560FF] selection:text-white">
      {/* Top Bar */}
      <Header isPlaying={isPlaying} onToggleAudio={handleToggleAudio} />

      {/* Hero: Murmur Cinematic Scene (Plate, Looping Video, Glass Player, Waveform, Ambient Sound) */}
      <main>
        <HeroMurmurScene isPlaying={isPlaying} onToggleAudio={handleToggleAudio} />

        {/* Миний бүтээлүүд: Нэг жагсаалт (Array) - Карт бүр шинэ цонхонд нээгдэнэ */}
        <WorksSection />

        {/* Миний мөрөөдлийн мэргэжил & 4 том зорилго */}
        <DreamProfessionSection />

        {/* Сонирхолтой фактууд (18 нас, Хөл бөмбөг, Гоол, Гангаа, eFootball, Аялал) */}
        <FactsSection />

        {/* YouTube хуудас (youtube.html дахь видеонууд ба категориуд) */}
        <YouTubeSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
