// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { rawConfig } from '../utils/config'
import { engines } from './registry'
import { EngineId, EngineProfile } from './types'

export { engines } from './registry'
export type { EngineId, EngineProfile } from './types'

export function isEngine(id: string): id is EngineId {
  return id in engines
}

export function getEngineById(id: EngineId): EngineProfile {
  return engines[id]
}

/**
 * The engine configured for the current project. Reads the `engine` field of
 * surfer.json; defaults to firefox when absent. Throws on unknown values.
 */
export function getEngine(): EngineProfile {
  let configured = 'firefox'
  try {
    const parsed = JSON.parse(rawConfig())
    if (parsed.engine !== undefined) configured = parsed.engine
  } catch {
    // rawConfig already surfaces parse errors; fall through to defaults
  }

  if (!isEngine(configured)) {
    throw new Error(`Unknown engine "${configured}". Valid engines: ${Object.keys(engines).join(', ')}`)
  }

  return engines[configured]
}
