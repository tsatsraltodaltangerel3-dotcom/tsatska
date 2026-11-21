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
import { FootballInfoSection } from './components/FootballInfoSection';
import { YouTubeSection } from './components/YouTubeSection';
import { ServicesSection } from './components/ServicesSection';
import { CommunitySection } from './components/CommunitySection';
import { OrderModal } from './components/OrderModal';
import { AdminPage } from './components/AdminPage';
import { Footer } from './components/Footer';
import { FirebaseProvider } from './context/FirebaseContext';
import { ambientAudio } from './utils/ambientAudio';

export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [isAdminView, setIsAdminView] = useState<boolean>(
    () => typeof window !== 'undefined' && window.location.hash === '#admin'
  );

  const handleToggleAudio = () => {
    const playing = ambientAudio.toggle();
    setIsPlaying(playing);
  };

  const handleOpenOrderModal = (serviceName: string) => {
    setSelectedService(serviceName);
    setOrderModalOpen(true);
  };

  const handleOpenAdmin = () => {
    if (typeof window !== 'undefined') {
      window.location.hash = '#admin';
    }
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleExitAdmin = () => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  useEffect(() => {
    ambientAudio.preload();
    const unsubscribe = ambientAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    const onHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => {
      unsubscribe();
      window.removeEventListener('hashchange', onHashChange);
      ambientAudio.stop();
    };
  }, []);

  return (
    <FirebaseProvider>
      {isAdminView ? (
        <div className="min-h-screen bg-[#070102] text-white font-sans selection:bg-[#DC2626] selection:text-white">
          <AdminPage onExitAdmin={handleExitAdmin} />
        </div>
      ) : (
        <div className="min-h-screen bg-[#070102] text-white font-sans selection:bg-[#DC2626] selection:text-white">
          <Header
            onOpenContact={() => handleOpenOrderModal('')}
            onOpenAdmin={handleOpenAdmin}
          />

          <main>
            <HeroMurmurScene isPlaying={isPlaying} onToggleAudio={handleToggleAudio} />
            <WorksSection />
            <DreamProfessionSection />
            <FactsSection />
            <FootballInfoSection />
            <YouTubeSection />
            <ServicesSection onOrderService={handleOpenOrderModal} />
            <CommunitySection />
          </main>

          <Footer onOpenAdmin={handleOpenAdmin} />

          <OrderModal
            isOpen={orderModalOpen}
            initialService={selectedService}
            onClose={() => setOrderModalOpen(false)}
          />
        </div>
      )}
    </FirebaseProvider>
  );
}
