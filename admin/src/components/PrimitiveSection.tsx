import type { PanelComponentProps } from '@strapi/content-manager/strapi-admin'
import type { Config } from '../../../server/src/config'

import { unstable_useDocumentLayout as useDocumentLayout, unstable_useContentManagerContext as useContentManagerContext } from '@strapi/strapi/admin'
import { Typography } from '@strapi/design-system'

import { PLUGIN_ID } from '../pluginId'
import { getEditLayoutItemLabel } from '../utils'

type PrimitiveSectionProps = Pick<PanelComponentProps, 'model'> & {
  field: Config['contentTypes'][number]['fields'][number]
}

const PrimitiveSection: React.FC<PrimitiveSectionProps> = ({
  field,
  model,
}) => {
  const { edit } = useDocumentLayout(model)
  const { form } = useContentManagerContext()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { values: formValues } = form as any

  // Early return if field is not a primitive or has no value
  if (field.type !== 'primitive' || !formValues[field.name]) {
    return null
  }

  const handlePrimitiveClick = (fieldName: string) => {
    // ⚠️ Heavily depends on the Strapi admin UI structure
    
    // Try to find the target element by name attribute
    let targetElement = document.querySelector<HTMLElement>(`div > label + div [name="${fieldName}"]`)
    // If not found, try to find label + div by name attribute (for select, textarea, etc.)
    if (!targetElement) {
      targetElement = document.querySelector<HTMLElement>(`div > label + div[name="${fieldName}"]`)
    }

    if (!targetElement) {
      return
    }

    targetElement.focus()

    // Scroll to the parent that contains the label and the target element
    let parent = targetElement.parentElement
    while (parent) {
      if (parent.tagName === 'DIV' && parent.querySelector('label + div')) {
        break
      }
      parent = parent.parentElement
    }
    if (!parent) {
      parent = targetElement.parentElement!
    }
    parent.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Typography
      key={`${PLUGIN_ID}_field_${field.name}`}
      tag="h3"
      style={{ cursor: 'pointer' }}
      onClick={() => handlePrimitiveClick(field.name)}
    >
      {field.displayLabel && `${getEditLayoutItemLabel(edit, field.name)}: `}
      {typeof formValues[field.name] === 'object' ? JSON.stringify(formValues[field.name]) : formValues[field.name]}
    </Typography>
  )
}

export { PrimitiveSection }
export type { PrimitiveSectionProps }
