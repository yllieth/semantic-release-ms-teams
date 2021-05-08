const fetch = require('node-fetch')
const teamsify = require('./teamsify')

/**
 * Handle conflict with @semantic-release/git which causes the message to be sent twice.
 *
 * This plugin (@semantic-release/git) has the ability to add commits to the current branch. By doing so, it re-triggers
 * semantic-release if this commit is made in the branch semantic-release is watching.
 *
 * This could cause a first message to be send to MS Teams by the "regular" execution of semantic-release AND a second
 * one triggered by the additional execution of semantic-release. This function returns false if:
 * - @semantic-release/git is part of the active plugins
 * - an environment variable named `HAS_PREVIOUS_SEM_REL_EXECUTION` is set to true
 *
 * It's of course not the kind of edge case I want to reproduce, but I'm making an exception for this commonly used,
 * and official plugin.
 *
 * @see https://github.com/yllieth/semantic-release-ms-teams/issues/20
 * @param context
 * @returns {boolean}
 */
const canNotify = (context) => {
  const { env, options, logger } = context

  // eslint-disable-next-line no-restricted-syntax
  for (const plugin of options.plugins) {
    const hasStandardGitPlugin = Array.isArray(plugin)
      && typeof plugin[0] === 'string'
      && plugin[0] === '@semantic-release/git'
    const hasCustomGitPlugin = typeof plugin === 'string'
      && plugin === '@semantic-release/git'

    if ((hasStandardGitPlugin || hasCustomGitPlugin) && env.HAS_PREVIOUS_SEM_REL_EXECUTION === true) {
      logger.warn('The @semantic-release/git plugin has been detected, and it seems a message has already been sent to Teams. No other message will be issued.')
      return false
    }
  }

  return true
}

module.exports = (pluginConfig, context) => {
  if (canNotify(context)) {
    const { logger, env } = context
    const { webhookUrl } = pluginConfig
    const url = webhookUrl || env.TEAMS_WEBHOOK_URL
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify(teamsify(pluginConfig, context))

    fetch(url, { method: 'post', body, headers})
      .then(() => logger.log('Message sent to Microsoft Teams'))
      .catch((error) => logger.error('An error occurred while sending the message to Microsoft Teams', error))
      .finally(() => { env.HAS_PREVIOUS_EXECUTION = true })
  }
};
