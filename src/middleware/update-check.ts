// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { bin_name, config } from '..'
import { log } from '../log'
import { getEngine } from '../engines'
import { getLatestFF } from '../utils'

export const updateCheck = async (): Promise<void> => {
  const engine = getEngine()
  const engineVersion = config.version.version

  try {
    const version = await getLatestFF(config.version.product)

    if (engineVersion && version !== engineVersion)
      log.warning(
        `Latest version of ${engine.name} (${version}) does not match frozen version (${engineVersion}). Update ${engine.name} with the command |${bin_name} update|.`
      )
  } catch (error) {
    log.warning(`Failed to check for updates.`)
    log.askForReport()
    //log.error(error)
  }
}
