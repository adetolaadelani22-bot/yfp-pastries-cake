import React, { useState } from 'react';
import { Sparkles, Calendar, Users, CheckCircle2, Send, ChefHat, ArrowRight } from 'lucide-react';

export const CateringPage: React.FC = () => {
  const [eventType, setEventType] = useState('Corporate Event');
  const [guestCount, setGuestCount] = useState('50');
  const [eventDate, setEventDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [packages, setPackages] = useState<string[]>(['Small Chops Platters', 'Pastry Boxes']);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const togglePackage = (pkg: string) => {
    if (packages.includes(pkg)) {
      setPackages(packages.filter(p => p !== pkg));
    } else {
      setPackages([...packages, pkg]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone || !contactEmail) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/catering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          guestCount: Number(guestCount) || 50,
          eventDate,
          contactName,
          contactPhone,
          contactEmail,
          packagesSelected: packages,
          notes
        })
      });
      setIsSubmitting(false);
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Could not submit catering quote request. Please reach us via WhatsApp.');
      }
    } catch {
      setIsSubmitting(false);
      alert('Error submitting catering inquiry.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 space-y-12">
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#A68322] bg-[#FAF3E3] px-3.5 py-1.5 rounded-full border border-[#DEB346]/40">
          <ChefHat className="w-3.5 h-3.5 text-[#DEB346]" />
          <span>Events & Large Gatherings</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#181310] tracking-tight">
          Catering & Event Platters
        </h1>
        <p className="text-xs sm:text-sm text-[#665545] font-light leading-relaxed">
          From executive breakfast boardrooms in Victoria Island to lavish wedding dessert tables in Lekki, YFP delivers warmth, fresh flavors, and immaculate presentation.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-10 border border-[#E8DEC8] shadow-xl text-center space-y-4 max-w-xl mx-auto">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
          <h2 className="font-serif font-bold text-2xl text-gray-900">Catering Quote Request Received!</h2>
          <p className="text-xs text-gray-600">
            Our event catering manager will review your guest count and menu selections and contact you via phone/email within 2 hours with a comprehensive proposal and tasting schedule.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 bg-[#181310] text-[#DEB346] px-6 py-2.5 rounded-full text-xs font-bold"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E8DEC8] shadow-md space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-serif font-bold text-lg text-gray-900">Request a Catering Proposal</h2>
            <p className="text-xs text-gray-500">Tailored packages for 10 to 500+ guests</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2.5 font-medium text-gray-800"
              >
                <option value="Corporate Event">Corporate Meeting / Conference</option>
                <option value="Wedding Reception">Wedding Reception</option>
                <option value="Birthday Party">Birthday / Milestone Celebration</option>
                <option value="Bridal / Baby Shower">Bridal or Baby Shower</option>
                <option value="Family Gathering">Family Gathering / Brunch</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Estimated Guests</label>
              <input
                type="number"
                min="10"
                max="2000"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2.5 text-gray-900"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Event Date</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2.5 text-gray-900"
              />
            </div>
          </div>

          {/* Package Selections */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              Select Desired Offerings
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                'Small Chops Platters',
                'Pastry Snack Boxes',
                'Mini Dessert Cups',
                'Custom Celebration Cake',
                'Chin Chin Party Packs',
                'Gourmet Meat Pie Trays',
                'Finger Food Buffet',
                'Beverage Pairing'
              ].map((item) => {
                const isSelected = packages.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => togglePackage(item)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      isSelected
                        ? 'border-[#181310] bg-[#181310] text-[#DEB346] shadow-xs'
                        : 'border-[#E2D8C9] bg-[#FAF7F2] text-gray-700 hover:border-[#DEB346]'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Contact Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Chief Bankole"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+234 ..."
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="bankole@corporate.ng"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Event Venue & Additional Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Civic Centre, Ozumba Mbadiwe, VI. Setup needed by 11:00 AM."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl p-2.5 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#181310] hover:bg-[#DEB346] text-white hover:text-[#181310] py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Submitting Request...' : 'Request Catering Quote'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
