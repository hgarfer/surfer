// Defines config that should be set dynamically on the users system. This allows
// for interfacing between these values

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { engines } from '../engines/registry'
import { log } from '../log'
import { readItem, writeItem } from './store'

export const defaultValues: {
  brand: string
  buildMode: 'dev' | 'debug' | 'release'
  marPath: string
} = {
  brand: 'unofficial',
  buildMode: 'dev',
  marPath: '',
}

export type DefaultValuesType = typeof defaultValues
export type DefaultValuesKeys = keyof DefaultValuesType

type DynamicGetter<K extends keyof DefaultValuesType> = (
  key: K
) => DefaultValuesType[K]
type DynamicSetter<K extends keyof DefaultValuesType> = (
  key: K,
  value: DefaultValuesType[K]
) => void

export const get: DynamicGetter<keyof DefaultValuesType> = (key) =>
  readItem(`dynamicConfig.${key}`).unwrapOrElse(() => {
    // 'brand' default is engine-aware: each engine's vanilla dev branding dir
    // (firefox -> 'unofficial', thunderbird -> 'nightly'). Other keys use the
    // static defaultValues below. We read the engine id straight from
    // surfer.json and the registry leaf (not engines/index or utils/config) to
    // avoid a module-load cycle and config side effects that pollute tests.
    let fallback = defaultValues[key]
    if (key === 'brand') {
      let engineId = 'firefox'
      try {
        const parsed = JSON.parse(
          readFileSync(join(process.cwd(), 'surfer.json'), 'utf8')
        )
        if (parsed && typeof parsed.engine === 'string') engineId = parsed.engine
      } catch {
        // No/invalid surfer.json — fall back to firefox's default.
      }
      const profile = (engines as Record<string, { defaultBrandDir: string }>)[
        engineId
      ]
      if (profile) fallback = profile.defaultBrandDir
    }
    log.info(`Dynamic config '${key}' not set, defaulting to '${fallback}'`)
    return fallback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any

export const set: DynamicSetter<keyof DefaultValuesType> = (key, value) =>
  writeItem(`dynamicConfig.${key}`, value)
