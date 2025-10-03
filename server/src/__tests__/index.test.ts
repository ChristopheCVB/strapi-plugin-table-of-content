import { describe, expect, it } from 'vitest'
import config from '../config'

describe('Table of Content Plugin', () => {
  describe('Config', () => {
    it('should validate a valid configuration', () => {
      const validConfig = {
        contentTypes: [
          {
            uid: 'api::page.page',
            dynamicZones: [
              {
                name: 'content',
                components: [
                  {
                    name: 'content.summary-title',
                    level: 1,
                  },
                ],
              },
            ],
          },
        ],
      }
  
      expect(() => config.validator(validConfig)).not.toThrow()
    })

    it('should reject invalid uid', () => {
      const invalidConfig = {
        contentTypes: [
          {
            uid: '',
            dynamicZones: [
              {
                name: 'content',
              },
            ],
          },
        ],
      }
  
      expect(() => config.validator(invalidConfig)).toThrow()
    })

    it('should reject missing dynamicZones', () => {
      const invalidConfig = {
        contentTypes: [
          {
            uid: 'api::page.page',
          },
        ],
      }

      expect(() => config.validator(invalidConfig)).toThrow()
    })

    it('should reject empty dynamicZones', () => {
      const invalidConfig = {
        contentTypes: [
          {
            uid: 'api::page.page',
            dynamicZones: [],
          },
        ],
      }

      expect(() => config.validator(invalidConfig)).toThrow()
    })

    it('should reject duplicate uids', () => {
      const invalidConfig = {
        contentTypes: [
          {
            uid: 'api::page.page',
            dynamicZones: [
              {
                name: 'content',
              },
            ],
          },
          {
            uid: 'api::page.page',
            dynamicZones: [
              {
                name: 'content2',
              },
            ],
          },
        ],
      }

      expect(() => config.validator(invalidConfig)).toThrow()
    })
  })
}) 
