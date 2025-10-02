import { z } from 'zod'

const configSchema = z.object({
  contentTypes: z.object({
    uid: z.string().min(1),
    targetDynamicZoneFieldName: z.string().min(1),
  }).array().refine((contentTypes) => {
    const uids = contentTypes.map((contentType) => contentType.uid)
    return new Set(uids).size === uids.length
  }, {
    message: 'Duplicate content type UIDs are not allowed.',
  }),
})

export type Config = z.infer<typeof configSchema>

export default {
  default: {
    contentTypes: [],
  },
  validator(config: unknown) {
    configSchema.parse(config)
  },
}
