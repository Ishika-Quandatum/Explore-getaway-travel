import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ChevronRight, MessageSquare, Users, Headphones } from 'lucide-react';
import heroImg from '../assets/hero-BTX8PeM0.jpg';

const ContactPage = ({ onGoBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Hero Banner */}
      <div className="relative h-[320px] md:h-[380px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/30"></div>
        </div>
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12">
          <div className="flex items-center text-slate-300 text-sm mb-4 space-x-2">
            <button onClick={onGoBack} className="hover:text-white transition-colors">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-400">Contact Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-3">
            Get in <span className="text-amber-400 italic">Touch</span>
          </h1>
          <p className="text-slate-300 max-w-xl text-base">
            Have questions about a trip? Need a custom itinerary? We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">24/7 Support</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Our travel experts are available round the clock to assist you.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Group Bookings</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Special rates and custom itineraries for groups of 6 or more.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Quick Response</h3>
              <p className="text-xs text-slate-500 leading-relaxed">We respond to all enquiries within 2 hours during business hours.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Form + Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-serif text-slate-900 mb-2">Send Us a Message</h2>
            <p className="text-sm text-slate-500 mb-8">Fill in the form below and our team will get back to you shortly.</p>

            {submitted && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-2">
                <Send className="w-4 h-4" />
                Thank you! Your message has been sent successfully. We'll be in touch soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all appearance-none"
                  >
                    <option value="">Select a topic</option>
                    <option value="booking">Booking Enquiry</option>
                    <option value="custom">Custom Itinerary</option>
                    <option value="group">Group Tour</option>
                    <option value="honeymoon">Honeymoon Package</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Message</label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your dream trip..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold uppercase tracking-widest text-xs px-8 py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-lg font-bold text-slate-900">Contact Information</h3>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Office Address</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Explore Getaway Pvt. Ltd.<br />
                    123, MG Road, Connaught Place<br />
                    New Delhi, India - 110001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm text-slate-700">+91 98765 43210</p>
                  <p className="text-sm text-slate-700">+91 11 2345 6789</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm text-slate-700">info@exploregetaway.com</p>
                  <p className="text-sm text-slate-700">bookings@exploregetaway.com</p>
                </div>
              </div>

            </div>

            {/* Map placeholder */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.6477069854696!2d77.21713831508096!3d28.632749782416244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741d057%3A0xcdee88e47393c3f1!2sConnaught%20Place!5e0!3m2!1sen!2sin!4v1678900000000!5m2!1sen!2sin"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
