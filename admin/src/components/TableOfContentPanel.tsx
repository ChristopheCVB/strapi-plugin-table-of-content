import type { PanelComponent } from '@strapi/content-manager/strapi-admin'
import type { Config } from '../../../server/src/config'

import { unstable_useContentManagerContext as useContentManagerContext, unstable_useDocumentLayout as useDocumentLayout } from '@strapi/strapi/admin'
import { Button, Typography } from '@strapi/design-system'
import { getFetchClient } from '@strapi/strapi/admin'
import { useEffect, useState } from 'react'
import { PLUGIN_ID } from '../pluginId'

const TableOfContentPanel: PanelComponent = (props) => {
  const { get } = getFetchClient()

  const { form } = useContentManagerContext()
  const { edit } = useDocumentLayout(props.model)

  const [_contentType, setContentType] = useState<Config['contentTypes'][number] | undefined>(undefined)

  console.log(props)
  console.log((form as any).values)
  console.log(edit)

  useEffect(() => {
    get<{ version: Config['contentTypes'][number] }>(`/${PLUGIN_ID}/config/${props.model}`).then(({ data }) => {
      setContentType(data.version)
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch contentType:', error)
      setContentType(undefined)
    })
  }, [])

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
