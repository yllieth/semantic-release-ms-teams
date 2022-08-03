const canNotify = require('../../lib/canNotify')

describe('canNotify', () => {
  let context

  beforeEach(() => {
    context = {
      env: {},
      options: {
        plugins: [],
      },
      logger: {
        warn: jest.fn(),
      },
    }
  })

  it('returns true if @semantic-release/git plugin is not in defined', () => {
    // arrange
    context.options.plugins = ['@semantic-release/commit-analyzer', ['@semantic-release/release-notes-generator', {}]]

    // act
    const result = canNotify(context)

    // assert
    expect(result).toBe(true)
  })
  it('returns true if @semantic-release/git plugin is present (without custom settings), but has not re-triggered semantic release', () => {
    // arrange
    context.options.plugins = ['@semantic-release/git']
    context.env.HAS_PREVIOUS_SEM_REL_EXECUTION = undefined

    // act
    const result = canNotify(context)

    // assert
    expect(result).toBe(true)
  })
  it('returns true if @semantic-release/git plugin is present (with custom settings), but has not re-triggered semantic release', () => {
    // arrange
    context.options.plugins = [['@semantic-release/git', { foo: 'bar' }]]
    context.env.HAS_PREVIOUS_SEM_REL_EXECUTION = undefined

    // act
    const result = canNotify(context)

    // assert
    expect(result).toBe(true)
  })
  it('returns false if @semantic-release/git is re-triggering semantic release', () => {
    // arrange
    context.options.plugins = ['@semantic-release/git']
    context.env.HAS_PREVIOUS_SEM_REL_EXECUTION = true

    // act
    const result = canNotify(context)

    // assert
    expect(result).toBe(false)
    expect(context.logger.warn).toHaveBeenCalledWith(
      'The @semantic-release/git plugin has been detected, and it seems a message has already been sent to Teams. No other message will be issued.',
    )
  })
})
