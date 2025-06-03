import React, { createContext, useState, useCallback, useEffect, useContext, useRef } from 'react';
import type { UnseenProviderProps, TransformResponse, ThemeConfig, UtmConfig, UnseenContextType, UserInfo } from '../types/index';
import { useUtmConfig, mergeUtmConfig } from '../utils/utmManager';

export const UnseenContext = createContext<UnseenContextType | null>(null);

// Utility to recursively extract text from React nodes
function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join(' ');
  if (React.isValidElement(node)) return extractText(node.props.children);
  return '';
}

// Utility to get UTM parameters from URL
function getUtmParams(): UtmConfig {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    medium: params.get('utm_medium') || undefined,
    term: params.get('utm_term') || undefined,
    content: params.get('utm_content') || undefined
  };
}

export const UnseenProvider: React.FC<UnseenProviderProps> = ({
  children,
  theme = {},
  utmConfig: propUtmConfig = {},
  userInfo = {},
  useGemini = false,
  geminiApiKey = null,
  customPrompt
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [urlUtmConfig] = useUtmConfig();
  const [utmConfig, setUtmConfig] = useState<UtmConfig>(propUtmConfig);
  const transformationCache = useRef<Map<string, TransformResponse>>(new Map());

  // Handle UTM parameter changes
  useEffect(() => {
    const newUtmConfig = mergeUtmConfig(propUtmConfig);
    console.log('UTM parameters updated:', newUtmConfig);
    setUtmConfig(newUtmConfig);
  }, [propUtmConfig, urlUtmConfig]);

  const transformText = useCallback(async (text: string | React.ReactNode, transformUI: boolean = false): Promise<TransformResponse> => {
    if (!text) {
      console.log('No text to transform');
      return { text: '' };
    }

    // Clear cache on each transformation
    transformationCache.current.clear();
    console.log('Cache cleared');

    // If not transforming UI and no custom prompt, return original content
    if (!transformUI && !customPrompt) {
      console.log('No transformation needed:', { transformUI, hasCustomPrompt: !!customPrompt });
      return { text: typeof text === 'string' ? text : 'Original content' };
    }

    // Create a cache key based on the input and transformation parameters
    const textContent = typeof text === 'string' ? text : extractText(text);
    const cacheKey = `${textContent}-${transformUI}-${customPrompt}-${JSON.stringify(utmConfig)}`;

    console.log('Transformation request:', {
      textContent,
      transformUI,
      customPrompt,
      utmConfig,
      cacheKey
    });

    // Check if we have a cached result
    const cachedResult = transformationCache.current.get(cacheKey);
    if (cachedResult) {
      console.log('Using cached transformation result');
      return cachedResult;
    }

    try {
      if (useGemini && geminiApiKey) {
        console.log('Using Gemini API for transformation');
        try {
          const result = await transformWithGemini(text, transformUI);
          console.log('Gemini transformation result:', result);
          // Cache the result
          transformationCache.current.set(cacheKey, result);
          return result;
        } catch (error) {
          console.error('Gemini transformation failed:', error);
          return { text: typeof text === 'string' ? text : 'Original content' };
        }
      }
      console.log('Gemini API not enabled or no API key');
      return { text: typeof text === 'string' ? text : 'Original content' };
    } catch (error) {
      console.error('Transformation error:', error);
      return { text: typeof text === 'string' ? text : 'Original content' };
    }
  }, [useGemini, geminiApiKey, customPrompt, utmConfig]);

  const transformWithGemini = async (text: string | React.ReactNode, transformUI: boolean = false): Promise<TransformResponse> => {
    if (!useGemini || !geminiApiKey) {
      throw new Error('Gemini API is not enabled or API key is not configured');
    }

    // Use extractText to get all text content from React nodes
    const textContent = extractText(text);
    console.log('Sending to Gemini API:', { 
      textContent, 
      transformUI, 
      customPrompt,
      utmConfig,
      apiKey: geminiApiKey ? 'present' : 'missing'
    });

    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log('Making Gemini API call, attempt:', attempt);

        // Generate dynamic prompt based on UTM parameters
        let dynamicPrompt = customPrompt || 'Transform this component';
        
        if (transformUI) {
          console.log('UTM Config:', utmConfig);
          console.log('Custom Prompt:', customPrompt);
          
          // Format the prompt for UI transformation
          const formattedPrompt = `You are a UI transformer. Your task is to transform the following React components based on this instruction: "${dynamicPrompt}"
          
          Here is the exact component code to transform:
          ${textContent}
          
          Current UTM parameters:
          - Source: ${utmConfig?.source || 'none'}
          - Campaign: ${utmConfig?.campaign || 'none'}
          - Medium: ${utmConfig?.medium || 'none'}
          - Term: ${utmConfig?.term || 'none'}
          - Content: ${utmConfig?.content || 'none'}
          
          Return ONLY a JSON object in this exact format:
          {
            "elements": {
              "element-id-or-class": {
                "text": "new text content if needed",
                "style": {
                  "backgroundColor": "color value",
                  "color": "text color",
                  "fontSize": "size value",
                  "hover": {
                    "backgroundColor": "hover color",
                    "color": "hover text color"
                  }
                }
              }
            }
          }
          
          IMPORTANT:
          1. Use the exact ID or className from the component code as keys
          2. Only include elements that need to be transformed
          3. For hover effects, use a "hover" object inside the style
          4. For text changes, include a "text" property
          5. Return only the JSON object, no explanations
          6. Make sure to include exact color values in the response
          7. The response must be a valid JSON object with the "elements" property
          8. You can transform any element with an ID or className
          9. Support any valid CSS property in the style object
          10. Maintain the original structure and only modify specified elements
          11. Follow any specific instructions in the custom prompt
          12. Consider UTM parameters if provided in the custom prompt`;

          console.log('Sending formatted prompt to Gemini:', formattedPrompt);

          try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': geminiApiKey
              },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: formattedPrompt
                  }]
                }]
              })
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              console.error('Gemini API error:', response.status, response.statusText, errorData);
              throw new Error(`Gemini API error: ${response.status} ${response.statusText}${errorData.error?.message ? ` - ${errorData.error.message}` : ''}`);
            }

            const data = await response.json();
            console.log('Gemini API response:', data);
            
            if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
              throw new Error('Invalid response format from Gemini API');
            }

            const responseText = data.candidates[0].content.parts[0].text;
            console.log('Raw response text:', responseText);

            try {
              const cleanedResponse = responseText.replace(/```json\n|\n```/g, '').trim();
              console.log('Cleaned response:', cleanedResponse);
              
              const parsedResponse = JSON.parse(cleanedResponse);
              console.log('Parsed UI response:', parsedResponse);

              // Structure the response according to our expected format
              const uiResponse = {
                type: 'container' as const,
                content: parsedResponse.text,
                elements: parsedResponse.elements || {},
                text: parsedResponse.text,
                style: parsedResponse.style,
                headings: parsedResponse.headings,
                paragraphs: parsedResponse.paragraphs,
                buttons: parsedResponse.buttons
              };

              console.log('Final UI response:', uiResponse);

              const result: TransformResponse = {
                text: parsedResponse.text,
                ui: uiResponse
              };

              console.log('Returning style update result:', result);
              return result;
            } catch (parseError) {
              console.warn('Failed to parse UI transformation:', parseError);
              console.warn('Raw response:', responseText);
              return { text: responseText };
            }
          } catch (error) {
            const isLastAttempt = attempt === maxRetries;
            const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff

            if (isLastAttempt) {
              console.error(`Gemini transformation failed after ${maxRetries} attempts:`, error);
              throw new Error(`Gemini API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }

            console.warn(`Gemini API attempt ${attempt} failed, retrying in ${delay}ms...`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }

        return { text: textContent };
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;
        const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff

        if (isLastAttempt) {
          console.error(`Gemini transformation failed after ${maxRetries} attempts:`, error);
          throw new Error(`Gemini API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        console.warn(`Gemini API attempt ${attempt} failed, retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // This should never be reached due to the throw in the last attempt
    throw new Error('Unexpected error in Gemini transformation');
  };

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Clear cache when customPrompt or utmConfig changes
  useEffect(() => {
    transformationCache.current.clear();
  }, [customPrompt, utmConfig]);

  const value: UnseenContextType = {
    transformText,
    theme,
    utmConfig,
    userInfo,
    isInitialized,
    useGemini,
    geminiApiKey,
    customPrompt
  };

  return (
    <UnseenContext.Provider value={value}>
      {children}
    </UnseenContext.Provider>
  );
};

async function transformWithOpenRouter(
  text: string,
  apiKey: string,
  customPrompt?: string,
  utmConfig?: UtmConfig,
  userInfo?: UserInfo,
  transformUI: boolean = false
): Promise<TransformResponse> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.3-8b-instruct:free',
      messages: [
        {
          role: 'user',
          content: `${customPrompt || 'Transform this content based on the user context:'}\n\nContext:\n${JSON.stringify({ utm: utmConfig, user: userInfo }, null, 2)}\n\nText to transform: ${text}\n\n${
            transformUI 
              ? 'IMPORTANT: Transform the entire UI structure. Respond with ONLY a valid JSON object containing the complete UI structure with all components and their styles. Include any href/links if present.'
              : 'IMPORTANT: Transform only the text content. Respond with ONLY a valid JSON object containing the text changes.'
          }\n\n${
            transformUI
              ? '{\n  "text": "transformed text",\n  "ui": {\n    "type": "container",\n    "content": {\n      "components": [\n        {\n          "type": "text|card|button|link",\n          "content": "content to display",\n          "href": "optional link",\n          "style": {\n            "color": "color value",\n            "fontFamily": "font family",\n            "fontSize": "font size",\n            "backgroundColor": "background color",\n            "padding": "padding value",\n            "borderRadius": "border radius",\n            "boxShadow": "box shadow"\n          }\n        }\n      ]\n    }\n  }\n}'
              : '{\n  "text": "transformed text",\n  "ui": {\n    "type": "text",\n    "content": "transformed content",\n    "style": {}\n  }\n}'
          }`
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('OpenRouter API request failed');
  }

  const data = await response.json();
  const responseText = data.choices[0].message.content;
  
  try {
    // Clean the response text to ensure it's valid JSON
    const cleanedResponse = responseText.replace(/```json\s*|\s*```/g, '') // Remove markdown code block
      .replace(/^[\s\n]+|[\s\n]+$/g, '') // Remove leading/trailing whitespace
      .trim();
    console.log('Cleaned response:', cleanedResponse);
    
    const uiResponse = JSON.parse(cleanedResponse);
    console.log('Parsed UI response:', uiResponse);
    
    // Handle both full UI structure and simple style updates
    if (uiResponse.style) {
      const result = {
        text: uiResponse.text || text,
        ui: {
          type: 'container' as const,
          content: text,
          style: {
            // Use background if provided, otherwise use backgroundColor
            ...(uiResponse.style.background ? { background: uiResponse.style.background } : {}),
            ...(uiResponse.style.backgroundColor && !uiResponse.style.background ? { backgroundColor: uiResponse.style.backgroundColor } : {}),
            color: uiResponse.style.color,
            textDecoration: uiResponse.style.textDecoration,
            fontWeight: uiResponse.style.fontWeight,
            fontStyle: uiResponse.style.fontStyle,
            textAlign: uiResponse.style.textAlign,
            borderColor: uiResponse.style.borderColor,
            borderStyle: uiResponse.style.borderStyle
          },
          headings: uiResponse.headings ? {
            h1: uiResponse.headings.h1
          } : undefined,
          paragraphs: uiResponse.paragraphs ? {
            p: uiResponse.paragraphs.p
          } : undefined,
          buttons: uiResponse.buttons ? {
            button: {
              text: uiResponse.buttons.button?.text,
              href: uiResponse.buttons.button?.href,
              style: uiResponse.buttons.button?.style
            }
          } : undefined
        }
      };
      console.log('Returning style update result:', result);
      return result;
    }

    // Handle full UI structure response
    const filteredStyle = uiResponse.style ? {
      // Use background if provided, otherwise use backgroundColor
      ...(uiResponse.style.background ? { background: uiResponse.style.background } : {}),
      ...(uiResponse.style.backgroundColor && !uiResponse.style.background ? { backgroundColor: uiResponse.style.backgroundColor } : {}),
      color: uiResponse.style.color,
      textDecoration: uiResponse.style.textDecoration,
      fontWeight: uiResponse.style.fontWeight,
      fontStyle: uiResponse.style.fontStyle,
      textAlign: uiResponse.style.textAlign,
      borderColor: uiResponse.style.borderColor,
      borderStyle: uiResponse.style.borderStyle
    } : {};

    return {
      text: text,
      ui: {
        type: uiResponse.type || 'container',
        content: uiResponse.content || text,
        style: filteredStyle,
        headings: uiResponse.headings ? {
          h1: uiResponse.headings.h1
        } : undefined,
        paragraphs: uiResponse.paragraphs ? {
          p: uiResponse.paragraphs.p
        } : undefined,
        buttons: uiResponse.buttons ? {
          button: {
            text: uiResponse.buttons.button?.text,
            href: uiResponse.buttons.button?.href,
            style: uiResponse.buttons.button?.style
          }
        } : undefined
      }
    };
  } catch (parseError) {
    console.warn('Failed to parse UI transformation, falling back to text-only:', parseError);
    return { text: responseText };
  }
};