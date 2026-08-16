// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

export type EngineId = 'firefox' | 'thunderbird'

/**
 * Static, data-only description of a Mozilla application that surfer can
 * download, patch, build, and package. One profile per engine; the registry
 * (index.ts) is the only place commands read engine knowledge from.
 */
export interface EngineProfile {
  id: EngineId
  /** Display name, e.g. "Firefox". Used in user-facing messages. */
  name: string
  /** Valid values for config.version.product for this engine. */
  products: string[]
  /**
   * Release source tarball URL. Supports ${version} substitution, e.g.
   * '.../releases/${version}/source/firefox-${version}.source.tar.xz'
   */
  sourceUrlTemplate: string
  /** Candidate source tarball URL. Supports ${version} and ${build}. */
  candidateUrlTemplate: string
  /** Directory prefix inside the source archive, e.g. 'firefox-'. */
  sourceDirPrefix: string
  /** version_display.txt locations under engine/, in priority order. */
  versionDisplayPaths: string[]
  /** version.txt locations under engine/, in priority order. */
  versionCheckPaths: string[]
  /** Extra ac_add_options entries appended to the generated mozconfig. */
  projectFlags: string[]
  /** Branding directory relative to tree root, e.g. 'browser/branding'. */
  brandingPath: string
  /** Brand directory surfer copies default moz files from, e.g. 'unofficial'. */
  defaultBrandDir: string
  /** Name of the pref file written into the active brand dir. */
  brandingPrefName: string
  /** AUS update.xml folder name ('browser' or 'thunderbird'). */
  ausDirName: string
  /** Env var name exported with the resolved version in mozconfig. */
  appVersionEnvName: string
  /** defines.nsi.in path relative to engine dir, for cert patches. */
  nsisDefinesPath: string
  /** Base URL for addon API lookups (AMO platform). */
  addonApiBase: string
  /** product-details.mozilla.org JSON endpoint for latest versions. */
  versionEndpoint: string
  /** Maps product id -> key in the versionEndpoint JSON. */
  versionTargets: Record<string, string>
  /**
   * Theme tree for the userChrome (uc) optional template target, relative to
   * tree root, e.g. 'browser/themes'.
   */
  uiThemeDir: string
  /**
   * Value passed to `./mach bootstrap --application-choice`. Omit (leave
   * undefined) when mach should auto-detect the application from the
   * mozconfig's `--enable-application` flag.
   */
  bootstrapApplicationChoice?: string
}
