import React from 'react';
import { Tag, Gift, Headphones, BadgeCheck, ShieldCheck, Quote } from 'lucide-react';

const features = [
  {
    icon: Tag,
    title: 'Best Price Guarantee',
    desc: 'We offer the best prices for your dream vacations.'
  },
  {
    icon: Gift,
    title: 'Customizable Packages',
    desc: 'Tailor-made packages as per your preferences.'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'We are always here to assist you anytime.'
  },
  {
    icon: BadgeCheck,
    title: 'Trusted & Experienced',
    desc: '10+ years of experience in travel industry.'
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Secure Travel',
    desc: 'Your safety is our top priority always.'
  }
];

const testimonials = [
  {
    quote: 'Every hotel, every transfer and every meal was exactly as promised. The houseboat night was the highlight of our year.',
    author: 'Ananya Sharma',
    trip: 'Kashmir Paradise'
  },
  {
    quote: 'They handled the ferries, the reef snorkelling and even a surprise anniversary cake. Completely stress-free.',
    author: 'Rahul & Priya',
    trip: 'Andaman Honeymoon'
  },
  {
    quote: 'The acclimatisation plan was thoughtful and our driver knew every viewpoint. Pangong at sunrise was unreal.',
    author: 'Vikram Nair',
    trip: 'Leh Ladakh Explorer'
  }
];

const WhyChooseUs = () => {
  return (
    <div className="w-full">
      {/* Dark Features Section */}
      <section className="bg-[#0A1324] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-full border border-amber-500/80 flex items-center justify-center text-amber-500 hover:scale-105 transition-transform duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold tracking-wide text-white">{item.title}</p>
                  <p className="mt-1 text-[11px] text-white/75 font-light leading-relaxed max-w-[200px]">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="pt-14 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          {/* Centered Heading */}
          <div className="text-center">
            <h2 className="text-3xl font-serif text-slate-900 tracking-tight">
              What Our Travellers Say
            </h2>
            <div className="w-12 h-0.5 bg-amber-500 mx-auto mt-2"></div>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <figure
                key={idx}
                className="rounded-sm bg-white p-6 shadow-[var(--card-shadow)] hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Premium Quote Icon */}
                  <Quote className="h-6 w-6 text-amber-500 mb-4" />
                  <p className="text-sm text-slate-500 leading-relaxed mb-6 font-light">
                    {t.quote}
                  </p>
                </div>
                <p className="text-xs font-bold text-slate-800">
                  {t.author}
                  <span className="text-slate-400 font-normal"> • {t.trip}</span>
                </p>
              </figure>
            ))}
          </div>
      </section>
    </div>
  );
};

export default WhyChooseUs;
