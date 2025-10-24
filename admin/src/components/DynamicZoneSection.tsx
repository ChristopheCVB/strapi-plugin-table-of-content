import type { EditViewContext, PanelComponentProps } from '@strapi/content-manager/strapi-admin'
import type { Config } from '../../../server/src/config'

import { useEffect, useState } from 'react'
import { unstable_useContentManagerContext as useContentManagerContext, unstable_useDocumentLayout as useDocumentLayout } from '@strapi/strapi/admin'
import { Typography, Flex } from '@strapi/design-system'
import * as Icons from '@strapi/icons'

import { PLUGIN_ID } from '../pluginId'
import { getEditLayoutItemLabel } from '../utils'

type DZComponent = {
  __component: string
  id: number
} & Record<string, unknown>

interface DZComponentWithLevel {
  component: DZComponent
  level: number
}

type DynamicZoneSectionProps = Pick<EditViewContext, 'activeTab'> & Pick<PanelComponentProps, 'model'> & {
  field: Config['contentTypes'][number]['fields'][number]
}

const DynamicZoneSection: React.FC<DynamicZoneSectionProps> = ({
  field,
  activeTab,
  model,
}) => {
  const { edit } = useDocumentLayout(model)
  const { form } = useContentManagerContext()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { values: formValues } = form as any

  // Early return if field is not a dynamic zone or has no components
  if (field.type !== 'dynamiczone' || !formValues[field.name] || (formValues[field.name] as DZComponent[]).length === 0) {
    return null
  }

  const [componentsWithLevel, setComponentsWithLevel] = useState<DZComponentWithLevel[]>([])

  useEffect(() => {
    const localComponentsWithLevel: DZComponentWithLevel[] = []
    let currentLevel = 0
    let nextLevel = 0
    for (const component of formValues[field.name] as DZComponent[]) {
      const componentLevel = getComponentConfigLevel(component, field)
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

  const componentToDisplayName = (component: DZComponent) => {
    const componentSettings = edit.components[component.__component].settings
    let displayName = componentSettings.displayName

    if (componentSettings.mainField !== 'documentId' && component[componentSettings.mainField]) {
      displayName = `${displayName} - ${component[componentSettings.mainField]}`
    }

    return displayName
  }

  const componentToIcon = (component: DZComponent) => {
    const componentSettings = edit.components[component.__component].settings
    const displayIcon = field.components?.find(comp => comp.name === component.__component)?.displayIcon || true

    if (!displayIcon) {
      return null
    }

    const iconName = componentSettings.icon
    if (!iconName) {
      return null
    }

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

    const iconKey = capitalize(iconName) as keyof typeof Icons
    return Icons[iconKey]
    
  }

  const getComponentConfigLevel = (component: DZComponent, field: Config['contentTypes'][number]['fields'][number]) => {
    if (field.type !== 'dynamiczone' || !field.components) {
      return 0
    }

    const componentConfig = field.components.find(comp => comp.name === component.__component)
    if (!componentConfig) {
      return 0
    }

    if (typeof componentConfig.level === 'number') {
      return componentConfig.level
    }

    return parseInt(component[componentConfig.level.field] as string) || 0
  }

  const handleComponentClick = (fieldName: string, componentIndex: number) => {
    // Select all dynamic zone headers (⚠️ uses :has selector)
    const dynamiczoneHeaders = document.querySelectorAll('div:has(+ span + span + ol)')

    for (const dynamiczoneHeader of dynamiczoneHeaders) {
      // Get the dynamic zone header title
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const dynamiczoneHeaderTitle = dynamiczoneHeader.querySelector('span:first-child')?.textContent.trim()

      // If the dynamic zone header title matches the field name
      if (getEditLayoutItemLabel(edit, fieldName) === dynamiczoneHeaderTitle) {
        // ⚠️ Full selector: `ol > li:nth-child(${componentIndex + 1}) > div:nth-child(2) > div > div > h3 > button` that we simplify to be hopefully more future-proof
        // Get the button element for the component
        const buttonElement = dynamiczoneHeader.parentElement!.querySelector<HTMLButtonElement>(`ol > li:nth-child(${componentIndex + 1}) h3 > button`)
        if (buttonElement) {
          if (buttonElement.getAttribute('data-state') === 'closed') { // If the component is closed, open it
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
      alignItems="flex-start"
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
          gap: 2,
        }}
      >
        {componentsWithLevel.map((componentWithLevel, componentWithLevelIndex) => {
          const Icon = componentToIcon(componentWithLevel.component)
          return (
            <li
              key={`${PLUGIN_ID}_field_${field.name}_component_${componentWithLevel.component.__component}[${componentWithLevel.component.id}]`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                paddingInlineStart: componentWithLevel.level * 16,
                cursor: activeTab !== 'published' ? 'pointer' : 'unset',
              }}
              onClick={() => activeTab !== 'published' && handleComponentClick(field.name, componentWithLevelIndex)}
            >
              {Icon && <Icon />}
              <Typography
                
                fontWeight="semiBold"
                style={{
                  paddingBlock: 2,
                }}
              >
                {componentToDisplayName(componentWithLevel.component)}
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
