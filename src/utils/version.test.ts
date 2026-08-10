// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
import axios from 'axios'
import { getLatestVersion } from './version'
import { getEngine } from '../engines'
import { setMockRawConfig } from './config'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('latest version resolution', () => {
  afterEach(() => jest.resetAllMocks())

  test('hits firefox endpoint for firefox product', async () => {
    setMockRawConfig(JSON.stringify({ engine: 'firefox' }))
    mockedAxios.get.mockResolvedValue({ data: { LATEST_FIREFOX_VERSION: '137.0' } })
    await expect(getLatestVersion('firefox')).resolves.toBe('137.0')
    expect(mockedAxios.get).toHaveBeenCalledWith(getEngine().versionEndpoint)
  })

  test('hits thunderbird endpoint for thunderbird-esr', async () => {
    setMockRawConfig(JSON.stringify({ engine: 'thunderbird' }))
    mockedAxios.get.mockResolvedValue({ data: { THUNDERBIRD_ESR: '140.13.0esr' } })
    await expect(getLatestVersion('thunderbird-esr')).resolves.toBe('140.13.0esr')
    expect(mockedAxios.get).toHaveBeenCalledWith(getEngine().versionEndpoint)
  })
})
