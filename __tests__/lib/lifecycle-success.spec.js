const lifecycleSuccess = require('../../lib/lifecycle-success')

const teamsify = require('../../lib/teamsify')
jest.mock('../../lib/teamsify')

describe('lifecycleSuccess', () => {
  let pluginConfig
  let context

  beforeEach(() => {
    pluginConfig = {
      notifyInDryRun: undefined,
      webhookUrl: undefined,
    }
    context = {
      env: {},
      options: {},
      logger: {
        log: jest.fn(),
        error: jest.fn(),
      },
    }
  })

  it('notifies Teams successfully using the URL from the config', async () => {
    // arrange
    const url = 'http://example.com'
    const teamsNotification = { foo: 'bar' }
    pluginConfig.webhookUrl = url
    context.options.dryRun = false
    global.fetch = jest.fn(() => Promise.resolve())
    teamsify.mockImplementation(() => teamsNotification)

    // act
    const result = await lifecycleSuccess(pluginConfig, context)
    await result

    // assert
    expect(teamsify).toHaveBeenCalledWith(pluginConfig, context, false)
    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'post',
      body: JSON.stringify(teamsNotification),
      headers: { 'Content-Type': 'application/json' },
    })
    expect(context.logger.log).toHaveBeenCalledWith('Message sent to Microsoft Teams')
    // expect(context.env.HAS_PREVIOUS_EXECUTION).toBe(true)
  })
  it('notifies Teams successfully using the URL from the environment variables', async () => {
    // arrange
    const url = 'http://example.com'
    const teamsNotification = { foo: 'bar' }
    context.env.TEAMS_WEBHOOK_URL = url
    context.options.dryRun = false
    global.fetch = jest.fn(() => Promise.resolve())
    teamsify.mockImplementation(() => teamsNotification)

    // act
    const result = await lifecycleSuccess(pluginConfig, context)
    await result

    // assert
    expect(teamsify).toHaveBeenCalledWith(pluginConfig, context, false)
    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'post',
      body: JSON.stringify(teamsNotification),
      headers: { 'Content-Type': 'application/json' },
    })
    expect(context.logger.log).toHaveBeenCalledWith('Message sent to Microsoft Teams')
    // expect(context.env.HAS_PREVIOUS_EXECUTION).toBe(true)
  })
  it('uses the URL from the plugin config when both are defined', async () => {
    // arrange
    const teamsNotification = { foo: 'bar' }
    pluginConfig.webhookUrl = 'http://example-a.com'
    context.env.TEAMS_WEBHOOK_URL = 'http://example-b.com'
    context.options.dryRun = false
    global.fetch = jest.fn(() => Promise.resolve())
    teamsify.mockImplementation(() => teamsNotification)

    // act
    const result = await lifecycleSuccess(pluginConfig, context)
    await result

    // assert
    expect(fetch).toHaveBeenCalledWith('http://example-a.com', {
      method: 'post',
      body: JSON.stringify(teamsNotification),
      headers: { 'Content-Type': 'application/json' },
    })
  })
  it('does not notify Teams when "teamsify" throw an error', async () => {
    // arrange
    const url = 'http://example.com'
    const teamsNotification = { foo: 'bar' }
    context.env.TEAMS_WEBHOOK_URL = url
    context.options.dryRun = true
    pluginConfig.notifyInDryRun = true
    global.fetch = jest.fn(() => Promise.resolve())
    teamsify.mockImplementation(() => {
      throw 'teamsify error'
    })

    // act
    const result = await lifecycleSuccess(pluginConfig, context)
    await result

    // assert
    expect(teamsify).toHaveBeenCalledWith(pluginConfig, context, true)
    expect(context.logger.error).toHaveBeenNthCalledWith(1, 'An error occurred while parsing the release notes.')
    expect(context.logger.error).toHaveBeenNthCalledWith(2, 'teamsify error')
    expect(fetch).not.toHaveBeenCalled()
  })
  it('handles an error while notifying Teams', async () => {
    // arrange
    const url = 'http://example.com'
    const teamsNotification = { foo: 'bar' }
    context.env.TEAMS_WEBHOOK_URL = url
    context.options.dryRun = false
    global.fetch = jest.fn(() => Promise.reject('Failed to fetch'))
    teamsify.mockImplementation(() => teamsNotification)

    // act
    const result = await lifecycleSuccess(pluginConfig, context)
    await result

    // assert
    expect(teamsify).toHaveBeenCalledWith(pluginConfig, context, false)
    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'post',
      body: JSON.stringify(teamsNotification),
      headers: { 'Content-Type': 'application/json' },
    })
    expect(context.logger.log).not.toHaveBeenCalled()
    expect(context.logger.error).toHaveBeenCalledWith(
      'An error occurred while sending the message to Teams',
      'Failed to fetch',
    )
    // expect(context.env.HAS_PREVIOUS_EXECUTION).toBe(true)
  })
})
