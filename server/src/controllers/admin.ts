import type { Core } from '@strapi/strapi'
import type { Context } from 'koa'
import type { Config } from '../config'

import { PLUGIN_ID } from '../pluginId'

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  config(ctx: Context): Config['contentTypes'][number] {
    const { uid } = ctx.params
    
    // Get config and find right content-type with uid
    const contentTypes: Config['contentTypes'] = strapi.plugin(PLUGIN_ID).config('contentTypes')
    const contentType = contentTypes.find(contentType => contentType.uid === uid)

    if (!contentType) {
      ctx.throw(404, `Configuration for content type ${uid} not found.`)
    }

    return contentType
  },
})

export default controller
