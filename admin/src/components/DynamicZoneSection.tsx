import type { EditViewContext, PanelComponentProps } from '@strapi/content-manager/strapi-admin'
import type { Config } from '../../../server/src/config'

import { useEffect, useState } from 'react'
import { unstable_useContentManagerContext as useContentManagerContext, unstable_useDocumentLayout as useDocumentLayout } from '@strapi/strapi/admin'
import { Typography, Flex } from '@strapi/design-system'

import { PLUGIN_ID } from '../pluginId'

type DZComponent = {
  __component: string
  id: number
} & Record<string, unknown>

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

  const [componentsWithLevel, setComponentsWithLevel] = useState<{ component: DZComponent, level: number }[]>([])

  useEffect(() => {
    const localComponentsWithLevel: { component: DZComponent, level: number }[] = []
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

  const getEditLayoutItemLabel = (fieldName: string) => {
    // flat(2) is used to flatten the layout array to 2 levels deep (array of rows, each row is an array of items)
    return edit.layout.flat(2).find((item) => item.name === fieldName)?.label
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
      if (getEditLayoutItemLabel(fieldName) === dynamiczoneHeaderTitle) {
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
      <Typography
        key={`${PLUGIN_ID}_field_${field.name}-title`}
        style={{ textTransform: 'uppercase' }}
        tag="h3"
      >
        {getEditLayoutItemLabel(field.name)}
      </Typography>
      <ol
        key={`${PLUGIN_ID}_field_${field.name}-list`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {componentsWithLevel.map((componentWithLevel: { component: DZComponent, level: number }, componentWithLevelIndex: number) => {
          return (
            <li
              key={`${PLUGIN_ID}_field_${field.name}_component_${componentWithLevel.component.__component}[${componentWithLevel.component.id}]`}
            >
              <Typography
                onClick={() => activeTab !== 'published' && handleComponentClick(field.name, componentWithLevelIndex)}
                fontWeight="semiBold"
                style={{
                  cursor: activeTab !== 'published' ? 'pointer' : 'unset',
                  paddingBlock: 2,
                  paddingInlineStart: componentWithLevel.level * 16,
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
