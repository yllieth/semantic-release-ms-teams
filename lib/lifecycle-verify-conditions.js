const SemanticReleaseError = require('@semantic-release/error')

/* eslint-disable no-useless-escape */
const URL_PATTERN =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/

const DUPLICATE_URL_MESSAGE = 'We found 2 URLs to publish to, one in the plugin config, one in the environment. The one in the plugin config will prevail.'

/**
 * A method to verify that the user has given us an MS Teams webhook url to post
 * to, or adequately setup the plugin with an option.
 */
module.exports = (pluginConfig, context) => {
  const { env, logger } = context
  const { webhookUrl: urlOption, webhookUrlDryRun: dryRunUrlOption } = pluginConfig
  const { TEAMS_WEBHOOK_URL: urlEnvironment, TEAMS_WEBHOOK_URL_DRYRUN: dryRunUrlEnvironment } = env

  const errors = []

  // validate URL
  const url = urlOption || urlEnvironment
  if (!url || url.length === 0 || URL_PATTERN.test(url) === false) {
    errors.push('Invalid WebHook URL')
  }

  if (URL_PATTERN.test(urlOption) && URL_PATTERN.test(urlEnvironment)) {
    logger.log(DUPLICATE_URL_MESSAGE)
  }

  // validate dry run URL
  const dryRunUrl = dryRunUrlOption || dryRunUrlEnvironment
  if (dryRunUrl && URL_PATTERN.test(dryRunUrl) === false) {
    errors.push('Invalid WebHook URL for dryRun execution')
  }

  if (URL_PATTERN.test(dryRunUrl) && URL_PATTERN.test(dryRunUrlEnvironment)) {
    logger.log(DUPLICATE_URL_MESSAGE)
  }

  // Throw any errors we accumulated during the validation
  if (errors.length > 0) {
    throw new AggregateError(errors.map((message) => new SemanticReleaseError(message)))
    //    throw new SemanticReleaseError(...errors)
  }
}
