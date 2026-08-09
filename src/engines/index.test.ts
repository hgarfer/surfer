// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { getEngine, getEngineById, isEngine } from './index'
import { setMockRawConfig } from '../utils/config'
import { firefox } from './firefox'
import { thunderbird } from './thunderbird'

describe('engine registry', () => {
  test('defaults to firefox when surfer.json has no engine field', () => {
    setMockRawConfig('{}')
    expect(getEngine().id).toBe('firefox')
  })

  test('reads engine field from raw config', () => {
    setMockRawConfig(JSON.stringify({ engine: 'thunderbird' }))
    expect(getEngine().id).toBe('thunderbird')
  })

  test('throws on unknown engine id', () => {
    setMockRawConfig(JSON.stringify({ engine: 'netscape' }))
    expect(() => getEngine()).toThrow()
  })

  test('isEngine narrows', () => {
    expect(isEngine('firefox')).toBe(true)
    expect(isEngine('thunderbird')).toBe(true)
    expect(isEngine('netscape')).toBe(false)
  })
})

describe('firefox profile (regression lock)', () => {
  test('preserves today source URL shape', () => {
    expect(firefox.sourceUrlTemplate).toBe(
      'https://archive.mozilla.org/pub/firefox/releases/${version}/source/firefox-${version}.source.tar.xz'
    )
  })
  test('preserves today branding path', () => {
    expect(firefox.brandingPath).toBe('browser/branding')
  })
})

describe('thunderbird profile', () => {
  test('uses thunderbird archive URL and project flag', () => {
    expect(thunderbird.sourceUrlTemplate).toContain('/pub/thunderbird/releases/')
    expect(thunderbird.projectFlags).toContain('--enable-project=comm/mail')
  })
  test('seeds branding from nightly (comm tree ships no unofficial dir)', () => {
    expect(thunderbird.defaultBrandDir).toBe('nightly')
    expect(thunderbird.brandingPath).toBe('comm/mail/branding')
  })
  test('version files live under comm/mail/config', () => {
    expect(thunderbird.versionDisplayPaths[0]).toBe(
      'comm/mail/config/version_display.txt'
    )
  })
})
