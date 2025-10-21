/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

export {};

// Specific declaration for the main.scss file
declare module '@/styles/main.scss';

declare global {
  interface Window {
    Prism?: {
      plugins?: {
        NormalizeWhitespace?: {
          setDefaults: (opts: Record<string, any>) => void;
        };
      };
      highlightAll?: () => void;
    };
  }

  interface ISecurityProps {
    identifier: string;
    userName?: string;
  }
}
