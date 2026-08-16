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
import * as packageHelpers from '../commands/package'

const baseDeps = {
  config: {
    updateHostname: 'updates.example.com',
    version: { version: '140.13.0esr', candidate: undefined },
  } as any,
  currentBrandName: 'ZenBird',
}

const goldenDeps = {
  config: {
    updateHostname: 'updates.example.com',
    version: { version: '140.13.0esr' },
  } as any,
  currentBrandName: 'TestBrand',
}

describe('mozconfig generation', () => {
  afterEach(() => {
    delete (process as any).surferPlatform
  })

  test('firefox non-darwin output equals golden byte-for-byte', () => {
    const out = internalMozconfg('unofficial', 'release', {
      ...goldenDeps,
      engine: firefox,
    })
    expect(out).toBe(`
# =====================
# Internal surfer config
# =====================

# Release build settings
ac_add_options --disable-debug
ac_add_options --enable-optimize
ac_add_options --enable-rust-simd

# Custom branding
ac_add_options --with-branding=browser/branding/unofficial

# Config for updates
ac_add_options --enable-update-channel=unofficial

export ACCEPTED_MAR_CHANNEL_IDS=unofficial
export MAR_CHANNEL_ID=unofficial

mk_add_options ACCEPTED_MAR_CHANNEL_IDS=unofficial

export ZEN_FIREFOX_VERSION=140.13.0esr
export MOZ_APPUPDATE_HOST=updates.example.com
`)
  })

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

  test('off-darwin never resolves current brand name', () => {
    const spy = jest
      .spyOn(packageHelpers, 'getCurrentBrandName')
      .mockImplementation(() => {
        throw new Error('getCurrentBrandName must not run off-darwin')
      })
    try {
      const out = internalMozconfg('unofficial', 'release', {
        ...goldenDeps,
        currentBrandName: undefined,
        engine: firefox,
      })
      expect(out).not.toContain('MOZ_MACBUNDLE_NAME')
    } finally {
      spy.mockRestore()
    }
    expect(spy).not.toHaveBeenCalled()
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
