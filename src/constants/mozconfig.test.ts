// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
jest.mock('..', () => ({
  bin_name: 'surfer',
  config: { version: {} },
}))

import { internalMozconfg } from './mozconfig'
import { firefox } from '../engines/firefox'
import { thunderbird } from '../engines/thunderbird'

const baseDeps = {
  config: {
    updateHostname: 'updates.example.com',
    version: { version: '140.13.0esr', candidate: undefined },
  } as any,
  currentBrandName: 'ZenBird',
}

describe('mozconfig generation', () => {
  test('firefox output contains today branding line', () => {
    const out = internalMozconfg('unofficial', 'release', {
      ...baseDeps,
      engine: firefox,
    })
    expect(out).toContain('--with-branding=browser/branding/unofficial')
    expect(out).toContain('export ZEN_FIREFOX_VERSION=140.13.0esr')
    expect(out).not.toContain('--enable-project')
  })

  test('thunderbird output adds project flag and comm branding', () => {
    const out = internalMozconfg('zenbird', 'release', {
      ...baseDeps,
      engine: thunderbird,
    })
    expect(out).toContain('ac_add_options --enable-project=comm/mail')
    expect(out).toContain('--with-branding=comm/mail/branding/zenbird')
    expect(out).toContain('export ZEN_THUNDERBIRD_VERSION=140.13.0esr')
  })

  test('macos bundle name uses injected brand', () => {
    ;(process as any).surferPlatform = 'darwin'
    const out = internalMozconfg('unofficial', 'release', {
      ...baseDeps,
      engine: firefox,
    })
    expect(out).toContain('MOZ_MACBUNDLE_NAME="ZenBird.app"')
  })
})
