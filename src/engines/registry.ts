// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { firefox } from './firefox'
import { thunderbird } from './thunderbird'
import { EngineId, EngineProfile } from './types'

/**
 * Static map of engine id -> profile. Lives in this leaf module (no imports
 * from config) so config validation can read it without a module-load cycle:
 * `engines/index.ts` imports `rawConfig` from config, so config must not
 * import the registry through index.
 */
export const engines: Record<EngineId, EngineProfile> = {
  firefox,
  thunderbird,
}
