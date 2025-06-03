import { ReactNode, CSSProperties } from 'react';

export interface UnseenProviderProps {
  apiKey: string;
  geminiApiKey?: string;
  useGemini?: boolean;
  customPrompt?: string;
  utmConfig?: UtmConfig;
  themeConfig?: ThemeConfig;
  children: ReactNode;
}

export interface UnseenProps {
  children: string | ReactNode;
  style?: CSSProperties;
  transformType?: 'text' | 'ui';
  componentType?: 'text' | 'button' | 'card' | 'link' | 'container';
  transformUI?: boolean;
  className?: string;
}

export interface UtmConfig {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface ThemeConfig {
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

export interface TransformResponse {
  text?: string;
  ui?: {
    type: 'text' | 'button' | 'card' | 'link' | 'container';
    content: string | ReactNode;
    style?: CSSProperties;
    className?: string;
  };
  error?: string;
}

export interface UserInfo {
  browser?: {
    name: string;
    language: string;
    platform: string;
    screenResolution: string;
    deviceType: 'mobile' | 'desktop' | 'tablet';
  };
  session?: {
    startTime: string;
    referrer: string;
    entryPage: string;
  };
  timezone?: string;
} 