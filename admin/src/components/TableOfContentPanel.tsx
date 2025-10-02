import type { PanelComponent } from '@strapi/content-manager/strapi-admin'
import type { Config } from '../../../server/src/config'

import { unstable_useContentManagerContext as useContentManagerContext, unstable_useDocumentLayout as useDocumentLayout } from '@strapi/strapi/admin'
import { Button, Typography, Loader, Flex } from '@strapi/design-system'
import { getFetchClient } from '@strapi/strapi/admin'
import { useEffect, useState } from 'react'
import { PLUGIN_ID } from '../pluginId'

const TableOfContentPanel: PanelComponent = (props) => {
  const { get } = getFetchClient()

  const { form } = useContentManagerContext()
  const { edit } = useDocumentLayout(props.model)

  const [contentType, setContentType] = useState<Config['contentTypes'][number] | undefined>(undefined)

  console.log(props)
  console.log((form as any).values)
  console.log(edit)

  useEffect(() => {
    get<Config['contentTypes'][number]>(`/${PLUGIN_ID}/config/${props.model}`).then(({ data }) => {
      setContentType(data)
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
    content: !contentType ? (
      <Flex justifyContent="center" alignItems="center" direction="column" width="100%">
        <Loader />
      </Flex>
    ) : (
      <ol style={{ width: '100%'}}>
        { (form as any).values[contentType.targetDynamicZoneFieldName].map((dzComponent: any) => {
          return (
            <li key={`${dzComponent.__component}:${dzComponent.id}`}>
              { props.activeTab === 'published' ? (
                <Typography>
                  {valueToString(dzComponent.value)}
                </Typography>
              ) : (
                <Button size="S" variant="ghost">
                  {valueToString(dzComponent.value)}
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
