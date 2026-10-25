import React from 'react';
import { Hero } from './Hero';
import { CategoryNav } from './CategoryNav';
import { FeaturedDishes } from './FeaturedDishes';
import { SpecialOfferBanner } from './SpecialOfferBanner';
import { WhyChooseUs } from './WhyChooseUs';
import { AppPromoAndTestimonials } from './AppPromoAndTestimonials';

export const HomePage: React.FC = () => {
  return (
    <main className="bg-[#FAF8F5]">
      {/* 1. Dark Food Photography Hero */}
      <Hero />

      {/* 2. Circular Food Category Navigation */}
      <CategoryNav />

      {/* 3. Featured Food Dishes (5 cards in a row matching reference) */}
      <FeaturedDishes />

      {/* 4. Special Promotional Offer Banner (Flat 30% OFF with TASTE30) */}
      <SpecialOfferBanner />

      {/* 5. Why Choose TasteHub? (4 circular feature blocks + garnish) */}
      <WhyChooseUs />

      {/* 6. App Promotion & What Our Customers Say (Split layout) */}
      <AppPromoAndTestimonials />
    </main>
  );
};
