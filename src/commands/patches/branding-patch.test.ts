// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
jest.mock('../..', () => ({
  bin_name: 'surfer',
  config: { version: {} },
}))

import {
  brandingStoreDir,
  defaultBrandSourceDir,
  brandingPrefPath,
  computeAusBaseUrl,
} from './branding-patch'
import { firefox } from '../../engines/firefox'
import { thunderbird } from '../../engines/thunderbird'

const ENGINE = '/proj/engine'

describe('branding paths', () => {
  test('firefox store under browser/branding, seeded from unofficial', () => {
    expect(brandingStoreDir(firefox, ENGINE)).toBe('/proj/engine/browser/branding')
    expect(defaultBrandSourceDir(firefox, ENGINE)).toBe('/proj/engine/browser/branding/unofficial')
    expect(brandingPrefPath(firefox, '/proj/engine/browser/branding/zen')).toBe(
      '/proj/engine/browser/branding/zen/pref/firefox-branding.js'
    )
  })
  test('thunderbird store under comm/mail/branding, seeded from nightly', () => {
    expect(brandingStoreDir(thunderbird, ENGINE)).toBe('/proj/engine/comm/mail/branding')
    expect(defaultBrandSourceDir(thunderbird, ENGINE)).toBe('/proj/engine/comm/mail/branding/nightly')
    expect(brandingPrefPath(thunderbird, '/proj/engine/comm/mail/branding/zen')).toBe(
      '/proj/engine/comm/mail/branding/zen/pref/thunderbird-branding.js'
    )
  })
  test('aus base url uses engine dir name', () => {
    expect(computeAusBaseUrl(firefox)).toBe(
      'URL=https://@MOZ_APPUPDATE_HOST@/updates/browser/%BUILD_TARGET%/%CHANNEL%/update.xml'
    )
    expect(computeAusBaseUrl(thunderbird)).toBe(
      'URL=https://@MOZ_APPUPDATE_HOST@/updates/thunderbird/%BUILD_TARGET%/%CHANNEL%/update.xml'
    )
  })
})
