// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
jest.mock('../index', () => ({
  bin_name: 'surfer',
  config: { version: {} },
}))

import { firefox } from '../engines/firefox'
import { thunderbird } from '../engines/thunderbird'
import { resolveVersionDisplayPath } from './init'

describe('resolveVersionDisplayPath', () => {
  test('firefox resolves browser path', () => {
    expect(resolveVersionDisplayPath(firefox, '/tmp/engine')).toBe(
      '/tmp/engine/browser/config/version_display.txt'
    )
  })
  test('thunderbird resolves comm path', () => {
    expect(resolveVersionDisplayPath(thunderbird, '/tmp/engine')).toBe(
      '/tmp/engine/comm/mail/config/version_display.txt'
    )
  })
})
