import React from 'react';
import { ArrowRight, ArrowUpRight, Sparkles, Star, ShieldCheck, Clock, Award, ChevronRight } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: string, param?: any) => void;
  onEditProduct?: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  onSelectProduct,
  onNavigate,
  onEditProduct,
}) => {
  const bestsellers = products.filter(p => p.isBestseller).slice(0, 6);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* HERO SECTION - Precision Match for Reference Design */}
      <section className="relative bg-[#100E0C] text-[#FAF7F2] overflow-hidden border-b border-[#241F1A]">
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Editorial Display Typography & Action Buttons */}
            <div className="lg:col-span-6 flex flex-col justify-center text-left">
              {/* Eyebrow */}
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-[#BCA073] mb-5 sm:mb-7">
                Handcrafted in Lagos · Delivered with Care
              </p>

              {/* Editorial Display Heading */}
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] leading-[0.93] tracking-tight text-white mb-6">
                <span className="block font-normal">Freshly</span>
                <span className="block font-normal">baked.</span>
                <span className="block font-normal italic text-[#C8A358] mt-1">Made</span>
                <span className="block font-normal italic text-[#C8A358]">memorable.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-[#A39686] text-sm sm:text-base md:text-[17px] font-light leading-relaxed max-w-lg mb-8 sm:mb-10">
                Thoughtful pastries, beautiful cakes, and small chops made fresh for the moments that matter.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-1">
                <button
                  id="hero-shop-menu-btn"
                  onClick={() => onNavigate('shop')}
                  className="bg-[#C89E46] hover:bg-[#D8AE56] text-[#14100C] px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center space-x-2.5 shadow-lg active:scale-[0.98]"
                >
                  <span>Shop the Menu</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  id="hero-custom-cake-link"
                  onClick={() => onNavigate('custom-cake')}
                  className="group text-[#EDE4D6] hover:text-[#C89E46] text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center space-x-2 border-b border-[#3D332A] hover:border-[#C89E46] pb-1 transition-all"
                >
                  <span>Create a Custom Cake</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Column: Artisan Chocolate Cake Showcase with Inset Frame & Badge */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[560px] aspect-[4/3] sm:aspect-[4/3] lg:aspect-[1/1] xl:aspect-[4/3] overflow-hidden bg-[#181411] shadow-2xl border border-[#241F1A]">
                {/* Hero Cake Image */}
                <img
                  src="/hero-chocolate-cake.jpg"
                  alt="Artisanal chocolate celebration cake"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85";
                  }}
                />

                {/* Delicate Inset Gold Border Frame (From Image 1) */}
                <div className="absolute inset-3 sm:inset-4 lg:inset-5 border border-[#C8A358]/40 pointer-events-none z-10" />

                {/* Bottom-Right Gold Badge (From Image 1) */}
                <div className="absolute bottom-0 right-0 bg-[#C89E46] text-[#14100C] px-4 sm:px-5 py-2.5 sm:py-3 shadow-2xl z-20 flex items-center space-x-2.5 select-none">
                  <Star className="w-4 h-4 fill-[#14100C] text-[#14100C] flex-shrink-0" />
                  <div className="leading-tight">
                    <p className="text-[10px] sm:text-[11px] font-black tracking-widest uppercase">Baked Fresh</p>
                    <p className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase opacity-90">For Your Table</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sleek Trust Points Strip */}
          <div className="mt-12 lg:mt-16 pt-8 border-t border-[#231E19] grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-[#9E9080]">
            <div className="flex items-center space-x-2.5">
              <Clock className="w-4 h-4 text-[#C89E46] flex-shrink-0" />
              <span>Baked Fresh Daily at 5:30 AM</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C89E46] flex-shrink-0" />
              <span>100% Real Butter & Belgian Choc</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Award className="w-4 h-4 text-[#C89E46] flex-shrink-0" />
              <span>5,000+ Lagos Orders Delivered</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Star className="w-4 h-4 text-[#C89E46] fill-[#C89E46] flex-shrink-0" />
              <span>4.9★ Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE CATEGORIES SECTION - Circular Cards from Reference */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#181310] tracking-tight">
              Explore Categories
            </h2>
            <p className="text-xs text-[#7A6A59] mt-0.5">Explore our freshly baked bakery collections</p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-[#A68322] hover:text-[#7A5F14] flex items-center space-x-1"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.name })}
              className="group flex flex-col items-center cursor-pointer text-center"
            >
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#E5DAC8] group-hover:border-[#DEB346] shadow-md group-hover:shadow-xl transition-all duration-300 p-1 bg-white mb-2.5">
                <img
                  src={
                    cat.slug === 'pastries' || cat.id === 'cat-pastries' || cat.name.toLowerCase().includes('pastr')
                      ? '/pastries-cat.jpg'
                      : cat.slug === 'celebration-cakes' || cat.id === 'cat-celebration' || cat.name.toLowerCase().includes('celebrat')
                      ? '/celebration-cake-cat.jpg'
                      : cat.image
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (cat.name.toLowerCase().includes('celebrat') || cat.slug === 'celebration-cakes') {
                      target.src = '/celebration-cake-cat.jpg';
                    } else if (cat.name.toLowerCase().includes('pastr') || cat.slug === 'pastries') {
                      target.src = '/pastries-cat.jpg';
                    } else {
                      target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80';
                    }
                  }}
                />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-[#181310] group-hover:text-[#A68322] transition-colors">
                {cat.name}
              </h3>
              <span className="text-[10px] text-[#8C7A68]">
                {cat.itemCount} items
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* OUR BESTSELLERS SECTION - Matching Reference Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DEB346]" />
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#181310] tracking-tight">
                Our Bestsellers
              </h2>
            </div>
            <p className="text-xs text-[#7A6A59] mt-0.5">Lagos' most ordered celebration cakes & pastries</p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-[#A68322] hover:text-[#7A5F14] flex items-center space-x-1"
          >
            <span>View Full Menu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {bestsellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onEditProduct={onEditProduct}
            />
          ))}
        </div>
      </section>

      {/* DESIGN YOUR DREAM CAKE BANNER - From Reference */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#181310] via-[#241C16] to-[#181310] text-white p-8 sm:p-12 shadow-2xl border border-[#3B2F23]">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=800&q=80"
              alt="Designer custom cake"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80";
              }}
            />
          </div>

          <div className="relative max-w-xl space-y-4">
            <span className="inline-flex items-center space-x-1.5 text-xs font-bold tracking-widest text-[#DEB346] uppercase bg-[#2C2219] px-3 py-1 rounded-full border border-[#DEB346]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#DEB346]" />
              <span>Bespoke Pastry Crafting</span>
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
              Design Your Dream Cake
            </h2>
            <p className="text-xs sm:text-sm text-[#D1C3B2] leading-relaxed">
              Tailor every layer to perfection: pick your favorite size, flavor, frosting, color scheme, and upload your inspiration photo. Our executive chefs will bring your celebration to life.
            </p>
            <div className="pt-2">
              <button
                id="banner-start-customizing"
                onClick={() => onNavigate('custom-cake')}
                className="bg-[#DEB346] hover:bg-[#F2CA5C] text-[#120F0D] font-bold text-xs sm:text-sm uppercase tracking-wider px-7 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
              >
                Start Customizing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT OUR CUSTOMERS SAY - Testimonial Card from Reference */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="font-serif font-black text-xl sm:text-2xl text-[#181310] tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-xs text-[#7A6A59] mt-1">Real feedback from verified Lagos food lovers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8E1D5] shadow-sm relative space-y-3">
            <div className="flex items-center space-x-1 text-[#DEB346]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#DEB346]" />
              ))}
              <span className="text-xs font-bold text-gray-800 ml-1">5.0</span>
            </div>
            <p className="text-xs text-[#524436] italic leading-relaxed">
              "The best chocolate cake I have had in Lagos! Perfectly seasoned filling, flaky pastry crust, and always delivered warm and fresh to my office in Victoria Island."
            </p>
            <div className="pt-2 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
              <span className="font-bold text-[#181310]">— Chioma A., VI</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">Verified Order</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8E1D5] shadow-sm relative space-y-3">
            <div className="flex items-center space-x-1 text-[#DEB346]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#DEB346]" />
              ))}
              <span className="text-xs font-bold text-gray-800 ml-1">5.0</span>
            </div>
            <p className="text-xs text-[#524436] italic leading-relaxed">
              "Ordered custom meat pies and the mini chops box for my husband's 40th birthday. Everyone at the party was asking where we got the food. YFP is truly Lagos' food plug!"
            </p>
            <div className="pt-2 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
              <span className="font-bold text-[#181310]">— Tunde O., Lekki Phase 1</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">Verified Order</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8E1D5] shadow-sm relative space-y-3">
            <div className="flex items-center space-x-1 text-[#DEB346]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#DEB346]" />
              ))}
              <span className="text-xs font-bold text-gray-800 ml-1">5.0</span>
            </div>
            <p className="text-xs text-[#524436] italic leading-relaxed">
              "The custom cake builder was so easy to use! Uploaded my reference image, got my quote, and the finished 3-layer Red Velvet cake was an absolute masterpiece."
            </p>
            <div className="pt-2 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
              <span className="font-bold text-[#181310]">— Folake D., Ikoyi</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">Verified Order</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
