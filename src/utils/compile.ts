import { getApiClient } from './api';
import { renderToHtml } from './renderToHtml';
import React from 'react';

export interface CompileOptions {
  jsxContent?: React.ReactElement; // Accept JSX content
  htmlContent?: string;  // Optional plain HTML content
  customTailwindConfig?: string;
  customCSS?: string;
}

export const compileHtml = async (options: CompileOptions) => {
  const { jsxContent, htmlContent, customTailwindConfig, customCSS } = options;

  // Render JSX to HTML if provided
  const content = jsxContent ? renderToHtml(jsxContent) : htmlContent;

  const client = getApiClient();
  const response = await client.post('/generate-pdf', {
    htmlContent: content,
    customTailwindConfig,
    customCSS,
  }, {
    responseType: 'arraybuffer',  // Handle binary data
  });

  // Create a Blob from the PDF data
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);

  // Create a link element and trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'document.pdf');
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url); // Clean up the URL

  return response.data;
};