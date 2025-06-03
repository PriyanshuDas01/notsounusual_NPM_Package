import { ReactNode } from 'react';

export interface ThemeConfig {
  color?: string;
  typography?: {
    fontFamily?: string;
    fontSize?: string;
  };
  spacing?: {
    padding?: string;
    margin?: string;
  };
  borderRadius?: string;
  shadow?: string;
}

export interface UtmConfig {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export interface UserInfo {
  browser?: {
    deviceType?: string;
    platform?: string;
    language?: string;
    screenResolution?: string;
  };
  session?: {
    entryPage?: string;
    referrer?: string;
  };
  timezone?: string;
}

export interface UIResponse {
  type: 'container' | 'text' | 'button' | 'link' | 'card';
  content: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  headings?: {
    h1?: string;
    [key: string]: string | undefined;
  };
  paragraphs?: {
    p?: string | {
      text: string;
      style?: React.CSSProperties;
    };
    [key: string]: string | {
      text: string;
      style?: React.CSSProperties;
    } | undefined;
  };
  buttons?: {
    button?: {
      text: string;
      href?: string;
      style?: React.CSSProperties;
    };
    [key: string]: {
      text: string;
      href?: string;
      style?: React.CSSProperties;
    } | undefined;
  };
}

export interface TransformResponse {
  text: string;
  ui?: UIResponse;
}

export interface UnseenProps {
  children: ReactNode;
  transformType?: 'text' | 'ui';
  componentType?: string;
  style?: React.CSSProperties;
  transformUI?: boolean;
  componentId?: string;
  componentName?: string;
  [key: string]: any;
}

export type UnseenContextType = {
  transformText: (text: string | ReactNode, transformUI?: boolean) => Promise<TransformResponse>;
  theme: ThemeConfig;
  utmConfig: UtmConfig;
  userInfo: UserInfo;
  isInitialized: boolean;
  useGemini: boolean;
  geminiApiKey: string | null;
  customPrompt?: string;
};

export interface UnseenProviderProps {
  children: ReactNode;
  theme?: ThemeConfig;
  utmConfig?: UtmConfig;
  userInfo?: UserInfo;
  useGemini?: boolean;
  geminiApiKey?: string | null;
  apiKey?: string;
  customPrompt?: string;
} 