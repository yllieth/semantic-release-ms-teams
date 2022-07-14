let remark, toMarkdown

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
 * Return a JSON object meant to be sent to teams via a webhook. This object does not contain the details to the release
 * notes, but just the generic part.
 *
 * @see https://docs.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/cards-format?tabs=adaptive-md%2Cconnector-html#formatting-cards-with-markdown
 */
const baseMessage = (pluginConfig, context, isDryRunMode) => {
  const { nextRelease, lastRelease, commits, options, logger } = context
  const repository = options.repositoryUrl.split('/').pop()
  const { title, imageUrl, showContributors } = pluginConfig

  const facts = []
  let summary, nextVersion

  if (isDryRunMode) {
    logger.info('Sending release notes in dry-run mode. Set "notifyInDryRun" option to false to disable.')
    summary = "[DRY-RUN MODE] This is a preview of the next release's content"
    nextVersion = `${nextRelease.type} version bump`
  } else {
    summary = title || 'A new version has been released'
    nextVersion = `${nextRelease.gitTag} (${nextRelease.type})`
  }

  facts.push({
    name: 'Version',
    value: nextVersion,
  })

  if (Object.keys(lastRelease).length > 0) {
    facts.push({ name: 'Last Release', value: lastRelease.gitTag })
  }

  facts.push({ name: 'Commits', value: commits.length })

  if (commits.length > 0 && (showContributors || showContributors === undefined)) {
    // prettier-ignore
    const contributors = commits
      .map(commit => commit.author.email)
      .reduce(
        (accumulator, email) => accumulator.add(email.substring(0, email.indexOf('@'))),
        new Set()
      )

    facts.push({
      name: 'Contributors',
      value: Array.from(contributors).join(', '),
    })
  }

  return {
    '@type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    themeColor: 'FC6D27', // gitlab orange
    summary,
    sections: [
      {
        activityTitle: summary,
        activitySubtitle: repository,
        activityImage:
          imageUrl ||
          'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Gitlab_meaningful_logo.svg/144px-Gitlab_meaningful_logo.svg.png',
        facts,
        markdown: true,
      },
    ],
  }
}

/**
 * Converts the markdown text of the release notes into a JSON object, and go over it to extract sections (title with
 * version number is ignored).
 *
 * Here is an example of a tree:
 *
 * {
 *   type: 'root',
 *   children: [
 *     { type: 'heading', depth: 2, children: [], position: {} },                                                      // >> ignored
 *     { type: 'heading', depth: 3, children: [{ type: 'text', value: 'Bug Fixes', position: {}}], position: {} },     // >> extract children's value
 *     { type: 'list', ..., children: [], position: {} },                                                              // >> convert into markdown
 *     { type: 'heading', depth: 3, children: [{ type: 'text', value: 'Features', position: {}}], position: {} },      // >> extract children's value
 *     { type: 'list', ..., children: [], position: {} },                                                              // >> convert into markdown
 *   ]
 * }
 *
 * The result will be:
 *
 * [
 *   { name: 'Bug Fixes', changes: '...'},
 *   { name: 'Features', changes: '...'},
 * ]
 */
const extractSections = (context) => {
  const tree = remark.parse(context.nextRelease.notes)
  const sections = []

  /* eslint-disable-next-line no-plusplus */
  for (let i = 0; i < tree.children.length - 1; i++) {
    const child = tree.children[i]
    const nextChild = tree.children[i + 1]
    if (
      child.type === 'heading' &&
      child.depth === 3 &&
      child.children[0].type === 'text' && // child is a section
      nextChild.type === 'list' &&
      nextChild.children.length > 0 // next child is a list of changes
    ) {
      sections.push({
        name: child.children[0].value,
        changes: toMarkdown({ type: 'root', children: [nextChild] }, mdOptions),
      })
    }
  }

  return sections
}

module.exports = async (pluginConfig, context, isDryRunMode) => {
  try {
    // semantic-release 19 does not support natively ESM, and "remark" / "mdast-util-to-markdown" are ESM only packages.
    // The way to import ES modules in commonJS is by using dynamic imports.
    remark = await import('remark').then((lazyModule) => lazyModule.remark)
    toMarkdown = await import('mdast-util-to-markdown').then((lazyModule) => lazyModule.toMarkdown)
  } catch (e) {
    throw new Error('Unable to load dependencies [remark, mdast-util-to-markdown]')
  }

  const sections = extractSections(context)
  const teamsMessage = baseMessage(pluginConfig, context, isDryRunMode)

  if (sections.length > 0) {
    teamsMessage.sections.push({ text: '---' })
  }

  sections.forEach((section) => {
    teamsMessage.sections.push({ text: `## ${section.name}` })
    teamsMessage.sections.push({ text: section.changes.replace('\n-', '\r-') })
  })

  return teamsMessage
}
