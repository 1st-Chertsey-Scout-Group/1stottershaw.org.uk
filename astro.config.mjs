// @ts-check
import { defineConfig, envField } from 'astro/config';
import { basecampIntegrations } from 'basecamp';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true
  },

  integrations: [...basecampIntegrations()],

  output: "server",
  adapter: node({
    mode: 'standalone'
  }),

  env: {
    schema: {
      GOOGLE_MAPS_API_KEY: envField.string({ context: "client", access: "public" }),

      SMTP_HOST: envField.string({ context: "server", access: "public" }),
      SMTP_PORT: envField.number({ context: "server", access: "public" }),

      SMTP_DOMAIN: envField.string({ context: "server", access: "public" }),
      SMTP_ALIAS: envField.string({ context: "server", access: "public" }),
      SMTP_PASSWORD: envField.string({ context: "server", access: "secret" }),
    }
  }
});