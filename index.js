const lifecycleVerifyConditions = require('./lib/lifecycle-verify-conditions')
const lifecycleSuccess = require('./lib/lifecycle-success')
const canNotify = require('./lib/canNotify')

let verified
const verifyConditions = (pluginConfig, context) => {
  lifecycleVerifyConditions(pluginConfig, context)
  verified = true
}

const success = (pluginConfig, context) => {
  if (verified && canNotify(context)) {
    await lifecycleSuccess(pluginConfig, context)
  }
}

module.exports = { verifyConditions, success }
