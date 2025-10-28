import type { PanelComponentProps } from '@strapi/content-manager/strapi-admin'
import type { Config } from '../../../server/src/config'

import { useEffect, useState } from 'react'
import { unstable_useContentManagerContext as useContentManagerContext, unstable_useDocumentLayout as useDocumentLayout } from '@strapi/strapi/admin'
import { Typography, Flex } from '@strapi/design-system'
import * as Icons from '@strapi/icons'

import { PLUGIN_ID } from '../pluginId'
import { ComponentIcons, getEditLayoutItemLabel } from '../utils'

type DZComponent = {
  __component: string
  id: number
} & Record<string, unknown>

interface DZComponentWithLevel {
  component: DZComponent
  level: number | null
}

type DynamicZoneSectionProps = Pick<PanelComponentProps, 'model'> & {
  field: Config['contentTypes'][number]['fields'][number]
}

const DynamicZoneSection: React.FC<DynamicZoneSectionProps> = ({
  field,
  model,
}) => {
  const { edit } = useDocumentLayout(model)
  const { form } = useContentManagerContext()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { values: formValues } = form as any

  const [componentsWithLevel, setComponentsWithLevel] = useState<DZComponentWithLevel[]>([])

  useEffect(() => {
    if (field.type !== 'dynamiczone' || !formValues[field.name] || (formValues[field.name] as DZComponent[]).length === 0) {
      return
    }

    const localComponentsWithLevel: DZComponentWithLevel[] = []
    let currentLevel = 0
    let nextLevel = 0
    for (const component of formValues[field.name] as DZComponent[]) {
      const componentLevel = getComponentConfigLevel(component, field)

      if (componentLevel === null) {
        localComponentsWithLevel.push({ component, level: null })
        continue
      }

      if (componentLevel > currentLevel) {
        nextLevel = currentLevel + 1
      } else if (componentLevel < currentLevel && componentLevel !== 0) {
        currentLevel = componentLevel === 1 ? 0 : currentLevel - componentLevel
        nextLevel = currentLevel + 1
      } else if (componentLevel > 0 && componentLevel === currentLevel) {
        currentLevel = currentLevel - 1
        nextLevel = currentLevel + 1
      }
      
      localComponentsWithLevel.push({ component, level: currentLevel })
      currentLevel = nextLevel
    }
    setComponentsWithLevel(localComponentsWithLevel)
  }, [formValues, field])

  // Early return if field is not a dynamic zone or has no components
  if (field.type !== 'dynamiczone' || !formValues[field.name] || (formValues[field.name] as DZComponent[]).length === 0) {
    return null
  }

  const componentToDisplayName = (component: DZComponent) => {
    const componentSettings = edit.components[component.__component].settings
    let displayName = componentSettings.displayName

    if (
      componentSettings.mainField !== 'documentId' &&
      component[componentSettings.mainField] &&
      typeof component[componentSettings.mainField] === 'string' &&
      (component[componentSettings.mainField] as string).trim()
    ) {
      displayName = `${displayName} - ${component[componentSettings.mainField]}`
    }

    return displayName
  }

  const componentToIcon = (component: DZComponent) => {
    const componentSettings = edit.components[component.__component].settings
    const displayIcon = field.components?.find(comp => comp.name === component.__component)?.displayIcon ?? true

    if (!displayIcon) {
      return null
    }

    const iconName = componentSettings.icon
    if (!iconName) {
      return null
    }

    return Icons[ComponentIcons[iconName]]
  }

  const getComponentConfigLevel = (component: DZComponent, field: Config['contentTypes'][number]['fields'][number]) => {
    if (field.type !== 'dynamiczone' || !field.components) {
      return 0
    }

    const componentConfig = field.components.find(comp => comp.name === component.__component)
    if (!componentConfig) {
      return 0
    }
    
    if (componentConfig.level === null) {
      return null
    }

    if (typeof componentConfig.level === 'number') {
      return componentConfig.level
    }

    return parseInt(component[componentConfig.level.field] as string) || 0
  }

  const handleComponentClick = (fieldName: string, componentIndex: number) => {
    // ⚠️ Heavily depends on the Strapi admin UI structure

    // Select all dynamic zone headers
    const dynamiczoneHeaders = document.querySelectorAll<HTMLDivElement>('div:has(+ span + span + ol)')

    for (const dynamiczoneHeader of dynamiczoneHeaders) {
      // Get the dynamic zone header title
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - @strapi/sdk-plugin uses an old typescript version
      const dynamiczoneHeaderTitle = dynamiczoneHeader.querySelector<HTMLSpanElement>('span:first-child')?.textContent.trim()

      // If the dynamic zone header title matches the field name
      if (getEditLayoutItemLabel(edit, fieldName) === dynamiczoneHeaderTitle) {
        // Full selector: `ol > li:nth-child(${componentIndex + 1}) > div:nth-child(2) > div > div > h3 > button` that we simplify to be hopefully more future-proof
        // Get the button element for the component
        const buttonElement = dynamiczoneHeader.parentElement!.querySelector<HTMLButtonElement>(`ol > li:nth-child(${componentIndex + 1}) h3 > button`)
        if (buttonElement) {
          if (buttonElement.dataset.state === 'closed') { // If the component is closed, open it
            buttonElement.click()
          }
          buttonElement.scrollIntoView({ behavior: 'smooth', block: 'start' }) // Scroll to the component
        }

        break
      }
    }
  }

  return (
    <Flex
      key={`${PLUGIN_ID}_field_${field.name}-container`}
      direction="column"
      gap={1}
      alignItems="start"
      width="100%"
    >
      {field.displayLabel && (
        <Typography
          key={`${PLUGIN_ID}_field_${field.name}-title`}
          style={{ textTransform: 'uppercase' }}
          tag="h3"
        >
          {getEditLayoutItemLabel(edit, field.name)}
        </Typography>
      )}
      <ol
        key={`${PLUGIN_ID}_field_${field.name}-list`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          width: '100%',
        }}
      >
        {componentsWithLevel.map(({ component, level }, componentIndex) => {
          if (level === null) {
            return null
          }
          const Icon = componentToIcon(component)
          return (
            <li
              key={`${PLUGIN_ID}_field_${field.name}_component_${component.__component}[${component.id}]`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                paddingInlineStart: level * 16,
                paddingBlock: 2,
                cursor: 'pointer',
              }}
              onClick={() => handleComponentClick(field.name, componentIndex)}
            >
              {Icon && <Icon style={{ flexShrink: 0 }} />}
              <Typography
                fontWeight="semiBold"
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {componentToDisplayName(component)}
              </Typography>
            </li>
          )
        })}
      </ol>
    </Flex>
  )
}

export { DynamicZoneSection }
export type { DynamicZoneSectionProps, DZComponent }
