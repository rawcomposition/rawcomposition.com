// @ts-check

import { fileURLToPath } from 'url';
import { resolve } from 'path';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://rawcomposition.com',
  integrations: [mdx(), sitemap(), preact()],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  },

  adapter: vercel(),
});