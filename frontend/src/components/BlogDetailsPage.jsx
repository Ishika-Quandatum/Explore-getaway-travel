import React from 'react';
import { getImageUrl } from '../api/axios';

const BlogDetailsPage = ({ blog, onGoBack, recentBlogs = [] }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white min-h-screen pb-16">
      
      {/* Hero Header Section */}
      <div className="relative h-[280px] sm:h-[350px] w-full bg-slate-900 overflow-hidden flex items-center">
        {/* Background Image */}
        <img
          src={getImageUrl(blog.image_url)}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 filter brightness-75"
        />
        {/* Dark Tint Overlay */}
        <div className="absolute inset-0 bg-slate-950/30"></div>
        
        {/* Breadcrumbs and Title Container */}
        <div className="relative max-w-4xl mx-auto w-full px-6 sm:px-8 space-y-3">
          {/* Breadcrumbs */}
          <div className="flex items-center text-slate-200 text-xs font-medium space-x-1.5">
            <button onClick={() => onGoBack('home')} className="hover:text-white hover:underline transition-all">Home</button>
            <span>&gt;</span>
            <button onClick={() => onGoBack('blogs')} className="hover:text-white hover:underline transition-all">Travel Guide</button>
          </div>
          
          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl font-serif text-white leading-tight font-light tracking-wide max-w-3xl">
            {blog.title}
          </h1>
          
          {/* Date & Author */}
          <p className="text-xs text-slate-300 font-light">
            {formatDate(blog.published_at)} • By {blog.author || 'Admin'}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12 space-y-10">
        
        {/* Blog Summary / Subheading */}
        <p className="text-lg sm:text-xl font-serif text-slate-800 leading-relaxed font-light">
          {blog.summary}
        </p>

        {/* Blog Body Paragraphs */}
        <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-6 font-light">
          {blog.content || blog.summary}
        </div>

        {/* Promo Card CTA */}
        <div className="bg-white rounded-sm p-8 border border-slate-100 shadow-sm space-y-5 mt-10">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-serif text-slate-900 font-medium">Ready to travel?</h3>
            <p className="text-xs text-slate-500 font-light">
              Browse our curated packages with day-wise itineraries and instant booking.
            </p>
          </div>
          <button
            onClick={() => onGoBack('home-packages')}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-sm flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            Explore Packages &rarr;
          </button>
        </div>

        {/* More from the Guide (Related Blogs List) */}
        {recentBlogs.length > 0 && (
          <div className="pt-10 border-t border-slate-100 space-y-6">
            <div>
              <h2 className="text-2xl font-serif text-slate-900 tracking-wide font-medium">
                More from the guide
              </h2>
              <div className="w-12 h-0.5 bg-amber-500 mt-2"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentBlogs.filter(b => b.id !== blog.id).slice(0, 3).map((item) => (
                <div
                  key={item.id || item.slug}
                  onClick={() => onGoBack('switch', item)}
                  className="group flex flex-col cursor-pointer bg-white rounded-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-slate-100"
                >
                  <div className="h-36 w-full overflow-hidden bg-slate-100">
                    <img
                      src={getImageUrl(item.image_url)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold font-serif text-slate-950 group-hover:text-amber-700 transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                    <span className="text-[10px] sm:text-xs text-slate-400 block">{formatDate(item.published_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default BlogDetailsPage;
