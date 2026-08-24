import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getImageUrl } from '../api/axios';

const Blog = ({ blogs, onViewAllBlogs, onSelectBlog }) => {
  const displayBlogs = blogs.slice(0, 3);

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
    <section id="blog-section" className="scroll-mt-28 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-slate-900 tracking-tight italic">
            Travel Guide <span className="not-italic">&</span> Stories
          </h2>
          <div className="w-12 h-0.5 bg-amber-500 mt-2"></div>
        </div>
        <button
          type="button"
          onClick={() => { if (onViewAllBlogs) onViewAllBlogs(); }}
          className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-700 hover:text-amber-600 transition-colors cursor-pointer relative z-20"
        >
          VIEW ALL BLOGS
          <span className="w-7 h-7 rounded-full border-2 border-amber-500 flex items-center justify-center">
            <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
          </span>
        </button>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayBlogs.map((blog) => (
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

    </section>
  );
};

export default Blog;
