/* eslint-disable jest/no-conditional-expect */

const lifecycleVerifyConditions = require('../../lib/lifecycle-verify-conditions')

describe('lifecycleVerifyConditions', () => {
  let pluginConfig
  let context

  beforeEach(() => {
    pluginConfig = {
      webhookUrl: undefined,
      webhookUrlDryRun: undefined
    }
    context = {
      env: {
        TEAMS_WEBHOOK_URL: undefined,
        TEAMS_WEBHOOK_URL_DRYRUN: undefined
      },
      logger: {
        log: jest.fn()
      }
    }
  })

  it('throws an error if there are no webhook URL defined', () => {
    try {
      // act
      lifecycleVerifyConditions(pluginConfig, context)
    } catch (e) {
      // assert
      expect(e.name).toBe('AggregateError')
      expect(e.errors[0].message).toBe('Invalid WebHook URL')
    }

    // assume
    expect.assertions(2)
  })
  it('throws an error if the webhook URL from the plugin config is invalid (not a URL format)', () => {
    // arrange
    pluginConfig.webhookUrl = 'not an url'

    try {
      // act
      lifecycleVerifyConditions(pluginConfig, context)
    } catch (e) {
      // assert
      expect(e.name).toBe('AggregateError')
      expect(e.errors[0].message).toBe('Invalid WebHook URL')
    }

    // assume
    expect.assertions(2)
  })
  it('throws an error if the webhook URL from the environment variables is invalid (not a URL format)', () => {
    // arrange
    context.env.TEAMS_WEBHOOK_URL = 'not an url'

    try {
      // act
      lifecycleVerifyConditions(pluginConfig, context)
    } catch (e) {
      // assert
      expect(e.name).toBe('AggregateError')
      expect(e.errors[0].message).toBe('Invalid WebHook URL')
    }

    // assume
    expect.assertions(2)
  })
  it('throws an error if the webhook URL from the plugin config is invalid (empty string)', () => {
    // arrange
    pluginConfig.webhookUrl = ''

    try {
      // act
      lifecycleVerifyConditions(pluginConfig, context)
    } catch (e) {
      // assert
      expect(e.name).toBe('AggregateError')
      expect(e.errors[0].message).toBe('Invalid WebHook URL')
    }

    // assume
    expect.assertions(2)
  })
  it('throws an error if the webhook URL from the environment variables is invalid (empty string)', () => {
    // arrange
    context.env.TEAMS_WEBHOOK_URL = ''

    try {
      // act
      lifecycleVerifyConditions(pluginConfig, context)
    } catch (e) {
      // assert
      expect(e.name).toBe('AggregateError')
      expect(e.errors[0].message).toBe('Invalid WebHook URL')
    }

    // assume
    expect.assertions(2)
  })
  it('prints a message if both plugin config and environment variables define an url', () => {
    // arrange
    pluginConfig.webhookUrl = 'https://example.com'
    context.env.TEAMS_WEBHOOK_URL = 'https://example.com'

    // act
    lifecycleVerifyConditions(pluginConfig, context)

    // assert
    expect(context.logger.log).toHaveBeenCalledWith('We found 2 URLs to publish to, one in the plugin config, one in the environment. The one in the plugin config will prevail.')
  })
  it('throws an error if the webhook URL from the plugin config in dry run mode is invalid (not a URL format)', () => {
    // arrange
    pluginConfig.webhookUrlDryRun = 'not an url'

    try {
      // act
      lifecycleVerifyConditions(pluginConfig, context)
    } catch (e) {
      // assert
      expect(e.name).toBe('AggregateError')
      expect(e.errors[0].message).toBe('Invalid WebHook URL')
    }

    // assume
    expect.assertions(2)
  })
  it('throws an error if the webhook URL from the environment variables in dry run mode is invalid (not a URL format)', () => {
    // arrange
    context.env.TEAMS_WEBHOOK_URL_DRYRUN = 'not an url'

    try {
      // act
      lifecycleVerifyConditions(pluginConfig, context)
    } catch (e) {
      // assert
      expect(e.name).toBe('AggregateError')
      expect(e.errors[0].message).toBe('Invalid WebHook URL')
    }

    // assume
    expect.assertions(2)
  })
  it('throws an error if the webhook URL from the plugin config in dry run mode is invalid (empty string)', () => {
    // arrange
    pluginConfig.webhookUrlDryRun = ''

    try {
      // act
      lifecycleVerifyConditions(pluginConfig, context)
    } catch (e) {
      // assert
      expect(e.name).toBe('AggregateError')
      expect(e.errors[0].message).toBe('Invalid WebHook URL')
    }

    // assume
    expect.assertions(2)
  })
  it('throws an error if the webhook URL from the environment variables in dry run mode is invalid (empty string)', () => {
    // arrange
    context.env.TEAMS_WEBHOOK_URL_DRYRUN = ''

    try {
      // act
      lifecycleVerifyConditions(pluginConfig, context)
    } catch (e) {
      // assert
      expect(e.name).toBe('AggregateError')
      expect(e.errors[0].message).toBe('Invalid WebHook URL')
    }

    // assume
    expect.assertions(2)
  })
  it('prints a message if both plugin config and environment variables define an url to use in dry run mode', () => {
    // arrange
    pluginConfig.webhookUrl = 'https://example.com' // to avoid an error
    pluginConfig.webhookUrlDryRun = 'https://example.com'
    context.env.TEAMS_WEBHOOK_URL_DRYRUN = 'https://example.com'

    // act
    lifecycleVerifyConditions(pluginConfig, context)

    // assert
    expect(context.logger.log).toHaveBeenCalledWith('We found 2 URLs to publish to, one in the plugin config, one in the environment. The one in the plugin config will prevail.')
  })
  it('does not throw an error if the webhook URL is valid', () => {
    // arrange
    pluginConfig.webhookUrl = 'http://example.com'

    // act
    lifecycleVerifyConditions(pluginConfig, context)

    // assert
    expect(true).toBe(true)
  })
})
