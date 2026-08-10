jest.mock('../..', () => ({
  bin_name: 'surfer',
  config: { version: {} },
}))

import { firefox } from '../../engines/firefox'
import { thunderbird } from '../../engines/thunderbird'
import { getReleaseUri, getSourceFilename } from './firefox'

describe('firefox download urls', () => {
  test('release uri keeps current shape', () => {
    expect(getReleaseUri(firefox, '128.0', 1, false)).toBe(
      'https://archive.mozilla.org/pub/firefox/releases/128.0/source/firefox-128.0.source.tar.xz'
    )
  })
  test('candidate uri keeps current shape', () => {
    expect(getReleaseUri(firefox, '128.0', 2, true)).toBe(
      'https://archive.mozilla.org/pub/firefox/candidates/128.0-candidates/build2/source/firefox-128.0.source.tar.xz'
    )
  })
})

describe('thunderbird download urls', () => {
  test('release uri', () => {
    expect(getReleaseUri(thunderbird, '140.13.0esr', 1, false)).toBe(
      'https://archive.mozilla.org/pub/thunderbird/releases/140.13.0esr/source/thunderbird-140.13.0esr.source.tar.xz'
    )
  })
  test('candidate uri', () => {
    expect(getReleaseUri(thunderbird, '140.13.0esr', 3, true)).toBe(
      'https://archive.mozilla.org/pub/thunderbird/candidates/140.13.0esr-candidates/build3/source/thunderbird-140.13.0esr.source.tar.xz'
    )
  })
  test('source filename prefix', () => {
    expect(getSourceFilename(thunderbird, '140.13.0esr')).toBe(
      'thunderbird-140.13.0esr.source.tar.xz'
    )
  })
})
