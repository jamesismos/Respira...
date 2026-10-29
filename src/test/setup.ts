import { afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'

beforeEach(() => {
  if (typeof localStorage !== 'undefined') localStorage.clear()
})

afterEach(() => {
  cleanup()
})
