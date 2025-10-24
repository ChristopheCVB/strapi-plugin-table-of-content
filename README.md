<div align="center" width="150px">
  <img style="width: 150px; height: auto;" src="assets/logo.png" alt="Logo - Strapi Plugin Table of Content" />
</div>
<div align="center">
  <h1>Strapi v5 - Plugin Table of Content</h1>
  <p>Strapi Plugin that displays a table of content for your content types</p>
  <a href="https://www.npmjs.org/package/strapi-plugin-table-of-content">
    <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/ChristopheCVB/strapi-plugin-table-of-content?label=npm&logo=npm">
  </a>
  <a href="https://www.npmjs.org/package/strapi-plugin-table-of-content">
    <img src="https://img.shields.io/npm/dm/strapi-plugin-table-of-content.svg" alt="Monthly download on NPM" />
  </a>
</div>

---

<div style="margin: 20px 0" align="center">
  <img style="width: 100%; height: auto;" src="assets/preview.png" alt="UI preview" />
</div>

A plugin for [Strapi Headless CMS](https://github.com/strapi/strapi) that displays a table of content for your content types

## Features
- Display a table of content for your content types

## Usage

To configure the **Table of Content** plugin, add your configuration to the plugin settings. The configuration consist of an object with the content types:

```typescript
type Config = {
  contentTypes: Array<{
    uid: string
    fields: Array<
      {
        type: 'primitive'
        displayLabel: boolean
      } | {
        type: 'dynamiczone'
        displayLabel: boolean
        components: Array<{
          name: string
          level: number
          displayIcon: boolean
        }>
      } | {
        type: 'separator'
      }
    >
  }>
}
```

### Example Configuration

```typescript
// config/plugins.ts
import type { Config as TableOfContentConfig } from 'strapi-plugin-table-of-content/dist/server/src/config'

import packageJson from '../package.json'

export default () => ({
  'table-of-content': {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: 'api::page.page',
          fields: [
            {
              type: 'primitive',
              name: 'title',
              displayLabel: true,
            },
            {
              type: 'separator',
            },
            {
              type: 'dynamiczone',
              name: 'content',
              displayLabel: true,
              components: [
                { name: 'content.title', level: { field: 'level' } },
                { name: 'content.rich-text', level: 0 },
              ],
            },
            {
              type: 'separator',
            },
            {
              type: 'dynamiczone',
              name: 'extraContent',
              components: [
                { name: 'content.title', level: { field: 'level' } },
                { name: 'content.rich-text', level: 0 },
              ],
            },
          ],
        },
      ],
    } satisfies TableOfContentConfig,
  }
})
```
