import type { PanelComponentProps } from '@strapi/content-manager/strapi-admin'
import type { Config } from '../../../server/src/config'

import { unstable_useDocumentLayout as useDocumentLayout, unstable_useContentManagerContext as useContentManagerContext } from '@strapi/strapi/admin'
import { Typography } from '@strapi/design-system'
import {
  Calendar,
  Check,
  ChevronRight,
  Code,
  CodeBlock,
  EyeStriked,
  Faders,
  Hashtag,
  Image,
  List,
  ListSearch,
  Mail,
  OneToOne,
  Paragraph,
} from '@strapi/icons'
import { PLUGIN_ID } from '../pluginId'
import { getEditMetadataFieldLabel } from '../utils'

type PrimitiveSectionProps = Pick<PanelComponentProps, 'model' | 'document'> & {
  field: Config['contentTypes'][number]['fields'][number]
}

const PrimitiveSection: React.FC<PrimitiveSectionProps> = ({
  field,
  model,
  document: currentDocument,
}) => {

  const { edit } = useDocumentLayout(model)
  const { form } = useContentManagerContext()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { values: formValues } = form as any
  
  // Early return if field is not a primitive or has no value
  if (field.type !== 'primitive' || !formValues[field.name] && !currentDocument?.[field.name]) {
    return null
  }

  const currentFieldValue = formValues[field.name] || currentDocument?.[field.name]

  const handlePrimitiveClick = (fieldName: string) => {
    // ⚠️ Heavily depends on the Strapi admin UI structure
    
    // Try to find the target element by name attribute
    const selectors = [
      `div > div + div [name="${fieldName}"]`, // input, textarea, etc.
      `div > div + div[name="${fieldName}"]`, // select, etc.
    ]
    let targetElement: HTMLElement | null = null
    for (const selector of selectors) {
      const found = document.querySelector<HTMLElement>(selector)
      if (found) {
        targetElement = found
        break
      }
    }

    if (!targetElement) {
      return
    }

    targetElement.focus()

    // Scroll to the parent that contains the label and the target element
    let parent = targetElement.parentElement
    while (parent) {
      if (parent.tagName === 'DIV' && parent.querySelector('div + div')) {
        break
      }
      parent = parent.parentElement
    }
    if (!parent) {
      console.log('targetElement.parentElement!.parentElement!', targetElement.parentElement!.parentElement!)
      parent = targetElement.parentElement!.parentElement!
    }
    parent.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const getIcon = () => {
    if (!field.displayIcon) {
      return null
    }

    let fieldLayout: { type: string } | undefined = edit.layout.flat(2).find(item => item.name === field.name)

    if (!fieldLayout) {
      fieldLayout = ['createdAt', 'updatedAt', 'publishedAt'].includes(field.name) ? { type: 'date' } : undefined
    }

    if (!fieldLayout) {
      fieldLayout = ['createdBy', 'updatedBy'].includes(field.name) ? { type: 'relation' } : undefined
    }

    if (!fieldLayout) {
      return null
    }

    let icon = ChevronRight
    switch (fieldLayout.type) {
    case 'component':
      icon = Faders
      break
    case 'date':
    case 'datetime':
    case 'time':
    case 'timestamp':
      icon = Calendar
      break
    case 'boolean':
      icon = Check
      break
    case 'email':
      icon = Mail
      break
    case 'decimal':
    case 'biginteger':
    case 'integer':
    case 'float':
      icon = Hashtag
      break
    case 'enumeration':
      icon = ListSearch
      break
    case 'json':
      icon = CodeBlock
      break
    case 'password':
      icon = EyeStriked
      break
    case 'text':
    case 'string':
      icon = List
      break
    case 'richtext':
    case 'blocks':
      icon = Paragraph
      break
    case 'media':
      icon = Image
      break
    case 'relation':
      icon = OneToOne
      break
    case 'uid':
      icon = Code
      break
    }

    return icon
  }

  const Icon = getIcon()

  return (
    <Typography
      key={`${PLUGIN_ID}_field_${field.name}`}
      tag="h3"
      style={{
        cursor: 'pointer',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        paddingBlock: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
      onClick={() => handlePrimitiveClick(field.name)}
    >
      {field.displayIcon && Icon && (<Icon />)}
      {field.displayLabel && (<b>{`${getEditMetadataFieldLabel(edit, field.name)}: `}</b>)}
      {typeof currentFieldValue === 'object' ? JSON.stringify(currentFieldValue) : currentFieldValue}
    </Typography>
  )
}

export { PrimitiveSection }
export type { PrimitiveSectionProps }
