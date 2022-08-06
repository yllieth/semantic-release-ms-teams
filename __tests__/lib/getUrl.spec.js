const getUrl = require('../../lib/getUrl')

describe('getUrl', () => {
  let webhookUrl
  let webhookUrlDryRun
  let TEAMS_WEBHOOK_URL
  let TEAMS_WEBHOOK_URL_DRY_RUN

  beforeEach(() => {
    webhookUrl = 'webhookUrl'
    webhookUrlDryRun = 'webhookUrlDryRun'
    TEAMS_WEBHOOK_URL = 'TEAMS_WEBHOOK_URL'
    TEAMS_WEBHOOK_URL_DRY_RUN = 'TEAMS_WEBHOOK_URL_DRY_RUN'
  })

  // dry run mode
  it('returns the dry run URL from the pluginConfig in dry run mode', () => {
    // arrange
    const pluginConfig = { notifyInDryRun: true, webhookUrlDryRun }
    const context = {
      env: {},
      options: { dryRun: true }
    }

    // act
    const result = getUrl(pluginConfig, context)

    // assert
    expect(result).toBe('webhookUrlDryRun')
  })
  it('returns the dry run URL from the environment in dry run mode', () => {
    // arrange
    const pluginConfig = { notifyInDryRun: true }
    const context = {
      env: { TEAMS_WEBHOOK_URL_DRY_RUN },
      options: { dryRun: true }
    }

    // act
    const result = getUrl(pluginConfig, context)

    // assert
    expect(result).toBe('TEAMS_WEBHOOK_URL_DRY_RUN')
  })
  it('returns the default URL from the pluginConfig in dry run mode', () => {
    // arrange
    const pluginConfig = { notifyInDryRun: true, webhookUrl}
    const context = {
      env: {},
      options: { dryRun: true }
    }

    // act
    const result = getUrl(pluginConfig, context)

    // assert
    expect(result).toBe('webhookUrl')
  })
  it('returns the default URL from the environment in dry run mode', () => {
    // arrange
    const pluginConfig = { notifyInDryRun: true }
    const context = {
      env: { TEAMS_WEBHOOK_URL },
      options: { dryRun: true }
    }

    // act
    const result = getUrl(pluginConfig, context)

    // assert
    expect(result).toBe('TEAMS_WEBHOOK_URL')
  })

  // dry run mode with notifyInDryRun set to false
  it('returns the default URL from the pluginConfig in dry run mode when notifications are explicitly disabled', () => {
    // arrange
    const pluginConfig = { notifyInDryRun: false, webhookUrl }
    const context = {
      env: {},
      options: { dryRun: true }
    }

    // act
    const result = getUrl(pluginConfig, context)

    // assert
    expect(result).toBe('webhookUrl')
  })
  it('returns the default URL from the environment in dry run mode when notifications are explicitly disabled', () => {
    // arrange
    const pluginConfig = { notifyInDryRun: false }
    const context = {
      env: { TEAMS_WEBHOOK_URL },
      options: { dryRun: true }
    }

    // act
    const result = getUrl(pluginConfig, context)

    // assert
    expect(result).toBe('TEAMS_WEBHOOK_URL')
  })

  // dry run mode with notifyInDryRun omitted
  it('returns the dry run URL from the pluginConfig in dry run mode when notifyInDryRun is not defined', () => {
    // arrange
    const pluginConfig = { webhookUrlDryRun }
    const context = {
      env: {},
      options: { dryRun: true }
    }

    // act
    const result = getUrl(pluginConfig, context)

    // assert
    expect(result).toBe('webhookUrlDryRun')
  })
  it('returns the dry run URL from the environment in dry run mode when notifyInDryRun is not defined', () => {
    // arrange
    const pluginConfig = {}
    const context = {
      env: { TEAMS_WEBHOOK_URL_DRY_RUN },
      options: { dryRun: true }
    }

    // act
    const result = getUrl(pluginConfig, context)

    // assert
    expect(result).toBe('TEAMS_WEBHOOK_URL_DRY_RUN')
  })
  it('returns the default URL from the pluginConfig in dry run mode when notifyInDryRun is not defined', () => {
    // arrange
    const pluginConfig = { webhookUrl}
    const context = {
      env: {},
      options: { dryRun: true }
    }

    // act
    const result = getUrl(pluginConfig, context)

    // assert
    expect(result).toBe('webhookUrl')
  })
  it('returns the default URL from the environment in dry run mode when notifyInDryRun is not defined', () => {
    // arrange
    const pluginConfig = {}
    const context = {
      env: { TEAMS_WEBHOOK_URL },
      options: { dryRun: true }
    }

    // act
    const result = getUrl(pluginConfig, context)

    // assert
    expect(result).toBe('TEAMS_WEBHOOK_URL')
  })

  // default mode
  it('returns the default URL from the pluginConfig in default mode', () => {
    // arrange
    const pluginConfig = { notifyInDryRun: true, webhookUrl }
    const context = {
      env: {},
      options: { dryRun: false }
    }

    // act
    const result = getUrl(pluginConfig, context)

    // assert
    expect(result).toBe('webhookUrl')
  })
  it('returns the default URL from the environment in default mode', () => {
    // arrange
    const pluginConfig = { notifyInDryRun: true }
    const context = {
      env: { TEAMS_WEBHOOK_URL },
      options: { dryRun: false }
    }

    // act
    const result = getUrl(pluginConfig, context)

    // assert
    expect(result).toBe('TEAMS_WEBHOOK_URL')
  })
})
