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
    <div className="min-h-screen bg-[#021327] text-white font-sans selection:bg-[#38BDF8] selection:text-[#021327]">
      <Header />

      <main>
        <HeroMurmurScene isPlaying={isPlaying} onToggleAudio={handleToggleAudio} />
        <WorksSection />
        <DreamProfessionSection />
        <FactsSection />
        <YouTubeSection />
      </main>

      <Footer />
    </div>
  );
}
