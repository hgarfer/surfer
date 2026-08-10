import { config } from '..'
import { getCurrentBrandName } from '../commands/package'
import { getEngine } from '../engines'
import { EngineProfile } from '../engines/types'
import { getFFVersionOrCandidate } from '../utils'

const otherBuildModes = `# You can change to other build modes by running:
#   $ surfer set buildMode [dev|debug|release]`

export const internalMozconfg = (
  brand: string,
  buildMode: 'dev' | 'debug' | 'release' | string,
  deps: {
    config?: typeof config
    currentBrandName?: string
    engine?: EngineProfile
  } = {}
) => {
  const cfg = deps.config ?? config
  const engine = deps.engine ?? getEngine()
  const brandName = deps.currentBrandName ?? getCurrentBrandName()

  let buildOptions = `# Unknown build mode ${buildMode}`

  // Get the specific build options for the current build mode
  switch (buildMode) {
    case 'dev': {
      buildOptions = `# Development build settings
${otherBuildModes}
ac_add_options --disable-debug`
      break
    }
    case 'debug': {
      buildOptions = `# Debug build settings
${otherBuildModes}
ac_add_options --enable-debug
ac_add_options --disable-optimize`
      break
    }

    case 'release': {
      buildOptions = `# Release build settings
ac_add_options --disable-debug
ac_add_options --enable-optimize
ac_add_options --enable-rust-simd`
      break
    }
  }

  // Emits nothing for an empty projectFlags array so the firefox output stays
  // byte-identical to the previous hardcoded template
  const projectFlagsBlock =
    engine.projectFlags.length > 0
      ? `${engine.projectFlags
          .map((flag) => `ac_add_options ${flag}`)
          .join('\n')}\n\n`
      : ''

  const appVersion = deps.config
    ? deps.config.version.candidate ?? deps.config.version.version
    : getFFVersionOrCandidate()

  return (
    `
# =====================
# Internal surfer config
# =====================

${buildOptions}

${projectFlagsBlock}# Custom branding
ac_add_options --with-branding=${engine.brandingPath}/${brand}

# Config for updates
ac_add_options --enable-update-channel=${brand}

export ACCEPTED_MAR_CHANNEL_IDS=${brand}
export MAR_CHANNEL_ID=${brand}

mk_add_options ACCEPTED_MAR_CHANNEL_IDS=${brand}

export ${engine.appVersionEnvName}=${appVersion}
export MOZ_APPUPDATE_HOST=${
      cfg.updateHostname || 'localhost:7648 # This should not resolve'
    }
` +
    ((process as any).surferPlatform === 'darwin'
      ? `

# MacOS specific settings
export MOZ_MACBUNDLE_NAME="${brandName}.app"
  `
      : '')
  )
}
