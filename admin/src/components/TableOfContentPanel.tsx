import type { PanelComponent } from '@strapi/content-manager/strapi-admin'

import { unstable_useContentManagerContext as useContentManagerContext } from '@strapi/strapi/admin'
import { Typography } from '@strapi/design-system'

const TableOfContentPanel: PanelComponent = (_props) => {
  const { form } = useContentManagerContext()

  return {
    title: 'Table of Content',
    content: (
      <ol style={{ width: '100%'}}>
        { Object.entries((form as any).values).map(([key, value]) => {
          return (
            <li key={key}>
              <Typography>
                {key}: {(value as any).toString()}
              </Typography>
            </li>
          )
        }) }
      </ol>
    ),
  }
}

export { TableOfContentPanel }
