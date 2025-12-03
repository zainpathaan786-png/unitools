
import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200 dark:border-slate-700">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
          
          <p>
            At UniTools, accessible from https://unitools.ai, one of our main priorities is the privacy of our visitors. 
            This Privacy Policy document contains types of information that is collected and recorded by UniTools and how we use it.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">1. File Processing and Data Security</h2>
          <p>
            <strong>We do not store your files.</strong>
          </p>
          <p>
            UniTools operates primarily as a client-side utility suite. This means that for the majority of our tools (including Image Converters, PDF tools, and Calculators), 
            your files and data are processed entirely within your web browser using WebAssembly technology. Your files are not uploaded to our servers, ensuring your data remains private and secure on your own device.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">2. Log Files</h2>
          <p>
            UniTools follows a standard procedure of using log files. These files log visitors when they visit websites. 
            The information collected includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, and referring/exit pages. 
            These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, and tracking users' movement on the website.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">3. Cookies and Web Beacons</h2>
          <p>
            Like any other website, UniTools uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. 
            The information is used to optimize the users' experience by customizing our web page content.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">4. Advertising Partners Privacy Policies</h2>
          <p>
            Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on UniTools, which are sent directly to users' browser. 
            They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p>
            Note that UniTools has no access to or control over these cookies that are used by third-party advertisers.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">5. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
          <p>Under the CCPA, among other rights, California consumers have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
            <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
            <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">6. GDPR Data Protection Rights</h2>
          <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The right to access – You have the right to request copies of your personal data.</li>
            <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
            <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
            <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
            <li>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">7. Children's Information</h2>
          <p>
            UniTools does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">8. Contact Us</h2>
          <p>
            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <strong>support@unitools.ai</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
