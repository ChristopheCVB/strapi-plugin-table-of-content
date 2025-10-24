import type { Config } from '../../../server/src/config'

import { unstable_useContentManagerContext as useContentManagerContext } from '@strapi/strapi/admin'
import { Typography } from '@strapi/design-system'

import { PLUGIN_ID } from '../pluginId'

interface PrimitiveSectionProps {
  field: Config['contentTypes'][number]['fields'][number]
}

const PrimitiveSection: React.FC<PrimitiveSectionProps> = ({
  field,
}) => {
  const { form } = useContentManagerContext()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { values: formValues } = form as any

  // Early return if field is not a dynamic zone or has no components
  if (field.type !== 'primitive' || !formValues[field.name]) {
    return null
  }

  return (
    <Typography key={`${PLUGIN_ID}_field_${field.name}`} tag="h3">{field.name}: {formValues[field.name]}</Typography>
  )
}

export { PrimitiveSection }
export type { PrimitiveSectionProps }
