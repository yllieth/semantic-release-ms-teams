/* eslint-disable-next-line no-useless-escape */
const urlPattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
let webhookUrl = ''

/**
 * A method to verify that the user has given us a teams webhook url to post to
 */
module.exports = async (pluginConfig, context) => {
  const { env } = context
  const { webhookUrl: webhookUrlOption } = pluginConfig
  const { TEAMS_WEBHOOK_URL: webhookUrlVariable } = env
  const errors = []

  webhookUrl = webhookUrlOption || webhookUrlVariable
  if (!webhookUrl || webhookUrl.length === 0 || urlPattern.test(webhookUrl) === false) {
    errors.push('Invalid WebHook URL')
  }

  // Throw any errors we accumulated during the validation
  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }
};
