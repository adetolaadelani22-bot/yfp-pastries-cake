import React from 'react';
import { Award, Clock, Heart, ShieldCheck, Sparkles, ChefHat, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigateToShop: () => void;
  onNavigateToCustomCake: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToShop, onNavigateToCustomCake }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#A68322] bg-[#FAF3E3] px-3.5 py-1.5 rounded-full border border-[#DEB346]/40">
          <Sparkles className="w-3.5 h-3.5 text-[#DEB346]" />
          <span>Our Artisanal Heritage</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#181310] tracking-tight">
          The YFP Story
        </h1>
        <p className="text-sm sm:text-base text-[#665545] font-light leading-relaxed">
          Crafting unforgettable celebrations and daily indulgences across Lagos with authentic recipes, pure dairy butter, and passionate culinary artistry.
        </p>
      </div>

      {/* Story Narrative Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DEC8] shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-[#4A3D31] leading-relaxed">
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#181310]">
              From a Passionate Lagos Kitchen to Your Celebrations
            </h2>
            <p>
              Founded in Lagos as <strong>Yatex's Food Plug (YFP Pastries & Cakes)</strong>, our journey began with a simple yet uncompromising obsession: baking pastries that bring genuine joy to people's palates.
            </p>
            <p>
              In a busy city filled with fast-food imitations, we set out to restore true pastry craftsmanship. Every single morning at 5:30 AM, our ovens preheat to turn rich flour, creamy butter, Belgian cocoa, and farm-fresh eggs into golden, flaky meat pies, gourmet sausage rolls, and towering celebration cakes.
            </p>
            <p>
              Whether it is a surprise birthday cake delivered to a corporate desk in Victoria Island or trays of crunchy chin chin shared with family during Sunday celebrations in Lekki, we put heart into every bake.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-4/3 bg-gray-100 border border-[#DEB346]/30">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
              alt="YFP Kitchen baking"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-white shadow-xl border-2 border-[#DEB346] p-0.5 overflow-hidden">
              <img
                src="/logo.png"
                alt="YFP Official Logo"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.svg';
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
              <p className="text-white font-serif italic text-xs">
                "Baking is love made edible." — Yatex Bakare
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of YFP Craft */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE5D8] space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#181310] text-[#DEB346] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[#181310]">Baked Fresh Daily</h3>
          <p className="text-xs text-[#6B5B4C] leading-relaxed">
            Zero day-old pastries. What you receive was made from scratch on the morning of delivery.
          </p>
        </div>

        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE5D8] space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#181310] text-[#DEB346] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[#181310]">Pure Ingredients</h3>
          <p className="text-xs text-[#6B5B4C] leading-relaxed">
            Real dairy butter, premium Callebaut Belgian chocolate, and pure Madagascar bourbon vanilla.
          </p>
        </div>

        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE5D8] space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#181310] text-[#DEB346] flex items-center justify-center">
            <ChefHat className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[#181310]">Bespoke Cake Studio</h3>
          <p className="text-xs text-[#6B5B4C] leading-relaxed">
            From two-tier wedding centerpieces to personalized birthday inscriptions, we bring visions to life.
          </p>
        </div>

        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE5D8] space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#181310] text-[#DEB346] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[#181310]">Lagos Wide Reach</h3>
          <p className="text-xs text-[#6B5B4C] leading-relaxed">
            Fast temperature-controlled dispatch bike fleet across Island and Mainland Lagos.
          </p>
        </div>
      </div>

      {/* Founder Spotlight */}
      <div className="bg-gradient-to-r from-[#181310] to-[#2B2117] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#3D3023] flex flex-col md:flex-row items-center gap-8">
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-[#DEB346] shadow-xl flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80"
            alt="Chef Yatex Bakare"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3 text-center md:text-left">
          <span className="text-xs uppercase font-bold tracking-widest text-[#DEB346]">Meet Our Head Baker</span>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">Yatex Bakare</h2>
          <p className="text-xs sm:text-sm text-[#D4C5B5] leading-relaxed font-light">
            With formal training in French patisserie techniques merged with vibrant Nigerian taste profiles, Chef Yatex leads our kitchen with relentless passion for texture, aesthetic balance, and rich flavor.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#DEB346]">
            <span>✓ 5,000+ Cakes & Pastries Delivered</span>
            <span>✓ Featured in Lagos Food Plugs</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center pt-4 space-y-4">
        <h3 className="font-serif font-bold text-xl text-[#181310]">Ready to taste the difference?</h3>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onNavigateToShop}
            className="bg-[#181310] hover:bg-[#DEB346] text-white hover:text-[#181310] px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
          >
            Explore Bakery Menu
          </button>
          <button
            onClick={onNavigateToCustomCake}
            className="bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#181310] border border-[#DDD5C7] px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
          >
            Design Custom Cake
          </button>
        </div>
      </div>
    </div>
  );
};
