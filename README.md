---

## 🛠️ Local Setup (for Contributors & Developers)

To run this project locally (for development or contribution), follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/PriyanshuDas01/notsounusual_NPM_Package.git
cd notsounusual_NPM_Package
```
### 2. Install Dependencies
```bash

npm install
# or
yarn install
```
### 3. Set Environment Variables
Create a .env.local file in the root directory and add your Gemini API key:

```env
Copy
Edit
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```
🔐 You can get your Gemini API key from Google MakerSuite -> // Get from https://makersuite.google.com/app/apikey

### 4. Run the Dev Server
```bash
npm run dev
# or
yarn dev
```
Then open http://localhost:3000 in your browser to see the app.



# NotSoUnusual (Package info)

**Serve multiple dynamic webpages from a single URL!** A React and Next.js package that uses custom tags `<unseen>...</unseen>` to transform text and UI dynamically using AI, with support for UTM parameters, user information, and theme customization.

> 🚀 **New in v2.2.0**: Full UI transformation support! The package now supports dynamic UI changes based on user context and theme configuration.

> 🌐 **Visit our landing page**: [notsounusualui.vercel.app](https://notsounusualui.vercel.app/) for live demos and more information.

## Features

* 🎯 **Smart Traffic Source Detection**: Automatically detects user origins and referrers
* 🎨 **Dynamic UI Transformation**: Transform UI elements based on user context
* 📝 **Text Transformation**: Transform text content using AI
* 🎯 **UTM Parameter Support**: Customize content based on marketing parameters
* 👤 **User Information**: Access device type, platform, and language
* 🎨 **Theme Customization**: Customize colors, fonts, and styles
* 🔄 **Real-time Updates**: Transform content as users navigate
* 🎯 **Journey-Aware Content**: Adapt content based on user's entry point
* 🚀 **Gemini AI Integration**: Powered by Google's Gemini Pro model

## Installation

```bash
npm install notsounusual@2.2.0
# or
yarn add notsounusual@2.2.0
```

## Quick Start

### Basic Text Transformation

```jsx
import { UnseenProvider, Unseen } from 'notsounusual';

function App() {
  return (
    <UnseenProvider 
      useGemini={true}
      geminiApiKey="YOUR_GEMINI_API_KEY"  // Get from https://makersuite.google.com/app/apikey
    >
      <h1>
        <Unseen>This text will be transformed by AI</Unseen>
      </h1>
    </UnseenProvider>
  );
}
```


### Custom Prompts for Campaign-Specific Transformations

```jsx
import { UnseenProvider, Unseen } from 'notsounusual';

function App() {
  const getCustomPrompt = (utmConfig) => {
    // Default prompt for banking solutions
    const defaultPrompt = `
      Transform this into a banking solutions page with the following theme:
      - Heading: Modern banking solutions
      - Button colors: #1976d2 (primary), #dc004e (secondary)
      - Hover effects: Slight scale and shadow
      - Links: Banking solutions, Loans, Credit cards
      - Important: Maintain the structure and design
    `;

    // Campaign-specific prompts
    const campaignPrompts = {
      home_loans: `
        Transform this into a home loans page with the following theme:
        - Heading: Your dream home is closer than you think
        - Button colors: #2e7d32 (primary), #c62828 (secondary)
        - Hover effects: Elevation and color shift
        - Links: Home loans, Mortgage calculator, Apply now
        - Important: Focus on home ownership benefits
      `,
      credit_cards: `
        Transform this into a credit cards page with the following theme:
        - Heading: Rewards that match your lifestyle
        - Button colors: #1565c0 (primary), #d32f2f (secondary)
        - Hover effects: Glow and scale
        - Links: Credit cards, Rewards, Apply now
        - Important: Emphasize rewards and benefits
      `,
      investment: `
        Transform this into an investment page with the following theme:
        - Heading: Grow your wealth with smart investments
        - Button colors: #0277bd (primary), #c2185b (secondary)
        - Hover effects: Smooth transition and shadow
        - Links: Investments, Portfolio, Get started
        - Important: Focus on growth and security
      `
    };

    // Return campaign-specific prompt or default
    return campaignPrompts[utmConfig?.campaign] || defaultPrompt;
  };

  return (
    <UnseenProvider 
      useGemini={true}
      geminiApiKey="YOUR_GEMINI_API_KEY"  // Get from https://makersuite.google.com/app/apikey
      customPrompt={getCustomPrompt}
    >
      <div>
        <Unseen transformUI={true}>
          <button className="cta-button">
            Click me to transform
          </button>
        </Unseen>
      </div>
    </UnseenProvider>
  );
}
```

### UI Transformation with Theme

```jsx
import { UnseenProvider, Unseen } from 'notsounusual';

function App() {
  const themeConfig = {
    colors: {
      primary: '#1976d2',
      secondary: '#dc004e',
      background: '#ffffff',
      text: '#333333',
      accent: '#4caf50',
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '16px',
      fontWeight: '400',
    },
    spacing: {
      small: '8px',
      medium: '16px',
      large: '24px',
    },
    borderRadius: '4px',
    shadows: '0 2px 4px rgba(0,0,0,0.1)',
  };

  return (
    <UnseenProvider 
      useGemini={true}
      geminiApiKey="YOUR_GEMINI_API_KEY"  // Get from https://makersuite.google.com/app/apikey
      themeConfig={themeConfig}
    >
      <div>
        <Unseen transformUI={true}>
          <button className="cta-button">
            Click me to transform
          </button>
        </Unseen>
      </div>
    </UnseenProvider>
  );
}
```

### Smart Traffic Source Detection

The package automatically detects and adapts to how users arrive at your site:

```jsx
import { UnseenProvider, Unseen } from 'notsounusual';

