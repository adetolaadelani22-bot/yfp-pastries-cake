import React from 'react';
import { Phone, Mail, MapPin, Clock, Instagram, Send, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#120F0D] text-[#E0D7CC] border-t border-[#261E17] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-12 h-12 rounded-full bg-white shadow-md border-2 border-[#C8A358] p-0.5 overflow-hidden flex items-center justify-center transition-transform hover:scale-105">
                <img
                  src="/logo.png"
                  alt="YFP Pastries & Cakes"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.svg';
                  }}
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white tracking-wide">YFP Pastries & Cakes</h3>
                <p className="text-[10px] tracking-[0.2em] text-[#DEB346] font-semibold">YATEX'S FOOD PLUG</p>
              </div>
            </div>
            <p className="text-xs text-[#A89886] leading-relaxed mb-4">
              Handcrafting Lagos' finest celebration cakes, golden flaky meat pies, gourmet snacks, and luxury party platters with pure butter and premium Belgian chocolate.
            </p>
            <div className="flex items-center space-x-3 text-xs text-[#DEB346]">
              <ShieldCheck className="w-4 h-4 text-[#DEB346]" />
              <span className="font-medium">100% NAFDAC & Health Compliant Bakery</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-white mb-4 border-b border-[#2C231B] pb-2">
              Explore Our Menu
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B8AA98]">
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Cakes' })} className="hover:text-[#DEB346] transition-colors">
                  Signature Celebration Cakes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Pastries' })} className="hover:text-[#DEB346] transition-colors">
                  Flaky Meat & Fish Pies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom-cake')} className="hover:text-[#DEB346] transition-colors font-semibold text-[#DEB346]">
                  Design Your Dream Cake ✨
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Small Chops' })} className="hover:text-[#DEB346] transition-colors">
                  Party Small Chops & Finger Foods
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catering')} className="hover:text-[#DEB346] transition-colors">
                  Corporate & Wedding Catering
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Snacks' })} className="hover:text-[#DEB346] transition-colors">
                  Crunchy Chin Chin & Doughnuts
                </button>
              </li>
            </ul>
          </div>

          {/* Operating Hours & Lagos Delivery */}
          <div>
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-white mb-4 border-b border-[#2C231B] pb-2">
              Hours & Dispatch
            </h4>
            <div className="space-y-3 text-xs text-[#B8AA98]">
              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-[#DEB346] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Baking & Dispatch Hours</p>
                  <p>Mon – Sat: 7:00 AM – 9:00 PM</p>
                  <p>Sunday: 8:00 AM – 6:00 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#DEB346] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Delivery Coverage</p>
                  <p>All 36 States in Nigeria + FCT Abuja (Nationwide Express Courier & Safe Cold-Box Transit).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Contact & Socials */}
          <div>
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-white mb-4 border-b border-[#2C231B] pb-2">
              Get in Touch
            </h4>
            <div className="space-y-2.5 text-xs text-[#B8AA98] mb-4">
              <a href="tel:07064918034" className="flex items-center space-x-2 hover:text-[#DEB346] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#DEB346]" />
                <span>07064918034</span>
              </a>
              <a href="mailto:adetolaadelani22@gmail.com" className="flex items-center space-x-2 hover:text-[#DEB346] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#DEB346]" />
                <span>adetolaadelani22@gmail.com</span>
              </a>
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#DEB346] flex-shrink-0 mt-0.5" />
                <span>Osun State, Ila-Orangun, Nigeria</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://wa.me/2347064918034"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1F1914] text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all border border-[#3B3024]"
                title="Chat on WhatsApp (07064918034)"
              >
                <Send className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1F1914] text-[#E1306C] hover:bg-[#E1306C] hover:text-white flex items-center justify-center transition-all border border-[#3B3024]"
                title="Follow on Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Payment Badges & Copyright */}
        <div className="pt-8 border-t border-[#231B15] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A7969] space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-1">
            <span>© {new Date().getFullYear()} YFP Pastries & Cakes. All rights reserved. Made with</span>
            <Heart className="w-3 h-3 text-[#DEB346] fill-[#DEB346] inline" />
            <span>in Lagos.</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="text-[#A39281]">Secured with:</span>
            <span className="font-semibold text-white px-2 py-0.5 bg-[#1F1915] rounded border border-[#332820]">Paystack</span>
            <span className="font-semibold text-white px-2 py-0.5 bg-[#1F1915] rounded border border-[#332820]">Mastercard</span>
            <span className="font-semibold text-white px-2 py-0.5 bg-[#1F1915] rounded border border-[#332820]">Visa</span>
            <span className="font-semibold text-white px-2 py-0.5 bg-[#1F1915] rounded border border-[#332820]">Verve</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
