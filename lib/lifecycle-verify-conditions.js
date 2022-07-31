const AggregateError = require('aggregate-error')

/* eslint-disable no-useless-escape */
const URL_PATTERN =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/

/**
 * A method to verify that the user has given us an MS Teams webhook url to post
 * to, or adequately setup the plugin with an option.
 */
module.exports = (pluginConfig, context) => {
  const { env } = context
  const { webhookUrl: webhookUrlOption } = pluginConfig
  const { TEAMS_WEBHOOK_URL: webhookUrlVariable } = env

  const errors = []

  const webhookUrl = webhookUrlOption || webhookUrlVariable
  if (!webhookUrl || webhookUrl.length === 0 || URL_PATTERN.test(webhookUrl) === false) {
    errors.push('Invalid WebHook URL')
  }

  // Throw any errors we accumulated during the validation
  if (errors.length > 0) {
    throw new AggregateError(errors)
  }
}
