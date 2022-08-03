/**
 * Handle conflict with @semantic-release/git which causes the message to be sent
 * twice.
 *
 * This plugin (@semantic-release/git) has the ability to add commits to the
 * current branch. By doing so, it re-triggers semantic-release if this commit
 * is made in the branch semantic-release is watching.
 *
 * This could cause a first message to be send to MS Teams by the "regular"
 * execution of semantic-release AND a second one triggered by the additional
 * execution of semantic-release.
 *
 * This function returns false if:
 * - @semantic-release/git is part of the active plugins
 * - an environment variable named `HAS_PREVIOUS_SEM_REL_EXECUTION` is true
 *
 * It's of course not the kind of edge case I want to reproduce, but I'm making
 * an exception for this commonly used, and official plugin.
 *
 * @see https://github.com/yllieth/semantic-release-ms-teams/issues/20
 * @param context
 * @returns {boolean}
 */
module.exports = (context) => {
  const { env, options, logger } = context

  // eslint-disable-next-line no-restricted-syntax
  for (const plugin of options.plugins) {
    const hasCustomGitPlugin =
      Array.isArray(plugin) && typeof plugin[0] === 'string' && plugin[0] === '@semantic-release/git'

    const hasDefaultGitPlugin = typeof plugin === 'string' && plugin === '@semantic-release/git'

    if ((hasDefaultGitPlugin || hasCustomGitPlugin) && env.HAS_PREVIOUS_SEM_REL_EXECUTION === true) {
      logger.warn(
        'The @semantic-release/git plugin has been detected, and it seems a message has already been sent to Teams. No other message will be issued.',
      )
      return false
    }
  }

  return true
}
