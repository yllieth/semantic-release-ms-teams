// Analyzes your commit messages to determine the next semantic version.
const COMMIT_ANALYZER = ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }]

// Generates release notes based on the commit messages since the last release.
const RELEASE_NOTES_GENERATOR = [
  '@semantic-release/release-notes-generator',
  {
    preset: 'conventionalcommits',
    presetConfig: {
      types: [
        // there are no change in the following types
        { type: 'feat', section: 'Features', hidden: false },
        { type: 'fix', section: 'Bug Fixes', hidden: false },
        { type: 'perf', section: 'Performance Improvements', hidden: false },
        { type: 'revert', section: 'Reverts', hidden: false },

        // following types were hidden by default
        { type: 'docs', section: 'Documentation', hidden: false },
        { type: 'style', section: 'Styles', hidden: false },
        { type: 'refactor', section: 'Code Refactoring', hidden: false },
        { type: 'test', section: 'Tests', hidden: false },
        { type: 'ci', section: 'Continuous Integration', hidden: false },
        { type: 'build', section: 'Build System', hidden: false },
        { type: 'chore', section: 'Miscellaneous Chores', hidden: false },
      ],
    },
  },
]

// Creates and updates a CHANGELOG.md file based on the release notes generated.
const CHANGELOG = '@semantic-release/changelog'

// Updates the version in package.json and creates a tarball in the release directory
// based on the files specified in package.json. If the package isn’t marked as private
// in package.json, the new version of the package is published to NPM.
const NPM = [
  '@semantic-release/npm',
  {
    tarballDir: 'release',
  },
]

// Creates a GitHub release titled and tagged with the new version. The release notes
// are used in the description and the tarball created in the previous step is included
// as the release binary. It also adds a comment to any Issues and Pull Requests linked
// in the commit message.
const GITHUB = [
  '@semantic-release/github',
  {
    assets: 'release/*.tgz',
  },
]

// Commits the files modified in the previous steps (CHANGELOG.md, package.json, and
// package-lock.json) back to the repository. The commit is tagged with vMAJOR.MINOR.PATCH
// and the commit message body includes the generated release notes.
// Perform a git pull --rebase to get that commit locally.
const GIT = '@semantic-release/git'

// Publishes release note in a Teams channel (specified in the repository's secrets)
const TEAMS = 'semantic-release-ms-teams'

module.exports = {
  branches: ['main', { name: 'next', prerelease: true }],
  plugins: [COMMIT_ANALYZER, RELEASE_NOTES_GENERATOR, CHANGELOG, NPM, GITHUB, GIT, TEAMS],
}
