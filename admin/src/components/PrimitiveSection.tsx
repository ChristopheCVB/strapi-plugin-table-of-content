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
    const input = document.querySelector<HTMLInputElement>(`div > label + div > input[name="${fieldName}"]`)
    if (input) {
      input.focus()
      // Scroll to the parent that contains the label and the input
      input.parentElement!.parentElement!.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Typography
      key={`${PLUGIN_ID}_field_${field.name}`}
      tag="h3"
      style={{ cursor: 'pointer' }}
      onClick={() => handlePrimitiveClick(field.name)}
    >
      {field.displayLabel && `${getEditLayoutItemLabel(edit, field.name)}: `}
      {formValues[field.name]}
    </Typography>
  )
}

export { PrimitiveSection }
export type { PrimitiveSectionProps }
