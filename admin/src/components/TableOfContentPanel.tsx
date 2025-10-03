import type { PanelComponent } from '@strapi/content-manager/strapi-admin'
import type { Config } from '../../../server/src/config'

import { unstable_useContentManagerContext as useContentManagerContext, unstable_useDocumentLayout as useDocumentLayout } from '@strapi/strapi/admin'
import { Button, Typography, Loader, Flex } from '@strapi/design-system'
import { getFetchClient } from '@strapi/strapi/admin'
import { useEffect, useState } from 'react'
import { PLUGIN_ID } from '../pluginId'

type DZComponent = {
  __component: string
  id: string
} & Record<string, unknown>

const TableOfContentPanel: PanelComponent = (props) => {
  const { get } = getFetchClient()

  const { form } = useContentManagerContext()
  const { edit } = useDocumentLayout(props.model)

  const [isLoading, setIsLoading] = useState(true)
  const [contentType, setContentType] = useState<Config['contentTypes'][number] | undefined>(undefined)

  console.log(props)
  console.log((form as any).values)
  console.log(edit)

  useEffect(() => {
    setIsLoading(true)
    get<Config['contentTypes'][number]>(`/${PLUGIN_ID}/config/${props.model}`).then(({ data }) => {
      setContentType(data)
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch contentType:', error)
      setContentType(undefined)
    }).finally(() => {
      setIsLoading(false)
    })
  }, [])

  const valueToString = (value: unknown) => {
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return value?.toString()
  }

  const handleComponentClick = (dynamicZoneName: Config['contentTypes'][number]['dynamicZones'][number]['name'], componentIndex: number) => {
    console.log(`clicked on dynamic zone '${dynamicZoneName}' at component index ${componentIndex}`)
  }

  if (!isLoading && !contentType) {
    return null
  }

  return {
    title: 'Table of Content',
    content: isLoading ? (
      <Flex justifyContent="center" alignItems="center" direction="column" width="100%">
        <Loader />
      </Flex>
    ) : contentType ? 
      contentType.dynamicZones.map((dynamicZone) => 
        <Flex key={`toc_dynamic-zone_${dynamicZone.name}-container`} direction="column" gap={1} alignItems="flex-start" width="100%">
          <Typography key={`toc_dynamic-zone_${dynamicZone.name}-title`} style={{ textTransform: 'uppercase' }} tag="h3">{dynamicZone.name}</Typography>
          <ol key={`toc_dynamic-zone_${dynamicZone.name}-list`}>
            { (form as any).values[dynamicZone.name].map((dzComponent: DZComponent, dzComponentIndex: number) => {
              return (
                <li key={`toc_${dynamicZone.name}_component_${dzComponent.__component}:${dzComponent.id}`}>
                  { props.activeTab === 'published' ? (
                    <Typography>
                      {dzComponent.__component} - {valueToString(dzComponent.value)}
                    </Typography>
                  ) : (
                    <Button size="S" variant="ghost" onClick={() => handleComponentClick(dynamicZone.name, dzComponentIndex)}>
                      {dzComponent.__component} - {valueToString(dzComponent.value)}
                    </Button>
                  )}
                </li>
              )
            }) }
          </ol>
        </Flex>,
      )
      : (
        <Typography>Error loading table of content</Typography>
      ),
  }
}

export { TableOfContentPanel }
