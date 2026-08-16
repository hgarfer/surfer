// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
import axios from 'axios'
import { log } from '../log'
import { EngineProfile, getEngine } from '../engines'
import { config } from './config'
import { dynamicConfig } from '.'

export const shouldUseCandidate = (): boolean => {
  const brandingKey = dynamicConfig.get('brand')
  return (
    brandingKey !== 'release' &&
    config.version.candidate !== undefined &&
    config.version.version !== config.version.candidate
  )
}

export const getFFVersionOrCandidate = () => {
  return shouldUseCandidate()
    ? config.version.candidate
    : config.version.version
}

export const getLatestVersion = async (
  product: string = config.version.product,
  engine: EngineProfile = getEngine()
): Promise<string> => {
  const targetKey = engine.versionTargets[product]
  if (!targetKey) {
    log.error(`${product} is not a valid product for the ${engine.name} engine`)
    return ''
  }
  try {
    const { data } = await axios.get(engine.versionEndpoint)
    return data[targetKey]
  } catch (error) {
    log.warning(`Failed to get latest ${engine.name} version with error:`)
    log.error(error)
    return ''
  }
}

/** Backwards-compatible alias for the renamed getLatestVersion. */
export const getLatestFF = getLatestVersion
