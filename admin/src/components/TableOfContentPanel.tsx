import type { PanelComponent } from '@strapi/content-manager/strapi-admin'

import { unstable_useContentManagerContext as useContentManagerContext } from '@strapi/content-manager/strapi-admin'

const TableOfContentPanel: PanelComponent = (_props) => {

  const { form } = useContentManagerContext()

  return {
    title: 'Table of Content',
    content: (
      <div>
        {JSON.stringify(form)}
      </div>
    ),
  }
}

export { TableOfContentPanel }
