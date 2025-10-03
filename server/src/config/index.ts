import { z } from 'zod'

const configSchema = z.object({
  contentTypes: z.array(z.object({
    uid: z.string().min(1),
    dynamicZones: z.array(z.object({
      name: z.string().min(1),
      components: z.array(z.object({
        name: z.string().min(1),
        level: z.number().min(0),
      })).refine((components) => {
        const names = components.map((component) => component.name)
        return new Set(names).size === names.length
      }, {
        message: 'Duplicate component names are not allowed.',
      }).optional(),
    })).refine((dynamicZones) => {
      const names = dynamicZones.map((dynamicZone) => dynamicZone.name)
      return new Set(names).size === names.length
    }, {
      message: 'Duplicate dynamic zone names are not allowed.',
    }).min(1),
    
  })).refine((contentTypes) => {
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
