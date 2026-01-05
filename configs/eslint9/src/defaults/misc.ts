import type { AntFuTestConfig, AntFuUnocssConfig } from '../types'

export const defaultUnocssConfig: AntFuUnocssConfig = {
  attributify: true,
  strict: true,
}

export const defaultTestConfig: AntFuTestConfig = {
  overrides: {
    'no-console': 'off',
    'ts/unbound-method': 'off',
    'ts/no-unsafe-argument': 'off',
    'ts/no-unsafe-assignment': 'off',
    'ts/no-unsafe-member-access': 'off',
    'ts/no-unsafe-call': 'off',
    'ts/no-unsafe-return': 'off',
  },
}
