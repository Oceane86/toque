import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    // Liste des langues supportées
    locales: ['fr', 'en-US', 'nl-NL'],
    // Langue par défaut
    defaultLocale: 'fr',
  },
  webpack: (config) => {
    config.plugins.push(new NodePolyfillPlugin());

    config.resolve.fallback = {
      ...config.resolve.fallback, 
      crypto: 'crypto-browserify',
      stream: 'readable-stream',
    };

    return config;
  },
};

export default nextConfig;
