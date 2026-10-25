import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, CheckCircle2, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContactPage: React.FC = () => {
  const { addToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill out all required fields', 'error');
      return;
    }
    setIsSubmitted(true);
    addToast('Your support message has been dispatched!', 'success');
  };

  const faqs = [
    {
      q: 'How does TasteHub guarantee hot food delivery?',
      a: 'We use multi-layer thermal foil insulated bags equipped with internal heating pads for our delivery fleet. The moment food leaves the restaurant pan, it is packed in steam-sealed biodegradable boxes to retain piping hot temperature for up to 45 minutes.'
    },
    {
      q: 'Can I cancel or modify my order after placing it?',
      a: 'You can cancel or modify your order within 60 seconds of placing it directly from the Live Order Tracker page. Once the kitchen confirms and begins prep, cancellations may incur a nominal fee to compensate the chefs.'
    },
    {
      q: 'What should I do if an item is missing or damaged?',
      a: 'Please click "Contact Support" on the order tracking screen or reach out through this contact form with your Order ID. Our customer experience team processes instant refunds or expedited replacement deliveries within 5 minutes.'
    },
    {
      q: 'Which payment methods are accepted?',
      a: 'We support all major UPI apps (GPay, PhonePe, Paytm, BHIM), Credit/Debit cards (Visa, Mastercard, RuPay), Net Banking across 45+ banks, and Cash on Delivery.'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="bg-[#111111] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-neutral-800 text-center">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#FF7518] uppercase tracking-wider">
            CUSTOMER SUPPORT & INQUIRIES
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            We're Here to Help
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Have a question about an order, restaurant partnership, or feedback? Drop us a line anytime.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Info Cards (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-neutral-900">Direct Contacts</h3>

              <div className="space-y-3 text-xs text-neutral-600">
                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-2xl">
                  <Mail className="w-5 h-5 text-[#FF7518] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-neutral-900">Customer Support</p>
                    <p className="text-neutral-500">support@tastehub.app</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Average response: 5 mins</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-2xl">
                  <Phone className="w-5 h-5 text-[#FF7518] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-neutral-900">Toll-Free Hotline</p>
                    <p className="text-neutral-500">+91 1800 200 4455</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Mon - Sun: 8:00 AM - 12:00 Midnight</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-2xl">
                  <MapPin className="w-5 h-5 text-[#FF7518] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-neutral-900">Headquarters</p>
                    <p className="text-neutral-500">TasteHub Logistics Tower, C-Scheme, Jaipur, Rajasthan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-[#111111] text-white p-6 rounded-3xl border border-neutral-800 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FF7518]">
                <Clock className="w-4 h-4" />
                <span>DELIVERY TIMINGS</span>
              </div>
              <p className="text-sm font-bold">Kitchens Open 7 Days a Week</p>
              <p className="text-xs text-neutral-400">
                Morning: 11:00 AM – 4:00 PM <br />
                Evening: 6:30 PM – 1:00 AM (Late Night Express)
              </p>
            </div>
          </div>

          {/* Contact Form (Col 7) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">Message Received!</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Thank you for contacting TasteHub. Our support team will reply to <strong>{formData.email}</strong> within 15 minutes.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-full"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="text-base font-extrabold text-neutral-900 mb-2">
                  Send a Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Phone Number (Optional)</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Order Issue">Order Delay or Issue</option>
                      <option value="Restaurant Partnership">Restaurant Onboarding</option>
                      <option value="Feedback">Feedback / Suggestions</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you need help with..."
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#FF7518]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FF7518] hover:bg-[#e0630d] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-2xl font-extrabold text-[#191919]">Frequently Asked Questions</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Quick answers about orders, delivery policies, and meal quality.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-neutral-900 flex items-center justify-between gap-4 hover:bg-neutral-50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform ${
                        isOpen ? 'rotate-180 text-[#FF7518]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
