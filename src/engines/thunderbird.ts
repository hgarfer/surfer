// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { EngineProfile } from './types'

export const thunderbird: EngineProfile = {
  id: 'thunderbird',
  name: 'Thunderbird',
  products: [
    'thunderbird',
    'thunderbird-esr',
    'thunderbird-beta',
    'thunderbird-nightly',
  ],
  sourceUrlTemplate:
    'https://archive.mozilla.org/pub/thunderbird/releases/${version}/source/thunderbird-${version}.source.tar.xz',
  candidateUrlTemplate:
    'https://archive.mozilla.org/pub/thunderbird/candidates/${version}-candidates/build${build}/source/thunderbird-${version}.source.tar.xz',
  sourceDirPrefix: 'thunderbird-',
  versionDisplayPaths: ['comm/mail/config/version_display.txt'],
  versionCheckPaths: ['comm/mail/config/version.txt'],
  projectFlags: ['--enable-project=comm/mail'],
  brandingPath: 'comm/mail/branding',
  defaultBrandDir: 'nightly',
  brandingPrefName: 'thunderbird-branding.js',
  ausDirName: 'thunderbird',
  appVersionEnvName: 'ZEN_THUNDERBIRD_VERSION',
  nsisDefinesPath: 'comm/mail/installer/windows/nsis/defines.nsi.in',
  addonApiBase: 'https://addons.thunderbird.net/api/v4',
  versionEndpoint:
    'https://product-details.mozilla.org/1.0/thunderbird_versions.json',
  versionTargets: {
    thunderbird: 'LATEST_THUNDERBIRD_VERSION',
    'thunderbird-esr': 'THUNDERBIRD_ESR',
    'thunderbird-beta': 'LATEST_THUNDERBIRD_DEVEL_VERSION',
    'thunderbird-nightly': 'LATEST_THUNDERBIRD_NIGHTLY_VERSION',
  },
  uiThemeDir: 'mail/themes',
  bootstrapApplicationChoice: 'browser',
}
