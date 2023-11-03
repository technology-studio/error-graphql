## [3.0.2](https://github.com/technology-studio/error-graphql/compare/v3.0.1...v3.0.2) (2023-11-03)


### Bug fixes

* trigger publish ([#122](https://github.com/technology-studio/error-graphql/issues/122)) ([955954d](https://github.com/technology-studio/error-graphql/commit/955954d225ffc3b9e32636b79b7e9948a7211208))

## [3.0.1](https://github.com/technology-studio/error-graphql/compare/v3.0.0...v3.0.1) (2023-11-03)


### Bug fixes

* change build target to es2020 and sync recent changes from boilerplate ([#121](https://github.com/technology-studio/error-graphql/issues/121)) ([be9e452](https://github.com/technology-studio/error-graphql/commit/be9e452e1b2fb89ebc7d3e30ced60a9c92cd9997))

## [3.0.0](https://github.com/technology-studio/error-graphql/compare/v2.0.8...v3.0.0) (2023-10-16)


### ⚠ BREAKING CHANGES

* **deps:** migrate to @apollo/server ^4.0.0, refactor errors structrure and error codes. 

* chore(deps): replace dependency apollo-server with @apollo/server ^4.0.0

* refactor: migrate to @apollo/server

* refactor: migrate format error

* test: migrate all tests to new @apollo/server and update createError and formatError accordingly

* fix: add missing export of interface

* chore: sync with master

### Features

* **deps:** replace dependency apollo-server with @apollo/server ^4.0.0 ([#100](https://github.com/technology-studio/error-graphql/issues/100)) ([d6e0470](https://github.com/technology-studio/error-graphql/commit/d6e047011cf80b2976fc069f20a83bc11720eda4))


### Testing

* add integration tests for formatError ([#99](https://github.com/technology-studio/error-graphql/issues/99)) ([e81c4b7](https://github.com/technology-studio/error-graphql/commit/e81c4b70ea129d47ed453bc40d98b46305ffc410))
* switch to inline jest snapshots ([#103](https://github.com/technology-studio/error-graphql/issues/103)) ([6891001](https://github.com/technology-studio/error-graphql/commit/68910013e340295377ef5b2418580c4b60d43266))

## [2.0.8](https://github.com/technology-studio/error-graphql/compare/v2.0.7...v2.0.8) (2023-09-20)


### Bug fixes

* **deps:** update dependency @txo/log to ^2.0.13 ([1b17ccc](https://github.com/technology-studio/error-graphql/commit/1b17ccc0e47097d84cd67f9dd2be7ce25aec9bf2))

## [2.0.7](https://github.com/technology-studio/error-graphql/compare/v2.0.6...v2.0.7) (2023-09-20)


### Bug fixes

* recreate yarn.lock ([#70](https://github.com/technology-studio/error-graphql/issues/70)) ([86784f9](https://github.com/technology-studio/error-graphql/commit/86784f9dfa685d538ba84e1dfaae69571de4f77e))

## [2.0.6](https://github.com/technology-studio/error-graphql/compare/v2.0.5...v2.0.6) (2023-08-30)


### Bug fixes

* **deps:** update dependency @txo/types to ^1.7.0 ([a5de067](https://github.com/technology-studio/error-graphql/commit/a5de067d0e5e046b32e05087ea4dd73a354fcbbf))

## [2.0.5](https://github.com/technology-studio/error-graphql/compare/v2.0.4...v2.0.5) (2023-08-15)


### Bug fixes

* **deps:** update dependency @txo/types to ^1.6.1 ([335c985](https://github.com/technology-studio/error-graphql/commit/335c98588178e6697321c701ac6ce47d844887f5))

## [2.0.4](https://github.com/technology-studio/error-graphql/compare/v2.0.3...v2.0.4) (2023-08-10)


### Bug fixes

* **deps:** update dependency @txo/types to ^1.5.0 ([4669e7e](https://github.com/technology-studio/error-graphql/commit/4669e7e097c30ff2a631cb7ce79b7dca0f0f5df2))

## [2.0.3](https://github.com/technology-studio/error-graphql/compare/v2.0.2...v2.0.3) (2023-08-04)


### Bug fixes

* rename formatErrorInternal into formatError ([#6](https://github.com/technology-studio/error-graphql/issues/6)) ([c16b87b](https://github.com/technology-studio/error-graphql/commit/c16b87b0a50a4dc34736d7841986bbfc6a941097))

## [2.0.2](https://github.com/technology-studio/error-graphql/compare/v2.0.1...v2.0.2) (2023-08-04)


### Bug fixes

* update createError to treat result as error ([#5](https://github.com/technology-studio/error-graphql/issues/5)) ([c82288e](https://github.com/technology-studio/error-graphql/commit/c82288ef31f0115417d3e53dae29e1e3758d14d2))

## [2.0.1](https://github.com/technology-studio/error-graphql/compare/v2.0.0...v2.0.1) (2023-08-04)


### Bug fixes

* add missing createError export ([#4](https://github.com/technology-studio/error-graphql/issues/4)) ([7d85105](https://github.com/technology-studio/error-graphql/commit/7d851054d8dc1ad9224953c237e21e586f89b570))

## [2.0.0](https://github.com/technology-studio/error-graphql/compare/v1.1.1...v2.0.0) (2023-08-04)


### ⚠ BREAKING CHANGES

* remove apollo-error dependency
and unify error structure, making key and validation path
part of create config

### Features

* migrate package ([#2](https://github.com/technology-studio/error-graphql/issues/2)) ([b7918e1](https://github.com/technology-studio/error-graphql/commit/b7918e17cc2111eb22af797a6421c95e20eac313))
