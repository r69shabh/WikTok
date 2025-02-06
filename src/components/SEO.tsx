import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, image }) => (
  <Helmet>
    <title>{title} | WikTok</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {image && <meta property="og:image" content={image} />}
  </Helmet>
);