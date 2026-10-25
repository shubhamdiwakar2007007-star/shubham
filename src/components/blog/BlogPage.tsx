import React, { useState } from 'react';
import { Search, Clock, Calendar, User, ArrowLeft, Share2, Tag, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '../../data/mockData';
import { BlogPost } from '../../types';
import { useApp } from '../../context/AppContext';

export const BlogPage: React.FC = () => {
  const { addToast } = useApp();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Culinary Secrets', 'Kitchen Craft', 'Healthy Living'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (activeCategory !== 'All' && post.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      addToast('Article link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="bg-[#111111] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-[#FF7518] uppercase tracking-wider">
              TASTEHUB STORIES & DISPATCHES
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
              Food Culture, Recipes & Guides
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-lg">
              Behind the scenes with our chefs, kitchen secrets, and healthy eating insights.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, ingredients..."
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-full text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#FF7518]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#FF7518] text-white shadow-md'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Selected Article Full View */}
        {selectedPost ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-sm max-w-4xl mx-auto space-y-6">
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Articles</span>
            </button>

            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-900 shadow">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPost.authorAvatar}
                  alt={selectedPost.author}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <p className="text-xs font-bold text-neutral-900">{selectedPost.author}</p>
                  <p className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                    <span>{selectedPost.publishedDate}</span>
                    <span>•</span>
                    <span>{selectedPost.readTime}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleShare(selectedPost.title)}
                className="p-2 rounded-full border border-neutral-200 hover:bg-neutral-50 text-neutral-600 flex items-center gap-1.5 text-xs font-semibold"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Article</span>
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191919] tracking-tight leading-tight">
              {selectedPost.title}
            </h2>

            <div className="prose text-neutral-700 text-sm leading-relaxed whitespace-pre-line space-y-4">
              {selectedPost.content}
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-neutral-100 text-xs">
              <Tag className="w-3.5 h-3.5 text-neutral-400" />
              <div className="flex flex-wrap gap-1.5">
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-full text-[11px] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Articles Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer group"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-neutral-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                      <span>•</span>
                      <span>{post.publishedDate}</span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-900 group-hover:text-[#FF7518] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-neutral-500 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs text-neutral-600">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-semibold text-neutral-800 text-[11px]">{post.author}</span>
                    </div>
                    <span className="font-bold text-[#FF7518] group-hover:translate-x-1 transition-transform">
                      Read More →
                    </span>
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
