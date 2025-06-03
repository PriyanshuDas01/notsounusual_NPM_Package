import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { UnseenContext } from '../context/UnseenContext';
import type { TransformResponse } from '../types';

export interface UnseenProps {
  children: React.ReactNode;
  transformUI?: boolean;
  componentId?: string;
  componentName?: string;
}

// Cache for storing transformation results
const transformationCache = new Map<string, TransformResponse>();

export const Unseen: React.FC<UnseenProps> = ({ 
  children, 
  transformUI = false,
  componentId,
  componentName 
}) => {
  const context = useContext(UnseenContext);
  const [response, setResponse] = useState<TransformResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasTransformed = useRef(false);
  const childrenRef = useRef(children);

  const transformedElement = useMemo(() => {
    if (!response || !response.ui) {
      return children;
    }

    const cloneElement = (element: React.ReactElement, depth = 0): React.ReactElement => {
      const ui = response.ui as {
        type: 'container' | 'text' | 'button' | 'link' | 'card';
        content: React.ReactNode;
        style?: React.CSSProperties;
        className?: string;
        elements?: {
          [key: string]: {
            text?: string;
            href?: string;
            style?: React.CSSProperties & {
              hover?: React.CSSProperties;
            };
          };
        };
      };

      // Check if this element should be transformed
      const elementId = element.props.id;
      const elementClassName = element.props.className;
      const elementKey = elementId || elementClassName;

      console.log('Processing element:', {
        depth,
        elementId,
        elementClassName,
        elementKey,
        elementType: element.type,
        availableElements: ui.elements,
        currentChildren: element.props.children
      });
      
      // First, recursively transform children
      let transformedChildren = element.props.children;
      if (element.props.children) {
        transformedChildren = React.Children.map(element.props.children, child => {
          if (React.isValidElement(child)) {
            return cloneElement(child, depth + 1);
          }
          return child;
        });
      }

      // Then check if this element itself should be transformed
      if (!elementKey || !ui.elements?.[elementKey]) {
        return React.cloneElement(element, {}, transformedChildren);
      }

      const elementConfig = ui.elements[elementKey];
      const { hover, ...styles } = elementConfig.style || {};

      console.log('Applying changes to element:', elementKey, {
        depth,
        text: elementConfig.text,
        styles,
        hover,
        currentProps: element.props,
        elementConfig
      });

      // Create a new element with the transformed styles and text
      const newElement = React.cloneElement(element, {
        ...element.props,
        children: elementConfig.text || transformedChildren,
        href: elementConfig.href || element.props.href,
        style: {
          ...element.props.style,
          ...styles,
          transition: 'all 0.3s ease' // Ensure smooth transitions
        }
      });

      console.log('Created new element:', {
        depth,
        elementKey,
        newChildren: newElement.props.children,
        newStyle: newElement.props.style
      });

      // If there's a hover effect, add it using CSS
      if (hover) {
        const hoverStyles = Object.entries(hover)
          .map(([key, value]) => `${key}: ${value} !important;`)
          .join(' ');
        
        const styleId = `hover-${elementKey}`;
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = `
          #${elementId}:hover, .${elementClassName}:hover {
            ${hoverStyles}
            transition: all 0.3s ease !important;
          }
        `;
        
        // Remove any existing style element
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
          existingStyle.remove();
        }
        
        document.head.appendChild(styleElement);
        console.log('Added hover styles:', {
          depth,
          elementKey,
          hoverStyles
        });
      }

      return newElement;
    };

    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return cloneElement(child);
      }
      return child;
    });
  }, [response, children, componentId, componentName]);

  useEffect(() => {
    if (!transformUI || hasTransformed.current || !context) {
      setIsLoading(false);
      console.log('Skipping transformation:', {
        transformUI,
        hasTransformed: hasTransformed.current,
        hasContext: !!context
      });
      return;
    }

    console.log('Starting transformation with context:', {
      useGemini: context.useGemini,
      hasCustomPrompt: !!context.customPrompt,
      utmConfig: {
        source: context.utmConfig?.source,
        campaign: context.utmConfig?.campaign,
        medium: context.utmConfig?.medium,
        term: context.utmConfig?.term,
        content: context.utmConfig?.content
      }
    });

    const transformContent = async () => {
      try {
        setIsLoading(true);
        // Create a cache key based on UTM config and content
        const cacheKey = JSON.stringify({
          utmConfig: {
            source: context.utmConfig?.source,
            campaign: context.utmConfig?.campaign,
            medium: context.utmConfig?.medium,
            term: context.utmConfig?.term,
            content: context.utmConfig?.content
          },
          contentId: componentId || componentName || 'default'
        });

        // Check if we have a cached result
        const cachedResult = transformationCache.get(cacheKey);
        if (cachedResult) {
          console.log('Using cached transformation result');
          hasTransformed.current = true;
          setResponse(cachedResult);
          setIsLoading(false);
          return;
        }

        console.log('Calling transformText with children');
        const result = await context.transformText(children, transformUI);
        console.log('Transform result received');
        
        if (result && result.ui) {
          hasTransformed.current = true;
          setResponse(result);
          // Cache the result
          transformationCache.set(cacheKey, result);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Transformation error:', error);
        setIsLoading(false);
      }
    };

    transformContent();
  }, [context, transformUI, children]);

  // Clear cache when UTM config changes
  useEffect(() => {
    if (context?.utmConfig) {
      console.log('UTM config changed, clearing cache');
      transformationCache.clear();
      hasTransformed.current = false;
      setIsLoading(true);
    }
  }, [context?.utmConfig]);

  useEffect(() => {
    console.log('transformUI changed:', transformUI);
    hasTransformed.current = false;
  }, [transformUI]);

  if (isLoading) {
    return null; // Hide component while loading
  }

  return <>{transformedElement}</>;
}; 