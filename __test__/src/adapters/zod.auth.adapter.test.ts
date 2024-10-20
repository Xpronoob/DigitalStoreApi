import { describe, expect, test } from '@jest/globals'
import { ZodAuthAdapter } from '../../../src/adapters/zod.auth.adapter'

const expected = {
  email: 'test@test.com',
  password: '12345678',
}

const zodAuthAdapter = ZodAuthAdapter.validateAuthUser(expected)

test('zod validate validateAuthUser required fields', () => {
  expect(expected).toEqual(zodAuthAdapter)
})
