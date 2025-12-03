
import React from 'react';

export const CookiePolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200 dark:border-slate-700">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">Cookie Policy for UniTools</h1>
        
        <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            This is the Cookie Policy for UniTools, accessible from https://unitools.ai.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">What Are Cookies</h2>
          <p>
            As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. 
            This page describes what information they gather, how we use it and why we sometimes need to store these cookies. 
            We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the sites functionality.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">How We Use Cookies</h2>
          <p>
            We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. 
            It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Disabling Cookies</h2>
          <p>
            You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). 
            Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. 
            Disabling cookies will usually result in also disabling certain functionality and features of the this site. Therefore it is recommended that you do not disable cookies.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">The Cookies We Set</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
                <strong>Site preferences cookies:</strong> In order to provide you with a great experience on this site we provide the functionality to set your preferences for how this site runs when you use it (e.g., Dark Mode). In order to remember your preferences we need to set cookies so that this information can be called whenever you interact with a page is affected by your preferences.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Third Party Cookies</h2>
          <p>In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
                <strong>Google Analytics:</strong> This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">More Information</h2>
          <p>
            Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
          </p>
          <p>
            However if you are still looking for more information then you can contact us via email: <strong>support@unitools.ai</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
