
import React from 'react';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200 dark:border-slate-700">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">About UniTools</h1>
        
        <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
          <p>
            Welcome to <strong>UniTools</strong>, your one-stop destination for free, high-quality, and secure online utilities.
          </p>
          
          <p>
            Founded in 2024, our mission is simple: to make powerful digital tools accessible to everyone, regardless of their technical expertise or budget. 
            Whether you need to merge PDFs for a school project, convert images for your website, or calculate mortgage payments, UniTools is designed to help you get the job done quickly and efficiently.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
             <div className="p-6 bg-blue-50 dark:bg-slate-700/50 rounded-xl">
                 <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2 text-xl">Privacy First</h3>
                 <p className="text-sm">We leverage advanced WebAssembly technology to process most files directly in your browser. This means your sensitive documents often never leave your device, ensuring maximum privacy and security.</p>
             </div>
             <div className="p-6 bg-green-50 dark:bg-slate-700/50 rounded-xl">
                 <h3 className="font-bold text-green-700 dark:text-green-400 mb-2 text-xl">Always Free</h3>
                 <p className="text-sm">We believe essential tools should be free. There are no hidden paywalls, no required subscriptions, and no watermarks on your finished files. Our platform is supported by non-intrusive advertising.</p>
             </div>
             <div className="p-6 bg-purple-50 dark:bg-slate-700/50 rounded-xl">
                 <h3 className="font-bold text-purple-700 dark:text-purple-400 mb-2 text-xl">Constant Innovation</h3>
                 <p className="text-sm">Our team of developers is constantly working to add new tools and improve existing ones. We listen to user feedback to build the utilities you actually need.</p>
             </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Our Technology</h2>
          <p>
            UniTools is built on the cutting edge of modern web development. By utilizing client-side processing capabilities, we reduce server load and increase speed. 
            For tasks requiring AI, such as content generation, we partner with industry-leading providers to deliver state-of-the-art results securely.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Who We Are</h2>
          <p>
            We are a small, passionate team of web engineers, designers, and digital nomads dedicated to simplifying the internet. 
            We started UniTools because we were tired of "free" tools that required sign-ups or had file limits. We knew there was a better way.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Contact Us</h2>
          <p>
            Have a suggestion, found a bug, or just want to say hi? We'd love to hear from you.
            <br />
            Email us at: <a href="mailto:support@unitools.ai" className="text-blue-600 hover:underline font-bold">support@unitools.ai</a>
          </p>
        </div>
      </div>
    </div>
  );
};
