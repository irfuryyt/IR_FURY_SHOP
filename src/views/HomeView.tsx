import React from 'react';
import { Hero } from '../components/Hero';
import { GameCategoriesSection } from '../components/GameCategoriesSection';
import { PremiumSection } from '../components/PremiumSection';
import { GiftCardsSection } from '../components/GiftCardsSection';
import { SpecialOffersSection } from '../components/SpecialOffersSection';
import { SpecialBanner } from '../components/SpecialBanner';
import { TrustFeatures } from '../components/TrustFeatures';
import { BlogSection } from '../components/BlogSection';
import { FAQSection } from '../components/FAQSection';

export const HomeView: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <Hero />
      <SpecialOffersSection />
      <GameCategoriesSection />
      <PremiumSection />
      <SpecialBanner />
      <GiftCardsSection />
      <TrustFeatures />
      <BlogSection />
      <FAQSection />
    </div>
  );
};
