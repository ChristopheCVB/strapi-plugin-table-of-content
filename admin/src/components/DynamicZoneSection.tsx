import type { EditViewContext, PanelComponentProps } from '@strapi/content-manager/strapi-admin'
import type { Config } from '../../../server/src/config'

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

  const components = formValues[field.name] as DZComponent[]

  const componentToDisplayName = (component: DZComponent) => {
    const componentSettings = edit.components[component.__component].settings
    let displayName = componentSettings.displayName

    if (componentSettings.mainField !== 'documentId' && component[componentSettings.mainField]) {
      displayName = `${displayName} - ${component[componentSettings.mainField]}`
    }

    return displayName
  }

  const getComponentLevel = (componentName: string, field: Config['contentTypes'][number]['fields'][number]) => {
    if (field.type !== 'dynamiczone' || !field.components) {
      return 0
    }
    const component = field.components.find(comp => comp.name === componentName)
    return component ? component.level : 0
  }

  const getParentLevel = (currentIndex: number, field: Config['contentTypes'][number]['fields'][number]) => {
    if (field.type !== 'dynamiczone' || currentIndex === 0) {
      return 0
    }
    
    const components = formValues[field.name] as DZComponent[]
    const currentComponentLevel = getComponentLevel(components[currentIndex].__component, field)
    
    // Find the most recent component with a higher level
    for (let i = currentIndex - 1; i >= 0; i--) {
      const componentLevel = getComponentLevel(components[i].__component, field)
      
      // If we find a component with higher level, use it as parent
      if (componentLevel > currentComponentLevel) {
        return componentLevel
      }
    }
    
    return 0
  }

  const handleComponentClick = (fieldName: string, componentIndex: number) => {
    // console.log(`clicked on field '${fieldName}' at component index ${componentIndex}`)
    alert(`clicked on dynamic zone '${fieldName}' at component index ${componentIndex}`)
    // TODO: Implement the logic to handle the component click
    // Open the component in the editor and scroll to it
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
        {field.name}
      </Typography>
      <ol
        key={`${PLUGIN_ID}_field_${field.name}-list`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {components.map((dzComponent: DZComponent, dzComponentIndex: number) => {
          // Get the parent level (most recent component with higher level)
          const parentLevel = getParentLevel(dzComponentIndex, field)
          
          return (
            <li key={`${PLUGIN_ID}_field_${field.name}_component_${dzComponent.__component}[${dzComponent.id}]`}>
              <Typography
                onClick={() => activeTab !== 'published' && handleComponentClick(field.name, dzComponentIndex)}
                fontWeight="semiBold"
                style={{
                  cursor: activeTab !== 'published' ? 'pointer' : 'unset',
                  paddingBlock: 2,
                  paddingInlineStart: parentLevel * 16,
                }}
              >
                {componentToDisplayName(dzComponent)}
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
