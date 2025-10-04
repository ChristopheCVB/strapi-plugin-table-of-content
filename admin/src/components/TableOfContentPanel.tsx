import type { PanelComponent } from '@strapi/content-manager/strapi-admin'
import type { Config } from '../../../server/src/config'

import { FetchError, unstable_useContentManagerContext as useContentManagerContext, unstable_useDocumentLayout as useDocumentLayout } from '@strapi/strapi/admin'
import { Typography, Loader, Flex, Button } from '@strapi/design-system'
import { getFetchClient } from '@strapi/strapi/admin'
import { useEffect, useState } from 'react'
import { PLUGIN_ID } from '../pluginId'

type DZComponent = {
  __component: string
  id: number
} & Record<string, unknown>

const TableOfContentPanel: PanelComponent = (props) => {
  const { get } = getFetchClient()

  const { form } = useContentManagerContext()
  const { edit } = useDocumentLayout(props.model)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { values: formValues } = form as any

  const [isLoading, setIsLoading] = useState(true)
  const [retry, setRetry] = useState(0)
  const [contentType, setContentType] = useState<Config['contentTypes'][number] | undefined | null>(undefined) // undefined means the content type is not found, null means there was an error

  console.log('props', props)
  console.log('form.values', formValues)
  console.log('edit', edit)

  useEffect(() => {
    setIsLoading(true)
    get<Config['contentTypes'][number]>(`/${PLUGIN_ID}/config/${props.model}`).then(({ data }) => {
      setContentType(data)
    }).catch((error) => {
      if (error instanceof FetchError && error.code === 404) {
        setContentType(undefined)
      } else {
        setContentType(null)
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }, [retry])

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
    alert(`clicked on dynamic zone '${dynamicZoneName}' at component index ${componentIndex}`)
    // TODO: Implement the logic to handle the component click
    // Open the component in the editor and scroll to it
  }

  const getComponentLevel = (componentName: string, dynamicZone: Config['contentTypes'][number]['dynamicZones'][number]) => {
    if (!dynamicZone.components) {
      return 0
    }
    const component = dynamicZone.components.find(comp => comp.name === componentName)
    return component ? component.level : 0
  }

  const getParentLevel = (currentIndex: number, dynamicZone: Config['contentTypes'][number]['dynamicZones'][number]) => {
    if (currentIndex === 0) {
      return 0
    }
    
    const components = formValues[dynamicZone.name]
    const currentComponentLevel = getComponentLevel(components[currentIndex].__component, dynamicZone)
    
    // Find the most recent component with a higher level
    for (let i = currentIndex - 1; i >= 0; i--) {
      const componentLevel = getComponentLevel(components[i].__component, dynamicZone)
      
      // If we find a component with higher level, use it as parent
      if (componentLevel > currentComponentLevel) {
        return componentLevel
      }
    }
    
    return 0
  }

  if (!isLoading && contentType === undefined) {
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
      contentType.dynamicZones.map((dynamicZone) => {
        return !formValues[dynamicZone.name] || formValues[dynamicZone.name].length === 0 ? null : (
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
                formValues[dynamicZone.name].map((dzComponent: DZComponent, dzComponentIndex: number) => {
                // Get the parent level (most recent component with higher level)
                  const parentLevel = getParentLevel(dzComponentIndex, dynamicZone)
                
                  return (
                    <li key={`${PLUGIN_ID}_dynamic-zone_${dynamicZone.name}_component_${dzComponent.__component}[${dzComponent.id}]`}>
                      <Typography
                        onClick={() => props.activeTab !== 'published' && handleComponentClick(dynamicZone.name, dzComponentIndex)}
                        fontWeight="semiBold"
                        style={{
                          cursor: props.activeTab !== 'published' ? 'pointer' : 'unset',
                          paddingBlock: 2,
                          paddingInlineStart: parentLevel * 16,
                        }}
                      >
                        {componentToDisplayName(dzComponent)}
                      </Typography>
                    </li>
                  )
                })
              }
            </ol>
          </Flex>
        )
      },
      )
      : (
        <Flex
          direction="column"
          alignItems="stretch"
          gap={1}
        >
          <Typography>Error loading table of content</Typography>
          <Button onClick={() => setRetry(retry + 1)} variant='tertiary'>Retry</Button>
        </Flex>
      ),
  }
}

export { TableOfContentPanel }
