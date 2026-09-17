import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalReason,
    login,
    register
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'register' | 'login'>(
    authModalReason === 'admin_required' ? 'login' : 'register'
  );

  React.useEffect(() => {
    if (authModalReason === 'admin_required') {
      setActiveTab('login');
    }
  }, [authModalReason]);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (activeTab === 'register') {
      if (!fullName.trim() || !email.trim() || !password) {
        setErrorMsg('Please fill in all required fields (Name, Email, Password)');
        setIsSubmitting(false);
        return;
      }
      const res = await register(fullName, email, password, phone);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create account');
      }
    } else {
      if (!email.trim() || !password) {
        setErrorMsg('Please enter your email and password');
        setIsSubmitting(false);
        return;
      }
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Invalid email or password');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#EBE3D6] overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-[#181310] text-white p-6 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2.5 text-[#DEB346] text-xs font-bold tracking-widest uppercase mb-2">
            <div className="w-8 h-8 rounded-full bg-white border border-[#C8A358] p-0.5 overflow-hidden flex-shrink-0">
              <img
                src="/logo.png"
                alt="YFP Logo"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.svg';
                }}
              />
            </div>
            <span>YFP Pastries & Cakes</span>
          </div>

          <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
            {activeTab === 'register' ? 'Create Customer Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            {authModalReason === 'order_required'
              ? 'An account is required to place, track, and receive bakery orders.'
              : 'Sign up or sign in to browse, customize celebration cakes, and order treats.'}
          </p>
        </div>

        {/* Reason banner if triggered by ordering */}
        {authModalReason === 'order_required' && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center space-x-2 text-xs text-amber-900 font-medium">
            <Lock className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              <strong>Account Required:</strong> Please create an account or sign in to proceed with your order.
            </span>
          </div>
        )}

        {/* Reason banner if triggered by unauthorized admin access */}
        {authModalReason === 'admin_required' && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center space-x-2 text-xs text-amber-900 font-medium">
            <Lock className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              <strong>Staff / Admin Restricted:</strong> Customers do not have access to the kitchen terminal or admin portal. Please log in with authorized staff credentials.
            </span>
          </div>
        )}

        {/* Tab Toggle */}
        <div className="flex border-b border-[#E8E1D5] bg-[#F2EDE4]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${
              activeTab === 'register'
                ? 'bg-[#FAF7F2] text-[#181310] border-b-2 border-[#DEB346]'
                : 'text-[#7D6B5A] hover:text-[#181310]'
            }`}
          >
            Create New Account
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${
              activeTab === 'login'
                ? 'bg-[#FAF7F2] text-[#181310] border-b-2 border-[#DEB346]'
                : 'text-[#7D6B5A] hover:text-[#181310]'
            }`}
          >
            Sign In Existing
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#181310] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Adetola Adelani"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DDD3C4] rounded-xl text-sm text-[#181310] focus:outline-hidden focus:border-[#DEB346] focus:ring-1 focus:ring-[#DEB346]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#181310] mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. adetolaadelani22@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DDD3C4] rounded-xl text-sm text-[#181310] focus:outline-hidden focus:border-[#DEB346] focus:ring-1 focus:ring-[#DEB346]"
                />
              </div>
            </div>

            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#181310] mb-1">
                  Phone / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07064918034"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DDD3C4] rounded-xl text-sm text-[#181310] focus:outline-hidden focus:border-[#DEB346] focus:ring-1 focus:ring-[#DEB346]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#181310] mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DDD3C4] rounded-xl text-sm text-[#181310] focus:outline-hidden focus:border-[#DEB346] focus:ring-1 focus:ring-[#DEB346]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-[#181310] hover:bg-[#DEB346] text-white hover:text-[#181310] py-3 rounded-xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center space-x-2 transition-all transform active:scale-98 disabled:opacity-50"
            >
              <span>{activeTab === 'register' ? 'Create Account & Continue' : 'Sign In & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Customer benefits */}
          <div className="mt-5 pt-4 border-t border-[#E8E1D5] grid grid-cols-2 gap-2 text-[11px] text-[#635345]">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Nationwide 36 States Delivery</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Real-Time Order Tracking</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Save Favorite Treats</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Safe Paystack Payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
