import React from 'react';
import { Unseen, UnseenProvider, useUtmConfig } from 'notsounusual';

const geminiApiKey = 'AIzaSyCqPjFB1ftkI3wN7FyobSsFe7o6MrWZeww';

function App() {
  const [utmConfig] = useUtmConfig();

  // Generate custom prompt based on UTM campaign
  const getCustomPrompt = () => {
    if (!utmConfig.campaign) {
      return `Transform this banking hero section to show the most relevant section based on the user info and UTM parameters. The heading should be 4-5 words and the button links should match this heading.

IMPORTANT:
1. Use these exact element keys:
   - "main-heading" for the h1 element (4-5 words only)
   - "apply-button" for the apply button (must use one of these exact links: /homeloan, /personalloan, /educationloan, do not use any other link)
   - "learn-more" for the learn more button (must use the same base link as apply-button with /details added)
2. Link rules:
   - If heading mentions "home" or "property", use /homeloan
   - If heading mentions "personal" or "cash", use /personalloan
   - If heading mentions "education" or "study", use /educationloan
   - The learn-more button must use the same base link + /details
3. Keep all other elements unchanged
4. Maintain the original text length and structure
5. Keep the features section unchanged
6. Ensure responsive design is preserved`;
    }

    return `Transform this banking hero section based on the UTM parameters. 

If no UTM campaign is present:
1. Use these exact element keys:
   - "main-heading" for the h1 element (4-5 words only)
   - "apply-button" for the apply button (must use one of these exact links: /homeloan, /personalloan, /educationloan)
   - "learn-more" for the learn more button (must use the same base link as apply-button with /details added)
2. Link rules:
   - If heading mentions "home" or "property", use /homeloan
   - If heading mentions "personal" or "cash", use /personalloan
   - If heading mentions "education" or "study", use /educationloan
   - The learn-more button must use the same base link + /details

If UTM campaign is present, use these exact configurations:

1. For home_loans:
   - Heading: "Your Dream Home Awaits"
   - Apply button: 
     * Color: #4CAF50
     * Hover: #388E3C
     * Link: /homeloan
   - Learn more button:
     * Color: #2196F3
     * Hover: #1976D2
     * Link: /homeloan/details

2. For personal_loans:
   - Heading: "Quick Cash When You Need"
   - Apply button: 
     * Color: #FF9800
     * Hover: #F57C00
     * Link: /personalloan
   - Learn more button:
     * Color: #9C27B0
     * Hover: #7B1FA2
     * Link: /personalloan/details

3. For education_loans:
   - Heading: "Invest in Your Future"
   - Apply button: 
     * Color: #009688
     * Hover: #00796B
     * Link: /educationloan
   - Learn more button:
     * Color: #3F51B5
     * Hover: #303F9F
     * Link: /educationloan/details

4. For gold_loans:
   - Heading: "Unlock Your Gold's Value"
   - Apply button: 
     * Color: #FFC107
     * Hover: #FFA000
     * Link: /goldloan
   - Learn more button:
     * Color: #673AB7
     * Hover: #512DA8
     * Link: /goldloan/details

5. For credit_cards:
   - Heading: "Smart Spending, Smart Living"
   - Apply button: 
     * Color: #F44336
     * Hover: #D32F2F
     * Link: /creditcard
   - Learn more button:
     * Color: #607D8B
     * Hover: #455A64
     * Link: /creditcard/details

IMPORTANT:
1. Use these exact element keys:
   - "main-heading" for the h1 element
   - "apply-button" for the apply button
   - "learn-more" for the learn more button
2. Include hover effects for all buttons
3. Add the specified links to the buttons
4. Maintain the original text length and structure
5. Keep the features section unchanged
6. Ensure responsive design is preserved
7. Use the exact color values specified
8. Follow the theme configuration exactly for the current UTM campaign
9. For each button element, include both text and href in the transformation:
   {
     "elements": {
       "apply-button": {
         "text": "Apply Now",
         "href": "/homeloan"  // or appropriate link based on campaign
       },
       "learn-more": {
         "text": "Learn More",
         "href": "/homeloan/details"  // must match apply-button base + /details
       }
     }
   }`;
  };

  return (
    <UnseenProvider
      useGemini={true}
      geminiApiKey={geminiApiKey}
      customPrompt={getCustomPrompt()}
      utmConfig={utmConfig}
    >
      <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent animate-pulse"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_rgba(255,255,255,0.05)_50%,_transparent_75%)] bg-[length:20px_20px]"></div>
        </div>

        {/* Hero Section */}
        <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
          <div className="max-w-6xl w-full mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <Unseen transformUI={true}>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm font-medium mb-4">
                      Banking Solutions
                    </div>
                    <h1 id="main-heading" className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                      Credit Card Solutions
                    </h1>
                    <p className="description text-xl text-white/80 leading-relaxed max-w-xl">
                      Experience banking that adapts to your needs with our innovative credit card solutions
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="/banking"
                      id="apply-button"
                      className="group px-8 py-4 bg-white text-blue-900 rounded-full hover:bg-blue-50 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 relative overflow-hidden"
                    >
                      <span className="relative z-10">Apply Now</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </a>
                    <a
                      href="banking/details"
                      id="learn-more"
                      className="group px-8 py-4 bg-transparent text-white border-2 border-white rounded-full hover:bg-white/10 transition-all duration-300 font-semibold text-lg relative overflow-hidden"
                    >
                      <span className="relative z-10">Learn More</span>
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </a>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="flex items-center space-x-3 text-white/80">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span>24/7 Support</span>
                    </div>
                    <div className="flex items-center space-x-3 text-white/80">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <span>Low Rates</span>
                    </div>
                  </div>
                </div>
              </Unseen>

              {/* Right Column - Visual Element */}
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl animate-pulse"></div>
                  <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_rgba(255,255,255,0.1)_50%,_transparent_75%)] bg-[length:20px_20px] animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Button Section */}
            <div className="mt-16 flex justify-center">
              <Unseen transformUI={true}>
                <button
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 relative overflow-hidden"
                >
                  <span className="relative z-10">Test Button</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Unseen>
            </div>
          </div>
        </div>
      </div>
    </UnseenProvider>
  );
}

export default App; 