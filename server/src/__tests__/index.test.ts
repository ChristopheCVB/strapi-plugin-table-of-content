import { describe, expect, it } from 'vitest'
import config from '../config'

describe('Table of Content Plugin', () => {
  describe('Config', () => {
    it('should validate a valid configuration', () => {
      const validConfig = {
        contentTypes: [
          {
            uid: 'api::page.page',
            targetDynamicZoneFieldName: 'content',
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
            targetDynamicZoneFieldName: 'content',
          },
        ],
      }
  
      expect(() => config.validator(invalidConfig)).toThrow()
    })

    it('should reject missing targetDynamicZoneFieldName', () => {
      const invalidConfig = {
        contentTypes: [
          {
            uid: 'api::page.page',
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
            targetDynamicZoneFieldName: 'content',
          },
          {
            uid: 'api::page.page',
            targetDynamicZoneFieldName: 'content2',
          },
        ],
      }

      expect(() => config.validator(invalidConfig)).toThrow()
    })
  })
}) 
