const remark = require('remark')
const toMarkdown = require('mdast-util-to-markdown')

/**
 * Options passed to toMarkdown() to format the output
 *
 * @see https://github.com/syntax-tree/mdast-util-to-markdown#api
 */
const mdOptions = {
  bullet: '-',
  emphasis: '_',
}

/**
 * Analyze the JSON built by remark from the release notes markdown text, and return the position of the given title if
 * present, -1 otherwise
 *
 * This JSON looks like that:
 * {
 *   type: 'root',
 *   children: [
 *     { type: 'heading', depth: 1, children: [Array], position: [Object] },
 *     { type: 'heading', depth: 3, children: [Array], position: [Object] },                                : ### Bug Fixes
 *     { type: 'list', ordered: false, start: null, spread: false, children: [Array], position: [Object] }, : list of changes
 *     { type: 'heading', depth: 3, children: [Array], position: [Object] },                                : ### Features
 *     { type: 'list', ordered: false, start: null, spread: false, children: [Array], position: [Object] }, : list of changes
 *     { type: 'heading', depth: 3, children: [Array], position: [Object] },                                : BREAKING CHANGES
 *     { type: 'list', ordered: false, start: null, spread: false, children: [Array], position: [Object] }, : list of changes
 *     }
 *   ],
 *   position: { start: { line: 1, column: 1, offset: 0 }, end: { line: x, column: y, offset: z } }
 * }
 *
 * @param tree
 * @param title
 * @returns {number}
 */
const titlePosition = (tree, title) => {
  let position = -1
  tree.children.forEach((child, index) => {
    if (child.type === 'heading' && child.depth > 1 && child.children.length > 0) {
      child.children.forEach(grandChild => {
        if (grandChild.type === 'text' && grandChild.value === title) {
          position = index
        }
      })
    }
  })

  return position
}

/**
 * Analyze the JSON built by remark from the release notes markdown text, and return the markdown corresponding to the
 * Bug Fixes section of it.
 *
 * The Bug Fixes section, if present, is the first one. This function works on a subtree delimited by:
 * - start = the beginning of the tree
 * - end =
 *   - if present, the position of the Features section
 *   - if there is no Features section, and if present, the position of the BREAKING CHANGE section
 *   - else, the end of the tree
 *
 * @param tree A JSON object representing the markdown of the release notes
 * @returns {string} A markdown string
 */
const extractBugfixes = (tree) => {
  const bugfixesIndex = titlePosition(tree, 'Bug Fixes')
  let bugfixesTree = []

  if (bugfixesIndex > -1) {
    const featuresIndex = titlePosition(tree, 'Features')
    const breakingIndex = titlePosition(tree, 'BREAKING CHANGES')
    const start = bugfixesIndex
    let end = tree.children.length
    if (breakingIndex > -1) { end = breakingIndex }
    if (featuresIndex > -1) { end = featuresIndex } // must be after breakingIndex
    const subTree = tree.children.slice(start, end)
    if (subTree.length >= 1 && subTree[1].type === 'list') {
      // eslint-disable-next-line prefer-destructuring
      bugfixesTree = subTree[1]
    }
  }

  return toMarkdown({ type: 'root', children: [bugfixesTree] }, mdOptions)
}

/**
 * Analyze the JSON built by remark from the release notes markdown text, and return the markdown corresponding to the
 * Features section of it.
 *
 * The Features section, if present, is the second one. This function works on a subtree delimited by:
 * - start = the beginning of the Features section (a "heading" entry at the root, with the text "Features")
 * - end =
 *   - if present, the position of the BREAKING CHANGE section
 *   - else, the end of the tree
 *
 * @param tree A JSON object representing the markdown of the release notes
 * @returns {string} A markdown string
 */
