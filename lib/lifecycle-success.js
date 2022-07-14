const teamsify = require('./teamsify')

module.exports = (pluginConfig, context) => {
  const { logger, env } = context
  const { webhookUrl } = pluginConfig
  const url = webhookUrl || env.TEAMS_WEBHOOK_URL
  const headers = { 'Content-Type': 'application/json' }
  const body = JSON.stringify(teamsify(pluginConfig, context))

  fetch(url, { method: 'post', body, headers })
    .then(() => logger.log('Message sent to Microsoft Teams'))
    .catch((error) => logger.error('An error occurred while sending the message to Teams', error))
    .finally(() => {
      env.HAS_PREVIOUS_EXECUTION = true
    })
}
