
import React from 'react';

const BLOG_POSTS: Array<{
    id: number;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    image: string;
}> = [];

export const Blog: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">UniTools Blog</h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Tips, tutorials, and insights on productivity, file management, and digital tools.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[200px]">
            {BLOG_POSTS.length > 0 ? (
                BLOG_POSTS.map(post => (
                    <article key={post.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow flex flex-col">
                        <div className="h-48 overflow-hidden">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{post.category}</span>
                                <span className="text-xs text-gray-400">{post.date}</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                                {post.title}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex-1">
                                {post.excerpt}
                            </p>
                            <button className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline self-start">
                                Read Article &rarr;
                            </button>
                        </div>
                    </article>
                ))
            ) : (
                <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                    <p className="text-lg">No blog posts available yet. Check back soon!</p>
                </div>
            )}
        </div>
        
        <div className="mt-16 text-center bg-blue-50 dark:bg-slate-800/50 rounded-2xl p-8 md:p-12 border border-blue-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Subscribe to our newsletter</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Get the latest updates, new tools, and productivity tips delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                    Subscribe
                </button>
            </div>
        </div>
    </div>
  );
};
