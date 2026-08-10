import execa from 'execa'
import { existsSync, rmSync, writeFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

import { bin_name } from '../..'
import { BASH_PATH, ENGINE_DIR, MELON_TMP_DIR } from '../../constants'
import { EngineProfile, getEngine } from '../../engines'
import { log } from '../../log'
import { commandExistsSync } from '../../utils/command-exists'
import { downloadFileToLocation } from '../../utils/download'
import { ensureDirectory, windowsPathToUnix } from '../../utils/fs'
import { init } from '../init'
import { config } from '../..'
import {
  addAddonsToMozBuild,
  downloadAddon,
  generateAddonMozBuild,
  getAddons,
  initializeAddon,
  resolveAddonDownloadUrl,
  unpackAddon,
} from './addon'
import {
  configPath,
  getFFVersionOrCandidate,
  shouldUseCandidate,
} from '../../utils'
import fs from 'fs-extra'

export function shouldSetupFirefoxSource() {
  return !(
    existsSync(ENGINE_DIR) &&
    existsSync(resolve(ENGINE_DIR, 'toolkit', 'moz.build'))
  )
}

export async function setupFirefoxSource(
  version: string,
  candidateBuild: number,
  isCandidate = false
) {
  const firefoxSourceTar = await downloadFirefoxSource(
    version,
    candidateBuild,
    isCandidate
  )

  await unpackFirefoxSource(firefoxSourceTar)

  if (!process.env.CI_SKIP_INIT) {
    const engine = getEngine()
    log.info(`Init ${engine.name}`)
    await init(ENGINE_DIR)
  }
}

async function unpackFirefoxSource(name: string): Promise<void> {
  const engine = getEngine()

  log.info(`Unpacking ${engine.name}...`)

  ensureDirectory(ENGINE_DIR)
  let tarExec = 'tar'

  // On MacOS, we need to use gnu tar, otherwise tar doesn't behave how we
  // would expect it to behave, so this section is responsible for handling
  // that
  //
  // If BSD tar adds --transform support in the future, we can use that
  // instead
  if (process.platform == 'darwin') {
    // GNU Tar doesn't come preinstalled on any MacOS machines, so we need to
    // check for it and ask for the user to install it if necessary
    if (!commandExistsSync('gtar')) {
      throw new Error(
        `GNU Tar is required to extract ${engine.name}'s source on MacOS. Please install it using the command |brew install gnu-tar| or |sudo port install gnutar| and try again`
      )
    }

    tarExec = 'gtar'
  }

  log.info(`Unpacking ${resolve(MELON_TMP_DIR, name)} to ${ENGINE_DIR}`)
  if (process.platform === 'win32') {
    log.info(`Unpacking ${engine.name} source on Windows (7z)`)
    await execa('7z', [
      'x',
      resolve(MELON_TMP_DIR, name),
      '-o' + resolve(MELON_TMP_DIR, name.replace('.tar.xz', '.tar')),
    ])
    log.info(`Unpacking ${engine.name} source again without the .xz extension`)
    await execa('7z', [
      'x',
      resolve(MELON_TMP_DIR, name.replace('.tar.xz', '.tar')),
      '-o' + MELON_TMP_DIR,
    ])
    const archiveDir = resolve(
      MELON_TMP_DIR,
      engine.sourceDirPrefix + getFFVersionOrCandidate()
    )
    if (existsSync(ENGINE_DIR)) {
      // remove the existing engine directory
      fs.removeSync(ENGINE_DIR)
    }
    log.info(`Moving ${engine.name} source to engine directory`)
    fs.moveSync(archiveDir, ENGINE_DIR)
    return
  }

  await execa(
    tarExec,
    [
      '--strip-components=1',
      '-xf',
      resolve(MELON_TMP_DIR, name),
      '-C',
      ENGINE_DIR,
    ].filter(Boolean) as string[],
    {
      shell: BASH_PATH,
    }
  )
  log.info(`Unpacked ${engine.name} source to ${ENGINE_DIR}`)
}

export function getSourceFilename(
  engine: EngineProfile,
  version: string
): string {
  return `${engine.sourceDirPrefix}${version}.source.tar.xz`
}

export function getReleaseUri(
  engine: EngineProfile,
  version: string,
  build: number,
  isCandidate = false
): string {
  const template = isCandidate
    ? engine.candidateUrlTemplate
    : engine.sourceUrlTemplate
  return template
    .replace(/\$\{version\}/g, version)
    .replace(/\$\{build\}/g, String(build))
}

async function downloadFirefoxSource(
  version: string,
  candidateBuild: number,
  isCandidate = false
) {
  const engine = getEngine()
  const filename = getSourceFilename(engine, version)
  const getReleaseUriForVersion = (build: string) => {
    let base = getReleaseUri(engine, version, Number(build), false)
    if (isCandidate) {
      console.log('Using candidate build')
      base = getReleaseUri(engine, version, candidateBuild, true)
    }
    return base
  }

  const fsParent = MELON_TMP_DIR
  const fsSaveLocation = resolve(fsParent, filename)

  log.info(`Locating ${engine.name} release ${version}...`)

  await ensureDirectory(dirname(fsSaveLocation))

  if (existsSync(fsSaveLocation)) {
    log.info('Using cached download')
    return filename
  }

  // Do not re-download if there is already an existing workspace present
  if (existsSync(ENGINE_DIR))
    log.error(
      `Workspace already exists.\nRemove that workspace and run |${bin_name} download ${version}| again.`
    )

  log.info(`Downloading ${engine.name} release ${version}...`)

  // Try to download the second build first, as it is more likely to be the
  // correct build
  const url = getReleaseUriForVersion(`build${candidateBuild}`)
  await downloadFileToLocation(url, resolve(MELON_TMP_DIR, filename))
  return filename
}

export async function downloadInternals({
  version,
  force,
  isCandidate = shouldUseCandidate(),
}: {
  version: string
  force?: boolean
  isCandidate?: boolean
}) {
  // Provide a legible error if there is no version specified
  if (!version) {
    log.error(
      `You have not specified a version of ${getEngine().name} in your config file. This is required to build a ${getEngine().name} fork.`
    )
    process.exit(1)
  }

  let candidateBuild = 1
  if (isCandidate) {
    version = config.version.candidate as string
    candidateBuild = config.version.candidateBuild as number
  }

  if (force && existsSync(ENGINE_DIR)) {
    log.info('Removing existing workspace')
    rmSync(ENGINE_DIR, { recursive: true })
  }

  // If the engine directory is empty, we should delete it.
  const engineIsEmpty =
    existsSync(ENGINE_DIR) &&
    (await readdir(ENGINE_DIR).then((files) => files.length === 0))
  if (engineIsEmpty) {
    log.info("'engine/' is empty, it...")
    rmSync(ENGINE_DIR, { recursive: true })
  }

  if (!existsSync(ENGINE_DIR)) {
    await setupFirefoxSource(version, candidateBuild, isCandidate)
  }

  for (const addon of getAddons()) {
    const downloadUrl = await resolveAddonDownloadUrl(addon)
    const downloadedXPI = await downloadAddon(downloadUrl, addon)

    await unpackAddon(downloadedXPI, addon)
    await generateAddonMozBuild(addon)
    await initializeAddon(addon)
  }

  await addAddonsToMozBuild(getAddons())

  if (!isCandidate) {
    config.version.version = version
  } else {
    config.version.candidate = version
  }
  writeFileSync(configPath, JSON.stringify(config, undefined, 2))
}
