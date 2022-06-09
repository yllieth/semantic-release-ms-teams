# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0-1](https://github.com/yllieth/semantic-release-ms-teams/compare/v2.0.0-0...v2.0.0-1) (2022-06-09)


### Other

* changed require to import ([9b52fd0](https://github.com/yllieth/semantic-release-ms-teams/commit/9b52fd0216d471ea7a4dedb626c8ee2f7b1f39eb))

## [2.0.0-0](https://github.com/yllieth/semantic-release-ms-teams/compare/v1.2.1...v2.0.0-0) (2022-06-03)


### ⚠ BREAKING CHANGES

* **dependencies:** since semantic-relase@19 dropped the support of node 15, I did the same in this plugin as I bumped the peerDependency of semantic-release. If you're still using node@15, consider using the version 1.x of the plugin.

### Other

* **dependencies:** update dependencies ([92568c4](https://github.com/yllieth/semantic-release-ms-teams/commit/92568c45fd8242b549e1b5d6a00a6785604f2f37))
* **readme:** added note about webHookUrl vs. TEAMS_WEBHOOK_URL ([640257d](https://github.com/yllieth/semantic-release-ms-teams/commit/640257d335b41ba70ca808d08007a0ced114ab29))
* update dependencies ([09b539b](https://github.com/yllieth/semantic-release-ms-teams/commit/09b539bb4c30df22131495d3737e427a00601ba7))

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
