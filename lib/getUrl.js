/**
 * Determine the URL to publish to.
 *
 * - the url defined in the plugin config overrides the one in the environment (if both exist)
 * - when in dry-run mode, here are the order of considered urls: webhookUrlDryRun, TEAMS_WEBHOOK_URL_DRY_RUN, webhookUrl, TEAMS_WEBHOOK_URL
 *
 * @param pluginConfig
 * @param context
 * @returns {String}
 */
module.exports = (pluginConfig, context) => {
  // extract data
  const notifyInDryRun = pluginConfig.notifyInDryRun ?? true
  const { dryRun } = context.options
  const {
    webhookUrl: urlConfig,
    webhookUrlDryRun: dryRunUrlConfig,
  } = pluginConfig
  const {
    TEAMS_WEBHOOK_URL: urlEnvironment,
    TEAMS_WEBHOOK_URL_DRY_RUN: dryRunUrlEnvironment,
  } = context.env

  if (dryRun && notifyInDryRun) {
    // handle dry-run mode
    if (dryRunUrlConfig) {
      return dryRunUrlConfig
    }

    if (!dryRunUrlConfig && dryRunUrlEnvironment) {
      return dryRunUrlEnvironment
    }

    if (!dryRunUrlConfig && !dryRunUrlEnvironment && urlConfig) {
      return urlConfig
    }

    if (!dryRunUrlConfig && !dryRunUrlEnvironment && !urlConfig && urlEnvironment) {
      return urlEnvironment
    }

    // all four urls cannot be undefined thanks to verifyCondition
  } else {
    // handle default mode
    return urlConfig ? urlConfig : urlEnvironment
  }
}
