import { z } from 'zod'

const configSchema = z.object({
  contentTypes: z.array(z.object({
    uid: z.string().min(1),
    fields: z.array(
      z.union([
        z.object({
          type: z.literal('separator'),
        }),
        z.object({
          type: z.literal('primitive'),
          name: z.string().min(1),
          displayLabel: z.boolean().optional(),
        }),
        // TODO: Allow relation fields to be configured
        // z.object({
        //   name: z.string().min(1),
        //   type: z.literal('relation'),
        //   relationField: z.string().min(1),
        // }),
        z.object({
          type: z.literal('dynamiczone'),
          name: z.string().min(1),
          displayLabel: z.boolean().optional(),
          components: z.array(
            z.object({
              name: z.string().min(1),
              level: z.union([
                z.number().min(0),
                z.object({
                  field: z.string().min(1),
                }),
              ]),
            }),
          ).refine((components) => {
            const componentNames = components.map((component) => component.name)
            return new Set(componentNames).size === componentNames.length
          }, {
            message: 'Duplicate component names are not allowed.',
          }).optional(),
        }),
      ]),
    ).refine((fields) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const fieldNames = fields.filter((field) => field.type !== 'separator').map((field) => field.name)
      return new Set(fieldNames).size === fieldNames.length
    }, {
      message: 'Duplicate field names are not allowed.',
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
