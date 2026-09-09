// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
jest.mock('..', () => ({
  bin_name: 'surfer',
  config: { version: {} },
}))

import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { firefox } from '../engines/firefox'
import { thunderbird } from '../engines/thunderbird'
import { writeEngineVersionFiles } from './build'

describe('writeEngineVersionFiles', () => {
  const engineDir = mkdtempSync(join(tmpdir(), 'surfer-build-test-'))

  const mkDirs = (...paths: string[]) => {
    for (const p of paths) mkdirSync(join(engineDir, p), { recursive: true })
  }

  afterAll(() => rmSync(engineDir, { recursive: true, force: true }))

  test('writes firefox version to browser/config target files', () => {
    mkDirs('browser/config')
    const targets = writeEngineVersionFiles(firefox, '137.0', engineDir)

    expect(targets).toEqual([
      join(engineDir, 'browser/config/version.txt'),
      join(engineDir, 'browser/config/version_display.txt'),
    ])
    expect(readFileSync(targets[0], 'utf8')).toBe('137.0')
    expect(readFileSync(targets[1], 'utf8')).toBe('137.0')
  })

  test('writes thunderbird version to comm/mail/config target files', () => {
    mkDirs('comm/mail/config')
    const targets = writeEngineVersionFiles(
      thunderbird,
      '140.13.0esr',
      engineDir
    )

    expect(targets).toEqual([
      join(engineDir, 'comm/mail/config/version.txt'),
      join(engineDir, 'comm/mail/config/version_display.txt'),
    ])
    expect(readFileSync(targets[0], 'utf8')).toBe('140.13.0esr')
    expect(readFileSync(targets[1], 'utf8')).toBe('140.13.0esr')
  })
})
