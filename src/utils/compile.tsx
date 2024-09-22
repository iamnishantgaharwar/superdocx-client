import { getApiClient } from './api';
import { renderToHtml } from './renderToHtml';
import React from 'react';

export interface CompileOptions {
  jsxContent?: React.ReactElement; 
  htmlContent?: string; 
  customTailwindConfig?: string; 
  customCSS?: string; 
}

export const compileHtml = async (options: CompileOptions) => {
  const { jsxContent, htmlContent, customTailwindConfig, customCSS } = options;

  // Convert JSX to HTML if jsxContent is provided
  let html: string = '';
  if (jsxContent) {
    html = renderToHtml(jsxContent); 
  } else if (htmlContent) {
    html = htmlContent;
  } else {
    throw new Error('Either jsxContent or htmlContent is required');
  }

  // Apply custom Tailwind CSS configuration and styles
  if (customTailwindConfig || customCSS) {
    html = `
      <style>${customCSS || ''}</style>
      ${html}
    `;
  }

  // Convert img tags to base64
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const imgTags = doc.getElementsByTagName('img');

  for (const img of imgTags) {
    const src = img.getAttribute('src');
    if (src) {
      try {
        const isUrl = src.startsWith('http');
        const response = await fetch(isUrl ? src : `${window.location.origin}/${src}`);
        const blob = await response.blob();
        const base64String = await convertBlobToBase64(blob);
        if (base64String && typeof base64String === 'string') {
          img.setAttribute('src', base64String);
        } else {
          console.error('Invalid base64 string');
        }
      } catch (error) {
        console.error(`Error converting image to base64: ${error}`);
      }
    }
  }

  // Update the HTML content with base64 encoded images
  html = doc.documentElement.outerHTML;

  // Send the processed HTML content to the backend for PDF generation
  const client = getApiClient();
  const response = await client.post(
    '/generate-pdf',
    {
      htmlContent: html,
      customTailwindConfig,
      customCSS,
    },
    {
      responseType: 'arraybuffer', 
    }
  );

  // Create a Blob from the PDF data
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);

  // Create a link element and trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'document.pdf');
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url); 

  return response.data;
};

// Helper function to convert blob to base64
const convertBlobToBase64 = async (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Invalid result type'));
      }
    };
    reader.onerror = reject;
  });
};