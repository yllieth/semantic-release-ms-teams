const lifecycleVerifyConditions = require('./lib/lifecycle-verify-conditions')
const lifecycleSuccess = require('./lib/lifecycle-success')
const canNotify = require('./lib/canNotify')

let verified = false

/**
 * Ensures the presence of the webhook URL to publish to.
 */
const verifyConditions = (pluginConfig, context) => {
  lifecycleVerifyConditions(pluginConfig, context)
  verified = true
}

/**
 * Support dry-run mode by eventually sending release notes to MS Team.
 */
const generateNotes = async (pluginConfig, context) => {
  const { options } = context
  const isDryRunMode = options.dryRun === true
  const notifyInDryRun = pluginConfig.notifyInDryRun ?? true

  if (isDryRunMode && notifyInDryRun) {
    await success(pluginConfig, context)
  }
}

/**
 * Send release note to MS Teams
 *
 * This step will be skipped in dry-run mode.
 */
const success = async (pluginConfig, context) => {
  if (verified && canNotify(context)) {
    await lifecycleSuccess(pluginConfig, context)
  }
}

module.exports = { verifyConditions, generateNotes, success }
