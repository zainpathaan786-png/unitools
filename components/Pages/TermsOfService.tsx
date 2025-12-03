
import React from 'react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200 dark:border-slate-700">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms and Conditions</h1>
        
        <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
          <p>Welcome to UniTools!</p>
          <p>
            These terms and conditions outline the rules and regulations for the use of UniTools's Website, located at https://unitools.ai.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use UniTools if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Cookies</h2>
          <p>
            We employ the use of cookies. By accessing UniTools, you agreed to use cookies in agreement with the UniTools's Privacy Policy. 
            Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. License</h2>
          <p>
            Unless otherwise stated, UniTools and/or its licensors own the intellectual property rights for all material on UniTools. All intellectual property rights are reserved. You may access this from UniTools for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Republish material from UniTools</li>
            <li>Sell, rent or sub-license material from UniTools</li>
            <li>Reproduce, duplicate or copy material from UniTools</li>
            <li>Redistribute content from UniTools</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. User Content and File Processing</h2>
          <p>
            When you use our tools to process files (uploading images, PDFs, etc.), you retain all ownership rights to your content. 
            UniTools acts solely as a data processor. 
            <strong>We do not claim ownership, review, or permanently store user-uploaded content.</strong> 
            Files processed client-side never leave your browser. Files processed server-side (if applicable) are automatically deleted after a short period.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Hyperlinking to our Content</h2>
          <p>The following organizations may link to our Website without prior written approval:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Government agencies;</li>
            <li>Search engines;</li>
            <li>News organizations;</li>
            <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses;</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. iFrames</h2>
          <p>
            Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">6. Content Liability</h2>
          <p>
            We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">7. Reservation of Rights</h2>
          <p>
            We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">8. Disclaimer</h2>
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>limit or exclude our or your liability for death or personal injury;</li>
            <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
            <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
            <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
          </ul>
          <p>
            The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
          </p>
          <p>
            As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
          </p>
        </div>
      </div>
    </div>
  );
};
