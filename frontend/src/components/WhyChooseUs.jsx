import React from 'react';
import { Tag, Gift, Headphones, BadgeCheck, ShieldCheck } from 'lucide-react';

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
      <section className="bg-[#0A1324] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-full border border-amber-500/80 flex items-center justify-center text-amber-500 hover:scale-105 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold tracking-wide text-white">{item.title}</h3>
                  <p className="text-[11px] text-slate-400 font-light leading-relaxed max-w-[200px]">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-[#FAF6F0] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Centered Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif text-slate-800 tracking-wide font-medium">
              What Our Travellers Say
            </h2>
            <div className="w-16 h-[2px] bg-amber-500 mx-auto mt-4"></div>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Premium Quote Icon */}
                  <svg className="w-8 h-8 text-amber-500 mb-4 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-slate-650 text-sm leading-relaxed mb-6 font-light">
                    {t.quote}
                  </p>
                </div>
                <p className="text-xs font-bold text-slate-800">
                  {t.author}
                  <span className="text-slate-400 font-normal"> • {t.trip}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyChooseUs;