const extractFeatures = (tree) => {
  const featuresIndex = titlePosition(tree, 'Features')
  let featuresTree = []

  if (featuresIndex > -1) {
    const breakingIndex = titlePosition(tree, 'BREAKING CHANGES')
    const start = featuresIndex
    let end = tree.children.length
    if (breakingIndex > -1) { end = breakingIndex }
    const subTree = tree.children.slice(start, end)
    if (subTree.length >= 1 && subTree[1].type === 'list') {
      // eslint-disable-next-line prefer-destructuring
      featuresTree = subTree[1]
    }
  }

  return toMarkdown({ type: 'root', children: [featuresTree] }, mdOptions)
}

/**
 * Analyze the JSON built by remark from the release notes markdown text, and return the markdown corresponding to the
 * BREAKING CHANGES section of it.
 *
 * The BREAKING CHANGES section, if present, is the last one. This function works on a subtree delimited by:
 * - start = the beginning of the BREAKING CHANGE section (a "heading" entry at the root, with the text "BREAKING CHANGE")
 * - end = the end of the tree
 *
 * @param tree A JSON object representing the markdown of the release notes
 * @returns {string} A markdown string
 */
const extractBreaking = (tree) => {
  const breakingIndex = titlePosition(tree, 'BREAKING CHANGES')
  let breakingTree = []

  if (breakingIndex > -1) {
    const start = breakingIndex
    const end = tree.children.length
    const subTree = tree.children.slice(start, end)
    if (subTree.length >= 1 && subTree[1].type === 'list') {
      // eslint-disable-next-line prefer-destructuring
      breakingTree = subTree[1]
    }
  }

  return toMarkdown({ type: 'root', children: [breakingTree] }, mdOptions)
}

const releaseSections = (context) => {
  const tree = remark.parse(context.nextRelease.notes)

  return {
    bugfixes: extractBugfixes(tree),
    features: extractFeatures(tree),
    breaking: extractBreaking(tree),
  }
}

/**
 * Return a JSON object meant to be sent to teams via a webhook. This object does not contain the details to the release
 * notes, but just the generic part.
 *
 * @see https://docs.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/cards-format?tabs=adaptive-md%2Cconnector-html#formatting-cards-with-markdown
 * @param context semantic-release plugin context
 * @returns {Object}
 */
const baseMessage = (context) => {
  const { nextRelease, lastRelease, commits, options } = context
  const repository = options.repositoryUrl.split('/').pop()
  const { title, imageUrl } = options

  const facts = []

  facts.push({ name: 'Version', value: `${nextRelease.gitTag} (${nextRelease.type})` })

  if (Object.keys(lastRelease).length > 0){
    facts.push({ name: 'Last Release', value: lastRelease.gitTag })
  }

  facts.push({ name: 'Commits', value: commits.length })

  if (commits.length > 0) {
    // prettier-ignore
    const contributors = commits
      .map(commit => commit.author.email)
      .reduce(
        (accumulator, email) => accumulator.add(email.substring(0, email.indexOf('@'))),
        new Set()
      )

    facts.push({ name: 'Contributors', value: Array.from(contributors).join(', ') })
  }

  return {
    '@type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    themeColor: 'FC6D27', // gitlab orange
    summary: title || 'A new version has been released',
    sections: [
      {
        activityTitle: `A new version has been released`,
        activitySubtitle: repository,
        activityImage: imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Gitlab_meaningful_logo.svg/144px-Gitlab_meaningful_logo.svg.png',
        facts,
        markdown: true
      },
      { text: '---' },
    ],
  }
}

module.exports = (context) => {
  const sections = releaseSections(context)
  const teamsMessage = baseMessage(context)

  if (sections.bugfixes) {
    teamsMessage.sections.push({ text: '## Bug Fixes' })
    teamsMessage.sections.push({ text: sections.bugfixes.replace('\n-', '\r-') })
  }

  if (sections.features) {
    teamsMessage.sections.push({ text: '## Features' })
    teamsMessage.sections.push({ text: sections.features.replace('\n-', '\r-') })
  }

  if (sections.breaking) {
    teamsMessage.sections.push({ text: '## Breaking Changes' })
    teamsMessage.sections.push({ text: sections.breaking.replace('\n-', '\r-') })
  }

  return teamsMessage
}
