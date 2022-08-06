const nodeFetch = require('node-fetch-commonjs').default
const teamsify = require('./teamsify')
const getUrl = require('./getUrl')

module.exports = async (pluginConfig, context) => {
  const { logger, env, options } = context
  const notifyInDryRun = pluginConfig.notifyInDryRun ?? true
  const url = getUrl(pluginConfig, context)
  const headers = { 'Content-Type': 'application/json' }
  let body
  let teamsifyError = false

  try {
    body = JSON.stringify(await teamsify(pluginConfig, context, options.dryRun && notifyInDryRun))
  } catch (e) {
    const message = 'An error occurred while parsing the release notes.'
    logger.error(message)
    logger.error(e)
    teamsifyError = true
  }

  if (!teamsifyError) {
    nodeFetch(url, { method: 'post', body, headers })
      .then(() => logger.log('Message sent to Microsoft Teams'))
      .catch((error) => logger.error('An error occurred while sending the message to Teams', error))
      .finally(() => {
        env.HAS_PREVIOUS_EXECUTION = true
      })
  }
}
