import { UtmConfig } from '../types/index';
import React from 'react';

/**
 * Gets UTM parameters from the current URL
 * @returns {UtmConfig} Object containing UTM parameters
 */
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

/**
 * Sets up UTM parameter change listener and returns the current UTM config
 * @returns {[UtmConfig, () => void]} Tuple containing current UTM config and cleanup function
 */
export function useUtmConfig(): [UtmConfig, () => void] {
  const [utmConfig, setUtmConfig] = React.useState<UtmConfig>(getUtmParams());

  React.useEffect(() => {
    const handleUrlChange = () => {
      const newUtmConfig = getUtmParams();
      setUtmConfig(newUtmConfig);
    };

    // Initial load
    handleUrlChange();

    // Listen for URL changes
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('load', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('load', handleUrlChange);
    };
  }, []);

  return [utmConfig, () => {}];
}

/**
 * Merges provided UTM config with URL UTM parameters
 * @param {UtmConfig} propUtmConfig - Provided UTM configuration
 * @returns {UtmConfig} Merged UTM configuration
 */
export function mergeUtmConfig(propUtmConfig: UtmConfig = {}): UtmConfig {
  const urlUtmParams = getUtmParams();
  return {
    ...propUtmConfig,
    ...urlUtmParams
  };
} 