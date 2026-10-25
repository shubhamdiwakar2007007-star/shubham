import React from 'react';
import { Bike, Leaf, ChefHat, ShieldCheck } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      id: 1,
      title: 'Fast Delivery',
      subtitle: 'On time, every time',
      icon: Bike,
      iconColor: 'text-[#FF7518]',
      circleBg: 'bg-orange-100/70 border border-orange-200'
    },
    {
      id: 2,
      title: 'Fresh Ingredients',
      subtitle: 'Quality you can taste',
      icon: Leaf,
      iconColor: 'text-emerald-600',
      circleBg: 'bg-emerald-100/70 border border-emerald-200'
    },
    {
      id: 3,
      title: 'Expert Chefs',
      subtitle: 'Crafted with love',
      icon: ChefHat,
      iconColor: 'text-[#FF7518]',
      circleBg: 'bg-amber-100/70 border border-amber-200'
    },
    {
      id: 4,
      title: 'Safe & Secure',
      subtitle: 'Your safety, our priority',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      circleBg: 'bg-emerald-100/70 border border-emerald-200'
    }
  ];

  return (
    <section className="bg-white py-14 border-b border-neutral-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading and 4 Circular Features */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191919] tracking-tight">
                Why Choose TasteHub?
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                More than just food, we deliver happiness.
              </p>
            </div>

            {/* 4 Feature Items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
              {features.map((f) => {
                const IconComponent = f.icon;
                return (
                  <div
                    key={f.id}
                    className="flex flex-col items-center text-center group cursor-default"
                  >
                    <div
                      className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center mb-3.5 shadow-sm transition-transform duration-300 group-hover:scale-110 ${f.circleBg}`}
                    >
                      <IconComponent className={`w-7 h-7 sm:w-8 sm:h-8 ${f.iconColor}`} />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#191919]">
                      {f.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {f.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Culinary Garnish with Handwritten "Good Food Good Life" */}
          <div className="lg:col-span-4 relative flex items-center justify-center p-4">
            <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
              {/* Handwritten Script in center/right */}
              <div className="z-10 text-center select-none">
                <div className="font-script text-4xl sm:text-5xl text-neutral-800 leading-tight drop-shadow-sm rotate-[-3deg]">
                  Good <br />
                  <span className="text-[#FF7518]">Food</span> <br />
                  Good <br />
                  <span className="text-emerald-700">Life</span>
                </div>
              </div>

              {/* Decorative Fresh Herbs & Cherry Tomatoes */}
              <div className="absolute top-0 right-2 w-12 h-12 rounded-full overflow-hidden shadow-sm">
                <div className="w-full h-full bg-gradient-to-tr from-emerald-600 to-green-400 rounded-full opacity-80 flex items-center justify-center text-white text-xs">
                  🌿
                </div>
              </div>
              <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-red-600 shadow-md flex items-center justify-center text-white text-xs animate-bounce">
                🍅
              </div>
              <div className="absolute top-6 left-2 w-8 h-8 rounded-full bg-red-500 shadow-sm flex items-center justify-center text-white text-[10px]">
                🍅
              </div>
              <div className="absolute bottom-2 left-6 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-800 text-sm">
                🍃
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