function App() {
  const getCustomPrompt = (utmConfig, userInfo) => {
    // Detect traffic source
    const referrer = userInfo.referrer;
    const source = utmConfig?.source;

    // Customize content based on traffic source
    if (referrer.includes('google.com')) {
      return `
        Transform this into a search-optimized page:
        - Focus on search intent
        - Include relevant keywords
        - Optimize for search visibility
      `;
    } else if (referrer.includes('facebook.com')) {
      return `
        Transform this into a social-friendly page:
        - Engaging social media style
        - Shareable content
        - Social proof elements
      `;
    } else if (source === 'email') {
      return `
        Transform this into an email-campaign page:
        - Personalized greeting
        - Campaign-specific offers
        - Email-exclusive content
      `;
    }

    // Default transformation
    return `
      Transform this into a general landing page:
      - Clear value proposition
      - Engaging content
      - Strong call-to-action
    `;
  };

  return (
    <UnseenProvider 
      useGemini={true}
      geminiApiKey="YOUR_GEMINI_API_KEY"  // Get from https://makersuite.google.com/app/apikey
      customPrompt={getCustomPrompt}
    >
      <div>
        <Unseen transformUI={true}>
          <button className="cta-button">
            Click me to transform
          </button>
        </Unseen>
      </div>
    </UnseenProvider>
  );
}
```


### Using OpenRouter (Alternative)

> ⚠️ **Note**: While OpenRouter is supported, we strongly recommend using Gemini for better performance, reliability, and cost-effectiveness.

```jsx
import { UnseenProvider, Unseen } from 'notsounusual';

function App() {
  return (
    <UnseenProvider 
      apiKey="YOUR_OPENROUTER_API_KEY"  // Get from https://openrouter.ai/
      useGemini={false}  // Set to false to use OpenRouter
    >
      <div>
        <Unseen transformUI={true}>
          <button className="cta-button">
            Click me to transform
          </button>
        </Unseen>
      </div>
    </UnseenProvider>
  );
}
```

## Props

### UnseenProvider Props

| Prop         | Type        | Description                                         |
|--------------|-------------|-----------------------------------------------------|
| geminiApiKey | string      | Your Gemini API key (required for Gemini)           |
| apiKey       | string      | Your OpenRouter API key (required for OpenRouter)   |
| useGemini    | boolean     | Set to true to use Gemini API (recommended)         |
| customPrompt | string/function | Optional custom prompt or function that returns a prompt based on UTM config |
| utmConfig    | UtmConfig   | Optional UTM parameters (overrides URL parameters)  |
| themeConfig  | ThemeConfig | Optional theme configuration for UI transformation  |

### Unseen Props

| Prop         | Type          | Description                                |
|--------------|---------------|--------------------------------------------|
| children     | ReactNode     | The content to be transformed              |
| transformUI  | boolean       | Enable UI transformation (default: false)  |
| componentId  | string        | Optional component identifier              |
| componentName| string        | Optional component name                    |

## Theme Configuration

The `themeConfig` prop allows you to customize the appearance of transformed UI elements:

```typescript
interface ThemeConfig {
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
    accent?: string;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
  };
  spacing?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  borderRadius?: string;
  shadows?: string;
}
```

## Marketing Use Cases

1. **Dynamic Headlines**: Generate different headlines based on traffic source
2. **Personalized CTAs**: Customize call-to-action text and appearance based on campaign
3. **A/B Testing**: Test different text and UI variations automatically
4. **Campaign-Specific Content**: Show different content and styling for different marketing campaigns
5. **Channel-Specific Messaging**: Adapt tone, style, and UI based on marketing channel
6. **Device-Specific Content**: Customize content and layout based on user's device and screen size
7. **Language-Aware Content**: Adapt content and UI based on user's language preferences

## UTM Parameter Support

The package supports all standard UTM parameters:

* `utm_source`: Traffic source (e.g., facebook, google)
* `utm_medium`: Marketing medium (e.g., social, email)
* `utm_campaign`: Campaign name
* `utm_content`: Content identifier
* `utm_term`: Search terms

## User Information Collected

* **Browser Information**:
  * Device type (mobile/desktop/tablet)
  * Platform (OS)
  * Language preferences
  * Screen resolution

* **Session Information**:
  * Entry page
  * Referrer URL
  * Session start time

* **Geographic Information**:
  * Timezone

## Why Gemini?

Gemini API is recommended for better performance and reliability:
- Faster response times
- More accurate transformations
- Better context understanding
- Cost-effective
- No rate limiting issues
- Better support for complex UI transformations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## React Version Support

- React 16.8.0 and above
- React 17.x
- React 18.x
- React 19.x

## License

MIT License

## Support

For support, please open an issue in the GitHub repository.

## Author

Priyanshu Das



