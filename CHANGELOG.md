## [2.1.0](https://github.com/yllieth/semantic-release-ms-teams/compare/v2.0.2...v2.1.0) (2022-08-06)


### Features

* added webhookUrlDryRun option and TEAMS_WEBHOOK_URL_DRYRUN variable ([316518f](https://github.com/yllieth/semantic-release-ms-teams/commit/316518f50317d4c34ea17ac8259b16ecc2c9f86c))


### Miscellaneous Chores

* **dependencies:** downgraded required node version from 18 to 16 ([251612f](https://github.com/yllieth/semantic-release-ms-teams/commit/251612fb638c3b36fb448d6b6073654c7af0d4b3))
* **dependencies:** upgraded eslint to its latest 8.21.0 ([a2b6f5e](https://github.com/yllieth/semantic-release-ms-teams/commit/a2b6f5e482593fbe5ffa509de514f1f2da6f9602))


### Continuous Integration

* **semantic-release:** added semantic-release-ms-teams in the pipeline ([798260d](https://github.com/yllieth/semantic-release-ms-teams/commit/798260df598cafe61b65347b9f3a3bb3db3115dc))

## [2.0.2](https://github.com/yllieth/semantic-release-ms-teams/compare/v2.0.1...v2.0.2) (2022-08-04)


### Bug Fixes

* **ci:** publish on npm registry too ([#32](https://github.com/yllieth/semantic-release-ms-teams/issues/32)) ([9736752](https://github.com/yllieth/semantic-release-ms-teams/commit/97367522fc7cc083f2be269a7f318711b1bc6ed6))

## [2.0.1](https://github.com/yllieth/semantic-release-ms-teams/compare/v2.0.0...v2.0.1) (2022-08-03)


### Bug Fixes

* trigger a new release ([#31](https://github.com/yllieth/semantic-release-ms-teams/issues/31)) ([66ec7f0](https://github.com/yllieth/semantic-release-ms-teams/commit/66ec7f0db0400c8a6a686a898dd16d687475ba1a))

## [2.0.0](https://github.com/yllieth/semantic-release-ms-teams/compare/v1.2.1...v2.0.0) (2022-08-03)


### ⚠ BREAKING CHANGES

* added engine restriction to work on node 18+, npm 8+, yarn 2+ (dropping support of node 15)
* upgraded peerDependency over semantic-release to support v19
* rewrite for v2 (#29)

### Features

* rewrite for v2 ([#29](https://github.com/yllieth/semantic-release-ms-teams/issues/29)) ([7d9d432](https://github.com/yllieth/semantic-release-ms-teams/commit/7d9d4320dd47319f88df217f0fd2495eda515b94))
* rewrite for v2 ([#30](https://github.com/yllieth/semantic-release-ms-teams/issues/30)) ([9434882](https://github.com/yllieth/semantic-release-ms-teams/commit/943488234e97b2ca4995c913174de8a7cbd507e8))


### Documentation

* **readme:** added note about webHookUrl vs. TEAMS_WEBHOOK_URL ([640257d](https://github.com/yllieth/semantic-release-ms-teams/commit/640257d335b41ba70ca808d08007a0ced114ab29))


### Miscellaneous Chores

* update dependencies ([09b539b](https://github.com/yllieth/semantic-release-ms-teams/commit/09b539bb4c30df22131495d3737e427a00601ba7))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.1](https://github.com/yllieth/semantic-release-ms-teams/compare/v1.2.1-0...v1.2.1) (2021-05-08)

### [1.2.1-0](https://github.com/yllieth/semantic-release-ms-teams/compare/v1.2.0...v1.2.1-0) (2021-05-08)


### Bug Fixes

* handled conflict with @semantic-release/git plugin ([fcadfac](https://github.com/yllieth/semantic-release-ms-teams/commit/fcadfacce86fb1c79f21affccd9f121246e04c52)), closes [#20](https://github.com/yllieth/semantic-release-ms-teams/issues/20)
* success script isnt async ([38b4fca](https://github.com/yllieth/semantic-release-ms-teams/commit/38b4fcad5c22fa0a15f2a1acb690fd318b49b164)), closes [#12](https://github.com/yllieth/semantic-release-ms-teams/issues/12)

## [1.2.0](https://github.com/yllieth/semantic-release-ms-teams/compare/v1.1.0...v1.2.0) (2021-04-20)


### Features

* added the possibility to not have the list of contributors sent with the message ([815686c](https://github.com/yllieth/semantic-release-ms-teams/commit/815686c05a30adfb033bc5ca07d6f922518dc1bb))


### Bug Fixes

* use title and imageUrl from plugin config instead semantic-release config ([87b8436](https://github.com/yllieth/semantic-release-ms-teams/commit/87b8436670ab862a927cdceb461f27cfe075c960))


### Other

* updated success screenshot to show recent updates ([31d4b24](https://github.com/yllieth/semantic-release-ms-teams/commit/31d4b240a5da399034465c021515c3cf3ea413f5))

## [1.1.0](https://github.com/yllieth/semantic-release-ms-teams/compare/v1.0.0...v1.1.0) (2021-04-15)


### Features

* **success:** added contributors to the message ([4fb1120](https://github.com/yllieth/semantic-release-ms-teams/commit/4fb11206d7619dc7bfa76acb8a271fab609bf534))


### Bug Fixes

* **parsing:** improved section detection ([4580570](https://github.com/yllieth/semantic-release-ms-teams/commit/458057097d4ada557107e05ddfd4f1525a782223)), closes [#3](https://github.com/yllieth/semantic-release-ms-teams/issues/3)
* prevented crash when a section is empty ([3f6c536](https://github.com/yllieth/semantic-release-ms-teams/commit/3f6c536b226ab2ed8d906224767f7518232e840c)), closes [#6](https://github.com/yllieth/semantic-release-ms-teams/issues/6)


### Other

* **dependencies:** added standard-version to generate changelog ([35eb8f8](https://github.com/yllieth/semantic-release-ms-teams/commit/35eb8f8744ba11b8957d430dc8428caf442a0905))
* **readme:** added installation command ([2d27643](https://github.com/yllieth/semantic-release-ms-teams/commit/2d27643db9bb7b2e7ff7d8e4287909650b51ce28))
