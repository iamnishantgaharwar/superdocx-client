declare module 'superdocx-client' {
    export interface ApiClientConfig {
      baseURL: string;
      apiKey: string;
    }
  
    export function createApiClient(config: ApiClientConfig): void;
    export function getApiClient(): any;
  
    export interface CompileOptions {
      jsxContent?: React.ReactElement;  // JSX content
      htmlContent?: string;  // Optional HTML content
      customTailwindConfig?: string;
      customCSS?: string;
    }
  
    export function compileHtml(options: CompileOptions): Promise<any>;
  
    import { FC } from 'react';
    export const PageBreak: FC;
  }