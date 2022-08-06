const lifecycleSuccess = require('../../lib/lifecycle-success')

const fetch = require('node-fetch-commonjs')
jest.mock('node-fetch-commonjs')

const teamsify = require('../../lib/teamsify')
jest.mock('../../lib/teamsify')

const getUrl = require('../../lib/getUrl')
jest.mock('../../lib/getUrl')

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
    getUrl.mockImplementation(() => 'https://example.com')
  })

  it('notifies Teams successfully', async () => {
    // arrange
    context.options.dryRun = false
    const teamsNotification = { foo: 'bar' }
    fetch.mockImplementation(() => Promise.resolve())
    teamsify.mockImplementation(() => teamsNotification)

    // act
    const result = await lifecycleSuccess(pluginConfig, context)
    await result

    // assert
    expect(getUrl).toHaveBeenCalledWith(pluginConfig, context)
    expect(teamsify).toHaveBeenCalledWith(pluginConfig, context, false)
    expect(fetch).toHaveBeenCalledWith('https://example.com', {
      method: 'post',
      body: JSON.stringify(teamsNotification),
      headers: { 'Content-Type': 'application/json' },
    })
  })
  it('does not notify Teams when "teamsify" throw an error', async () => {
    // arrange
    context.options.dryRun = true
    pluginConfig.notifyInDryRun = true
    fetch.mockImplementation(() => Promise.resolve())
    teamsify.mockImplementation(() => {
      throw 'teamsify error'
    })

    // act
    const result = await lifecycleSuccess(pluginConfig, context)
    await result

    // assert
    expect(getUrl).toHaveBeenCalledWith(pluginConfig, context)
    expect(teamsify).toHaveBeenCalledWith(pluginConfig, context, true)
    expect(context.logger.error).toHaveBeenNthCalledWith(1, 'An error occurred while parsing the release notes.')
    expect(context.logger.error).toHaveBeenNthCalledWith(2, 'teamsify error')
    expect(fetch).not.toHaveBeenCalled()
  })
  it('handles an error while notifying Teams', async () => {
    // arrange
    const teamsNotification = { foo: 'bar' }
    context.options.dryRun = false
    fetch.mockImplementation(() => Promise.reject('Failed to fetch'))
    teamsify.mockImplementation(() => teamsNotification)

    // act
    const result = await lifecycleSuccess(pluginConfig, context)
    await result

    // assert
    expect(teamsify).toHaveBeenCalledWith(pluginConfig, context, false)
    expect(fetch).toHaveBeenCalledWith('https://example.com', {
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
