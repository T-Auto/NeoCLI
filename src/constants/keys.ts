import { isEnvTruthy } from '../utils/envUtils.js'

// Lazy read so ENABLE_GROWTHBOOK_DEV from globalSettings.env (applied after
// module load) is picked up. USER_TYPE is a build-time define so it's safe.
export function getGrowthBookClientKey(): string {
  const useExperimentalClientKey =
    isEnvTruthy(process.env.CLAUDE_CODE_EXPERIMENTAL_BUILD) ||
    (process.env.USER_TYPE === 'ant' &&
      isEnvTruthy(process.env.ENABLE_GROWTHBOOK_DEV))

  if (useExperimentalClientKey) {
    return '' // GrowthBook disabled in NeoCLI
  }

  return '' // GrowthBook disabled in NeoCLI
}
