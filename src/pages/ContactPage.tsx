import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, ChevronDown } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // FAQ open state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message })
      });
      setIsSubmitting(false);
      if (res.ok) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        alert('Could not submit message. Please reach us via WhatsApp.');
      }
    } catch {
      setIsSubmitting(false);
      alert('Error sending message. Please try again.');
    }
  };

  const faqs = [
    {
      q: 'How fast can I get celebration cakes and pastries delivered in Nigeria?',
      a: 'Standard menu cakes and fresh pastries can be delivered same-day or next-day depending on your state. In Osun State, deliveries arrive within 1–3 hours. For nationwide delivery across all other 36 states, we utilize specialized cold-box express transit.'
    },
    {
      q: 'Which states in Nigeria do you deliver to?',
      a: 'We deliver to all 36 States in Nigeria plus the Federal Capital Territory (FCT) Abuja! From Lagos, Abuja, Rivers, Oyo, Kano, Kaduna, to Edo, Delta, Enugu, and beyond, our protective packaging ensures pristine arrival.'
    },
    {
      q: 'How should I store my pastries and cakes?',
      a: 'Buttercream and sponge cakes are best stored in an air-conditioned room or refrigerated. Bring them to room temperature 30 minutes before serving. Savory meat pies and sausage rolls can be re-warmed in an oven or air fryer at 160°C for 5 minutes for that fresh-out-of-the-oven crunch.'
    },
    {
      q: 'Do you cater for weddings and corporate meetings?',
      a: 'Yes! We provide mini chops platters, dessert tables, and custom packaged snack boxes for corporate board meetings, birthdays, and wedding receptions.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#181310] tracking-tight">
          Contact Us
        </h1>
        <p className="text-xs sm:text-sm text-[#736252]">
          Have an urgent order, question about ingredients, or custom event inquiry? We are here for you.
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="tel:07064918034"
          className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs hover:border-[#DEB346] hover:shadow-md transition-all text-center flex flex-col items-center group"
        >
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#181310] group-hover:bg-[#181310] group-hover:text-[#DEB346] flex items-center justify-center transition-colors mb-3">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[#181310]">Call Us</h3>
          <p className="text-xs text-[#DEB346] font-semibold mt-1">07064918034</p>
          <span className="text-[10px] text-gray-500 mt-0.5">Direct phone order hotline</span>
        </a>

        <a
          href="https://wa.me/2347064918034"
          target="_blank"
          rel="noreferrer"
          className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs hover:border-emerald-500 hover:shadow-md transition-all text-center flex flex-col items-center group"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors mb-3">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[#181310]">WhatsApp</h3>
          <p className="text-xs text-emerald-700 font-semibold mt-1">07064918034</p>
          <span className="text-[10px] text-gray-500 mt-0.5">Instant chat & order assist</span>
        </a>

        <a
          href="mailto:adetolaadelani22@gmail.com"
          className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs hover:border-[#DEB346] hover:shadow-md transition-all text-center flex flex-col items-center group"
        >
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#181310] group-hover:bg-[#181310] group-hover:text-[#DEB346] flex items-center justify-center transition-colors mb-3">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[#181310]">Email</h3>
          <p className="text-xs text-gray-800 font-semibold mt-1 truncate max-w-full">adetolaadelani22@gmail.com</p>
          <span className="text-[10px] text-gray-500 mt-0.5">Direct email inquiries</span>
        </a>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#181310] flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-[#DEB346]" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[#181310]">Hours</h3>
          <p className="text-xs text-gray-800 font-semibold mt-1">Mon–Sat: 7am–8pm</p>
          <span className="text-[10px] text-gray-500 mt-0.5">Sunday: 8am–6pm</span>
        </div>
      </div>

      {/* Send Message Form & Bakery Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Interactive Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-md space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-serif font-bold text-lg text-[#181310]">Leave a Message</h2>
            <p className="text-xs text-gray-500">We respond within 30 minutes during operating hours</p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif font-bold text-base text-emerald-900">Message Received!</h3>
              <p className="text-xs text-emerald-700">
                Thank you for contacting YFP. Our customer support team will get in touch with you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs font-bold text-emerald-800 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adetola Adelani"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#DEB346]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="adetolaadelani22@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#DEB346]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="07064918034"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#DEB346]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Your Message or Custom Request</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you need..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2.5 text-gray-900 focus:outline-none focus:border-[#DEB346]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#181310] hover:bg-[#DEB346] text-white hover:text-[#181310] py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Location & Kitchen Info */}
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#EDE5D8] space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#181310] text-[#DEB346] flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-[#181310]">Bakery & Kitchen Hub</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Ila-Orangun, Osun State, Nigeria.<br />
                  <strong className="text-[#181310]">Phone / WhatsApp:</strong> 07064918034<br />
                  <strong className="text-[#181310]">Email:</strong> adetolaadelani22@gmail.com
                </p>
              </div>
            </div>

            <div className="aspect-16/9 rounded-2xl overflow-hidden border border-[#DEB346]/30 shadow-sm bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=600&q=80"
                alt="YFP Pastries & Cakes Kitchen Storefront"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] text-gray-500 italic text-center">
              Fresh pastries and customized event cakes dispatched daily. Delivery coverage spanning all 36 Nigerian states.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-6">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="font-serif font-black text-xl sm:text-2xl text-[#181310]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-gray-500 mt-1">Quick answers to common questions about ordering</p>
        </div>

        <div className="divide-y divide-gray-100">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-3">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left py-2 font-serif font-bold text-sm text-gray-900 hover:text-[#A68322] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <p className="text-xs text-[#5E4E40] leading-relaxed pt-1 pb-2">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
