
import React from 'react';

const FAQS = [
  {
    question: "Is UniTools completely free?",
    answer: "Yes! All tools on UniTools are 100% free to use. There are no hidden costs, premium subscriptions, or limits on the number of files you can process."
  },
  {
    question: "Are my files secure?",
    answer: "Absolutely. We prioritize your privacy by processing most files locally in your browser using advanced WebAssembly technology. This means your sensitive documents often never leave your device."
  },
  {
    question: "Do I need to create an account?",
    answer: "No registration is required. You can use all our tools anonymously without providing an email address or creating a password."
  },
  {
    question: "Can I use UniTools on my phone?",
    answer: "Yes, our website is fully responsive and optimized for all devices, including smartphones, tablets, and desktop computers."
  },
  {
    question: "Why does it take time to process?",
    answer: "Since we process many files directly in your browser to ensure privacy, the speed depends on your device's processing power (CPU/RAM). Cloud uploads are avoided for security."
  }
];

export const FAQ: React.FC = () => {
  return (
    <section className="py-16 bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Container Frame */}
        <div className="border-2 border-indigo-500/20 rounded-[2.5rem] p-8 md:p-12 bg-white dark:bg-slate-900 relative">
            
            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                    Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                    Common questions about our tools and services
                </p>
            </div>

            {/* Static Grid Layout (Non-Collapsible) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FAQS.map((faq, index) => (
                    <div 
                        key={index}
                        className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all duration-300 hover:shadow-sm group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-600 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
};
