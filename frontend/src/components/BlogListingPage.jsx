import React from 'react';
import { ChevronRight } from 'lucide-react';
import { getImageUrl } from '../api/axios';

const BlogListingPage = ({ blogs, onGoBack, onSelectBlog }) => {
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
    <div className="bg-slate-50 min-h-screen">

      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center text-slate-400 text-xs mb-4 space-x-2">
            <button onClick={() => onGoBack('home')} className="hover:text-slate-700 transition-colors font-medium">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-650 font-semibold">Blogs</span>
          </div>
          <h1 className="text-3xl font-serif text-slate-900 italic">
            Travel Guide <span className="not-italic">&</span> Stories
          </h1>
          <div className="w-12 h-0.5 bg-amber-500 mt-2"></div>
          <p className="text-sm text-slate-500 mt-3 max-w-xl">
            Explore our collection of travel guides, destination tips, and inspiring stories from across India.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {blogs.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-slate-500 text-sm">No blog articles published yet. Check back soon!</p>
            <button onClick={() => onGoBack('home')} className="text-xs font-bold text-amber-600 hover:text-amber-700">
              ← Back to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id || blog.slug}
                onClick={() => { if (onSelectBlog) onSelectBlog(blog); }}
                className="group flex flex-col cursor-pointer bg-white rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={getImageUrl(blog.image_url)}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="px-5 pt-5 pb-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-light">
                      {blog.summary}
                    </p>
                  </div>

                  {/* Date & Author Footer */}
                  <div className="pt-2 text-xs text-slate-400 font-medium">
                    {formatDate(blog.published_at)} • By <span className="text-slate-600">{blog.author || 'Admin'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default BlogListingPage;
