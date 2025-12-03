
import React, { useState } from 'react';

export const ContactUs: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, this would send data to a backend
      setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200 dark:border-slate-700">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    Have a question, suggestion, or encountered a bug? We'd love to hear from you. 
                    Fill out the form or send us an email directly.
                </p>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase text-gray-500">Email</p>
                            <p className="font-medium">support@unitools.ai</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase text-gray-500">Location</p>
                            <p className="font-medium">Digital First / Global</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700/30 p-6 rounded-xl border border-gray-100 dark:border-slate-700">
                {submitted ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Message Sent!</h3>
                        <p className="text-gray-500 dark:text-gray-400">We'll get back to you as soon as possible.</p>
                        <button onClick={() => setSubmitted(false)} className="mt-6 text-blue-600 font-medium hover:underline">Send another message</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Name</label>
                            <input required type="text" className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input required type="email" className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Message</label>
                            <textarea required rows={4} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="How can we help?"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow">Send Message</button>
                    </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
