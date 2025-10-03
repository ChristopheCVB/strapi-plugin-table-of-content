import type { PanelComponent } from '@strapi/content-manager/strapi-admin'
import type { Config } from '../../../server/src/config'

import { unstable_useContentManagerContext as useContentManagerContext, unstable_useDocumentLayout as useDocumentLayout } from '@strapi/strapi/admin'
import { Typography, Loader, Flex } from '@strapi/design-system'
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

  const componentToDisplayName = (component: DZComponent) => {
    const componentSettings = edit.components[component.__component].settings
    let displayName = componentSettings.displayName

    if (componentSettings.mainField !== 'documentId' && component[componentSettings.mainField]) {
      displayName = `${displayName} - ${component[componentSettings.mainField]}`
    }

    return displayName
  }

  const handleComponentClick = (dynamicZoneName: Config['contentTypes'][number]['dynamicZones'][number]['name'], componentIndex: number) => {
    console.log(`clicked on dynamic zone '${dynamicZoneName}' at component index ${componentIndex}`)
    // TODO: Implement the logic to handle the component click
    // Open the component in the editor and scroll to it
  }

  if (!isLoading && !contentType) {
    return null
  }

  return {
    title: 'Table of Content',
    content: isLoading ? (
      <Flex
        justifyContent="center"
        alignItems="center"
        direction="column"
        width="100%"
      >
        <Loader />
      </Flex>
    ) : contentType ? 
      contentType.dynamicZones.map((dynamicZone) => 
        <Flex
          key={`${PLUGIN_ID}_dynamic-zone_${dynamicZone.name}-container`}
          direction="column"
          gap={1}
          alignItems="flex-start"
          width="100%"
        >
          <Typography
            key={`${PLUGIN_ID}_dynamic-zone_${dynamicZone.name}-title`}
            style={{ textTransform: 'uppercase' }}
            tag="h3"
          >
            {dynamicZone.name}
          </Typography>
          <ol
            key={`${PLUGIN_ID}_dynamic-zone_${dynamicZone.name}-list`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {
              (form as any).values[dynamicZone.name].map((dzComponent: DZComponent, dzComponentIndex: number) => {
                return (
                  <li key={`${PLUGIN_ID}_dynamic-zone_${dynamicZone.name}_component_${dzComponent.__component}:${dzComponent.id}`}>
                    <Typography
                      onClick={() => props.activeTab !== 'published' && handleComponentClick(dynamicZone.name, dzComponentIndex)}
                      fontWeight="semiBold"
                      style={{
                        cursor: props.activeTab !== 'published' ? 'pointer' : 'unset',
                        paddingBlock: 2,
                        paddingInlineStart: 0 * 2,
                      }}
                    >
                      {componentToDisplayName(dzComponent)}
                    </Typography>
                  </li>
                )
              })
            }
          </ol>
        </Flex>,
      )
      : (
        <Typography>Error loading table of content</Typography>
      ),
  }
}

export { TableOfContentPanel }
