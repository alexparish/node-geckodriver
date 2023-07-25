import cp from 'node:child_process'

import { download as downloadDriver } from './install.js'
import { hasAccess, parseParams } from './utils.js'
import { DEFAULT_HOSTNAME, log } from './constants.js'
import type { GeckodriverParameters } from './types.js'

export async function start (params: GeckodriverParameters) {
  let geckoDriverPath = process.env.GECKODRIVER_FILEPATH || params.customGeckoDriverPath
  if (!geckoDriverPath) {
    geckoDriverPath = await downloadDriver(params.geckoDriverVersion, params.cacheDir)
  }

  if (!(await hasAccess(geckoDriverPath))) {
    throw new Error('Failed to access Geckodriver, was it installed successfully?')
  }

  params.host = params.host || DEFAULT_HOSTNAME

  const args = parseParams(params)
  log.info(`Starting Geckodriver at ${geckoDriverPath} with params: ${args.join(' ')}`)
  return cp.spawn(geckoDriverPath, args)
}

export const download = downloadDriver
export * from './types.js'
