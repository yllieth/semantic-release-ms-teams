/* eslint-disable jest/no-conditional-expect */

const lifecycleVerifyConditions = require('../../lib/lifecycle-verify-conditions')

describe('lifecycleVerifyConditions', () => {
  let pluginConfig
  let context

  beforeEach(() => {
    pluginConfig = { webhookUrl: undefined }
    context = { env: { TEAMS_WEBHOOK_URL: undefined } }
  })

  it('throws an error if there are no webhook URL defined', () => {
    try {
      // act
      lifecycleVerifyConditions(pluginConfig, context)
    } catch (e) {
      // assert
      expect(e.name).toBe('AggregateError')
      expect(e._errors[0].message).toBe('Invalid WebHook URL')
    }

    // assume
    expect.assertions(2)
  })
  it('throws an error if the webhook URL is invalid (not a URL format)', () => {
    // arrange
    pluginConfig.webhookUrl = 'not an url'

    try {
      // act
      lifecycleVerifyConditions(pluginConfig, context)
    } catch (e) {
      // assert
      expect(e.name).toBe('AggregateError')
      expect(e._errors[0].message).toBe('Invalid WebHook URL')
    }

    // assume
    expect.assertions(2)
  })
  it('throws an error if the webhook URL is invalid (empty string)', () => {
    // arrange
    pluginConfig.webhookUrl = ''

    try {
      // act
      lifecycleVerifyConditions(pluginConfig, context)
    } catch (e) {
      // assert
      expect(e.name).toBe('AggregateError')
      expect(e._errors[0].message).toBe('Invalid WebHook URL')
    }

    // assume
    expect.assertions(2)
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
