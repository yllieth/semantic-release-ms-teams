const { verifyConditions, generateNotes, success } = require('../index')

const lifecycleVerifyConditions = require('../lib/lifecycle-verify-conditions')
jest.mock('../lib/lifecycle-verify-conditions', () => jest.fn())

const lifecycleSuccess = require('../lib/lifecycle-success')
jest.mock('../lib/lifecycle-success', () => jest.fn())

const canNotify = require('../lib/canNotify')
jest.mock('../lib/canNotify', () => jest.fn())

describe('index', () => {
  describe('verifyConditions', () => {
    it('should call verifyCondition lifecycle function', () => {
      // act
      verifyConditions('pluginConfig', 'context')

      // assert
      expect(lifecycleVerifyConditions).toHaveBeenCalledWith('pluginConfig', 'context')
    })
  })

  describe('generatesNotes', () => {
    it('does nothing if not in dry run and notifyInDryRun option is false', async () => {
      // arrange
      const pluginConfig = { notifyInDryRun: false }
      const context = { options: { dryRun: false } }

      // act
      await generateNotes(pluginConfig, context)

      // assert
      expect(canNotify).not.toHaveBeenCalled()
      expect(lifecycleSuccess).not.toHaveBeenCalled()
    })
    it('does nothing if not in dry run and notifyInDryRun option is true', async () => {
      // arrange
      const pluginConfig = { notifyInDryRun: true }
      const context = { options: { dryRun: false } }

      // act
      await generateNotes(pluginConfig, context)

      // assert
      expect(canNotify).not.toHaveBeenCalled()
      expect(lifecycleSuccess).not.toHaveBeenCalled()
    })
    it('does nothing if not in dry run and notifyInDryRun option is undefined/omitted', async () => {
      // arrange
      const pluginConfig = {}
      const context = { options: { dryRun: false } }

      // act
      await generateNotes(pluginConfig, context)

      // assert
      expect(canNotify).not.toHaveBeenCalled()
      expect(lifecycleSuccess).not.toHaveBeenCalled()
    })
    it('does nothing, even in dry run when notifyInDryRun option is false', async () => {
      // arrange
      const pluginConfig = { notifyInDryRun: false }
      const context = { options: { dryRun: true } }

      // act
      await generateNotes(pluginConfig, context)

      // assert
      expect(canNotify).not.toHaveBeenCalled()
      expect(lifecycleSuccess).not.toHaveBeenCalled()
    })
    it('calls the success step of the lifecycle (to notify Teams when in DryRun mode)', async () => {
      // arrange
      const pluginConfig = {}
      const context = { options: { dryRun: true } }

      // act
      await generateNotes(pluginConfig, context)

      // assert
      expect(canNotify).toHaveBeenCalledWith(context)
      expect(lifecycleSuccess).not.toHaveBeenCalled()
    })
  })

  describe('success', () => {
    it('does nothing if the Verify Conditions step of the lifecycle returned false', async () => {
      // arrange
      jest.mock('../lib/canNotify', () => true)
      const pluginConfig = {}
      const context = {}

      // act
      await success(pluginConfig, context)

      // assert
      expect(lifecycleSuccess).not.toHaveBeenCalled()
    })
    it('does nothing if canNotify prevents a duplicated notification', async () => {
      // arrange
      jest.mock('../lib/canNotify', () => false)
      const pluginConfig = {}
      const context = {}

      // act
      verifyConditions(pluginConfig, context) // verified === true
      await success(pluginConfig, context)

      // assert
      expect(lifecycleSuccess).not.toHaveBeenCalled()
    })
    it('notifies Teams if everything is green', async () => {
      // arrange
      canNotify.mockImplementation(() => true)
      // jest.mock('../lib/canNotify', () => jest.fn(() => true))
      const pluginConfig = {}
      const context = {}

      // act
      verifyConditions(pluginConfig, context) // verified === true
      await success(pluginConfig, context)

      // assert
      expect(lifecycleSuccess).toHaveBeenCalledWith(pluginConfig, context)
    })
  })
})
