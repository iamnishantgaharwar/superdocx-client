import React from 'react';
import ReactDOMServer from 'react-dom/server';

export const renderToHtml = (jsx: React.ReactElement): string => {
  return ReactDOMServer.renderToStaticMarkup(jsx);
};