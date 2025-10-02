import type { PanelComponent } from '@strapi/content-manager/strapi-admin'

import { unstable_useContentManagerContext as useContentManagerContext, unstable_useDocumentLayout as useDocumentLayout } from '@strapi/strapi/admin'
import { Button, Typography } from '@strapi/design-system'

const TableOfContentPanel: PanelComponent = (props) => {
  const { form } = useContentManagerContext()
  const { edit } = useDocumentLayout(props.model)

  console.log((form as any).values)
  console.log(edit)

  const valueToString = (value: unknown) => {
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return value?.toString()
  }

  return {
    title: 'Table of Content',
    content: (
      <ol style={{ width: '100%'}}>
        { Object.entries((form as any).values).map(([key, value]) => {
          return (
            <li key={key}>
              { props.activeTab === 'published' ? (
                <Typography>
                  {key}: {valueToString(value)}
                </Typography>
              ) : (
                <Button size="S" variant="ghost">
                  {key}: {valueToString(value)}
                </Button>
              )}
            </li>
          )
        }) }
      </ol>
    ),
  }
}

export { TableOfContentPanel }
