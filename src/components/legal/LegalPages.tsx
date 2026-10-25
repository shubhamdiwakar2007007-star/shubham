import React from 'react';
import { ArrowLeft, Shield, FileText, RefreshCw, Truck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LegalPages: React.FC<{ type: 'privacy' | 'terms' | 'refund' | 'delivery' }> = ({ type }) => {
  const { setActivePage } = useApp();

  const titles = {
    privacy: { title: 'Privacy Policy', icon: Shield, subtitle: 'How we collect, protect, and process your personal data.' },
    terms: { title: 'Terms & Conditions', icon: FileText, subtitle: 'Rules and guidelines for ordering and using TasteHub services.' },
    refund: { title: 'Refund & Cancellation Policy', icon: RefreshCw, subtitle: 'Transparent terms for order modifications, returns, and refunds.' },
    delivery: { title: 'Delivery & Shipping Policy', icon: Truck, subtitle: 'Standards for safe, temperature-controlled doorstep delivery.' }
  };

  const { title, icon: Icon, subtitle } = titles[type];

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-16">
      <div className="bg-[#111111] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setActivePage('home')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#FF7518] flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h1>
              <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-sm text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-6">
          {type === 'privacy' && (
            <>
              <h2 className="text-base font-bold text-neutral-900">1. Information We Collect</h2>
              <p>
                When you use TasteHub, we collect details necessary to fulfill your orders: name, email, delivery addresses, phone number, and transaction identifiers. We never store raw payment card data on our servers; payments are tokenized via PCI-DSS compliant providers.
              </p>
              <h2 className="text-base font-bold text-neutral-900">2. Geolocation and Device Data</h2>
              <p>
                We only access your precise location with explicit permission to recommend nearby restaurants and provide accurate delivery time estimates. You may disable location permissions anytime in your device settings.
              </p>
              <h2 className="text-base font-bold text-neutral-900">3. Data Protection</h2>
              <p>
                All data in transit is encrypted using TLS 1.3. We do not sell or monetize personal customer records to third-party marketing brokers.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <h2 className="text-base font-bold text-neutral-900">1. Account Terms</h2>
              <p>
                By registering on TasteHub, you agree to provide true, accurate contact details. You are responsible for safeguarding your credentials and notifying us immediately of unauthorized activity.
              </p>
              <h2 className="text-base font-bold text-neutral-900">2. Pricing and Menus</h2>
              <p>
                Item prices, portion sizes, and promotional discounts are listed transparently on dish pages. All taxes and delivery charges are calculated and presented prior to final order confirmation.
              </p>
              <h2 className="text-base font-bold text-neutral-900">3. Promotional Coupons</h2>
              <p>
                Coupons like TASTE30 are subject to minimum order thresholds and validity windows. Multiple discount codes cannot be combined on a single order.
              </p>
            </>
          )}

          {type === 'refund' && (
            <>
              <h2 className="text-base font-bold text-neutral-900">1. Order Cancellation Window</h2>
              <p>
                Customers may cancel orders free of charge within 60 seconds of submission. Once restaurant preparation commences, cancellations are reviewed by customer support.
              </p>
              <h2 className="text-base font-bold text-neutral-900">2. Quality Guarantee & Instant Refunds</h2>
              <p>
                If your order arrives damaged, incorrect, or with missing items, report it within 2 hours of delivery. Upon verification, full refunds or credits are issued to the original payment source within 24–48 hours.
              </p>
            </>
          )}

          {type === 'delivery' && (
            <>
              <h2 className="text-base font-bold text-neutral-900">1. Estimated Delivery Times</h2>
              <p>
                Our standard delivery time is 25–35 minutes, calculated dynamically based on preparation duration and rider transit distance.
              </p>
              <h2 className="text-base font-bold text-neutral-900">2. Thermal Temperature Guarantee</h2>
              <p>
                All riders use thermal insulated carriers ensuring that food arrives hot (above 60°C) and chilled drinks remain refreshing.
              </p>
            </>
          )}

          <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-400">
            Last Updated: October 2026 • TasteHub Operations Compliance
          </div>
        </div>
      </div>
    </div>
  );
};
