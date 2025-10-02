import type { StrapiApp } from '@strapi/strapi/admin'

import { TableOfContentPanel } from './components/TableOfContentPanel'

export default {
  register() {},

  bootstrap(app: StrapiApp) {
    // Add toc in editViewPanel
    // @ts-expect-error too few description type in strapi
    app.getPlugin('content-manager').apis.addEditViewSidePanel([TableOfContentPanel])
  },

  registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`)

          return { data, locale }
        } catch {
          return { data: {}, locale }
        }
      }),
    )
  },
}
