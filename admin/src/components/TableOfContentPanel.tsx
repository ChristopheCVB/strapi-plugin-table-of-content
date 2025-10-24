import type { PanelComponent } from '@strapi/content-manager/strapi-admin'
import type { Config } from '../../../server/src/config'

import { useEffect, useState } from 'react'
import { FetchError, getFetchClient } from '@strapi/strapi/admin'
import { Typography, Loader, Flex, Button } from '@strapi/design-system'

import { PLUGIN_ID } from '../pluginId'
import { DynamicZoneSection } from './DynamicZoneSection'
import { PrimitiveSection } from './PrimitiveSection'

const TableOfContentPanel: PanelComponent = (props) => {
  const { get } = getFetchClient()

  const [isLoading, setIsLoading] = useState(true)
  const [retry, setRetry] = useState(0)
  const [contentType, setContentType] = useState<Config['contentTypes'][number] | undefined | null>(undefined) // undefined means the content type is not found, null means there was an error

  useEffect(() => {
    setIsLoading(true)
    get<Config['contentTypes'][number]>(`/${PLUGIN_ID}/config/${props.model}`)
      .then(({ data }) => {
        setContentType(data)
      })
      .catch((error) => {
        if (error instanceof FetchError && error.code === 404) {
          setContentType(undefined)
        } else {
          setContentType(null)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [retry])

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
      contentType.fields.map((field, fieldIndex) => {
        switch (field.type) {
        case 'separator':
          return (
            <hr
              key={`${PLUGIN_ID}_separator_${fieldIndex}`}
              style={{ width: '100%', color: 'rgba(0, 0, 0, 0.5)', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderColor: 'rgba(0, 0, 0, 0.5)' }}
            />
          )
        case 'primitive':
          return (
            <PrimitiveSection
              key={`${PLUGIN_ID}_field_${field.name}`}
              field={field}
              model={props.model}
            />
          )
        case 'dynamiczone':
          return (
            <DynamicZoneSection
              key={`${PLUGIN_ID}_field_${field.name}`}
              field={field}
              activeTab={props.activeTab}
              model={props.model}
            />
          )
        default:
          return null
        }
      })
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
