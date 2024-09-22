declare module 'superdocx-client' {
  import { FC, ImgHTMLAttributes, ReactElement } from 'react';

  export interface ApiClientConfig {
    baseURL: string;
    apiKey: string;
  }

  export function createApiClient(config: ApiClientConfig): void;
  export function getApiClient(): any;

  export interface CompileOptions {
    jsxContent?: ReactElement;  // JSX content
    htmlContent?: string;  // Optional HTML content
    customTailwindConfig?: string;
    customCSS?: string;
    autoDownload?: boolean;  // New autoDownload option
  }

  export const PageBreak: FC;
  export function compileHtml(options: CompileOptions): Promise<any>;
}
