// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { EngineProfile } from './types'

export const firefox: EngineProfile = {
  id: 'firefox',
  name: 'Firefox',
  products: [
    'firefox',
    'firefox-esr',
    'firefox-dev',
    'firefox-beta',
    'firefox-nightly',
  ],
  sourceUrlTemplate:
    'https://archive.mozilla.org/pub/firefox/releases/${version}/source/firefox-${version}.source.tar.xz',
  candidateUrlTemplate:
    'https://archive.mozilla.org/pub/firefox/candidates/${version}-candidates/build${build}/source/firefox-${version}.source.tar.xz',
  sourceDirPrefix: 'firefox-',
  versionDisplayPaths: ['browser/config/version_display.txt'],
  versionCheckPaths: ['browser/config/version.txt'],
  projectFlags: [],
  brandingPath: 'browser/branding',
  defaultBrandDir: 'unofficial',
  brandingPrefName: 'firefox-branding.js',
  ausDirName: 'browser',
  appVersionEnvName: 'ZEN_FIREFOX_VERSION',
  nsisDefinesPath: 'browser/installer/windows/nsis/defines.nsi.in',
  addonApiBase: 'https://addons.mozilla.org/api/v4',
  versionEndpoint:
    'https://product-details.mozilla.org/1.0/firefox_versions.json',
  versionTargets: {
    firefox: 'LATEST_FIREFOX_VERSION',
    'firefox-beta': 'LATEST_FIREFOX_DEVEL_VERSION',
    'firefox-dev': 'FIREFOX_DEVEDITION',
    'firefox-esr': 'FIREFOX_ESR',
    'firefox-nightly': 'FIREFOX_NIGHTLY',
  },
}
