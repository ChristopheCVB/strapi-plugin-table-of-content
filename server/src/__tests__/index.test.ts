import { describe, expect, it } from 'vitest'
import config from '../config'

describe('Table of Content Plugin', () => {
  describe('Config', () => {
    it('should validate a valid configuration', () => {
      const validConfig = {
        contentTypes: [
          {
            uid: 'api::page.page',
            fields: [
              {
                name: 'content',
                type: 'dynamiczone',
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
            fields: [],
          },
        ],
      }
  
      expect(() => config.validator(invalidConfig)).toThrow()
    })

    it('should reject missing fields', () => {
      const invalidConfig = {
        contentTypes: [
          {
            uid: 'api::page.page',
          },
        ],
      }

      expect(() => config.validator(invalidConfig)).toThrow()
    })

    it('should reject empty fields', () => {
      const invalidConfig = {
        contentTypes: [
          {
            uid: 'api::page.page',
            fields: [],
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
            fields: [
              {
                name: 'content',
                type: 'dynamiczone',
              },
            ],
          },
          {
            uid: 'api::page.page',
            fields: [
              {
                name: 'content',
                type: 'dynamiczone',
              },
            ],
          },
        ],
      }

      expect(() => config.validator(invalidConfig)).toThrow()
    })

    it('should reject duplicate field names', () => {
      const invalidConfig = {
        contentTypes: [
          {
            uid: 'api::page.page',
            fields: [
              {
                name: 'content',
                type: 'dynamiczone',
              },
              {
                name: 'content',
                type: 'dynamiczone',
              },
            ],
          },
        ],
      }

      expect(() => config.validator(invalidConfig)).toThrow()
    })
  })
}) 
