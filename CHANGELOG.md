# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.3.10](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.3.9...v2.3.10) (2019-10-01)


### Bug Fixes

* timeout errors as TypeError ([27dcd39](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/27dcd39))
* use connection attrs if they exist instead of env ([1b6d474](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/1b6d474))
* **docs:** add missing info on docs ([0a08faf](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/0a08faf))
* **node:** add missing redis_url on env ([23f52ac](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/23f52ac))


### Performance Improvements

* **docker:** change docker base image ([23d9513](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/23d9513))



## [2.3.9](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.3.8...v2.3.9) (2019-09-13)


### Bug Fixes

* **generator:** force capitalized entityName ([5411e9a](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/5411e9a))
* **kubernetes:** add envFrom ([26f1cbd](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/26f1cbd))
* **kubernetes:** add missing readinessProbe ([88f27fd](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/88f27fd))
* **mongo:** don't use ssl, authsource, replset on dev ([699d0ac](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/699d0ac))



## [2.3.8](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.3.7...v2.3.8) (2019-09-06)


### Bug Fixes

* mongoose deprecation warning ([e45ced9](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/e45ced9))
* stop using global generator-git-init ([a64442f](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/a64442f)), closes [#7](https://github.com/WandersonAlves/generator-kube-microservice-node/issues/7)
* use env.ts to build mongo connection ([3a6a83b](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/3a6a83b))


### Features

* add optional cert on production ([a5e52f9](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/a5e52f9))



## [2.3.7](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.3.6...v2.3.7) (2019-09-03)


### Bug Fixes

* add extras parameter ([9a36647](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/9a36647))
* broken debugger ([a1fca20](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/a1fca20))



## [2.3.6](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.3.5...v2.3.6) (2019-08-28)


### Bug Fixes

* remove DatabaseOperations ([c622190](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/c622190))



## [2.3.5](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.3.4...v2.3.5) (2019-08-22)


### Bug Fixes

* entity field as array conflicting with $in and $nin operators ([3a626c0](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/3a626c0))
* update tslint config ([18a016f](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/18a016f))


### Features

* add missing tsdocs and count method ([5633c1e](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/5633c1e))



## [2.3.4](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.3.3...v2.3.4) (2019-08-20)


### Bug Fixes

* add console.error on connection class error ([cfd0c00](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/cfd0c00))
* remove string constructor from remoteController ([6bb768b](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/6bb768b))
* use httpPut decorator on putEntityName ([60db8c1](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/60db8c1))


### Features

* add helper fields on some exceptions ([901220b](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/901220b))



## [2.3.3](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.3.1...v2.3.3) (2019-08-07)


### Bug Fixes

* add rabbitmq_url on env ([de19e38](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/de19e38))
* set printWidth: 130 ([d86dd03](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/d86dd03))
* workaround to .gitignore renamed ([875ea4c](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/875ea4c)), closes [#1](https://github.com/WandersonAlves/generator-kube-microservice-node/issues/1)


### Features

* add remaining CRUD methods ([1f068c6](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/1f068c6)), closes [#4](https://github.com/WandersonAlves/generator-kube-microservice-node/issues/4)
* add request validation on BaseController ([cd4d4d9](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/cd4d4d9))



## [2.3.1](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.3.0...v2.3.1) (2019-08-02)


### Bug Fixes

* remove unused imports ([dbd599a](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/dbd599a))


### Features

* add support for switing databases ([1f41ed7](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/1f41ed7))



# [2.3.0](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.2.7...v2.3.0) (2019-07-30)


### Bug Fixes

* unable to use vscode debugger ([438cbfd](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/438cbfd))
* use singleton scope on IoC ([ddb77bd](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/ddb77bd))


### Features

* enable by default swagger endpoint ([69c5a32](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/69c5a32))
* use inversify-express-utils to setup express application ([ab1222e](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/ab1222e))



## [2.2.7](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.2.6...v2.2.7) (2019-07-23)


### Features

* add inversifyjs ([f876de5](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/f876de5))



## [2.2.6](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.1.6...v2.2.6) (2019-07-19)


### Bug Fixes

* don't handle prettier in docs/ swagger/ ([8236046](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/8236046))
* missing controller type ([e60fecb](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/e60fecb))
* update nodemon.json ([698108d](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/698108d))


### Features

* add AuthException ([e8e22ac](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/e8e22ac))
* add rabbitmq queue support ([6bece77](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/6bece77))
* add swagger support via swagger-express-ts package ([641a009](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/641a009))



## [2.1.6](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.1.5...v2.1.6) (2019-05-28)


### Features

* change running strategy ([7bee06f](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/7bee06f))



## [2.1.5](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.1.4...v2.1.5) (2019-05-23)


### Bug Fixes

* add DELETE http verb to remoteController ([49e745e](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/49e745e))
* add generics to remoteController ([f430df2](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/f430df2))
* add missing service_auth property on env.ts ([07362f9](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/07362f9))



## [2.1.4](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.1.3...v2.1.4) (2019-04-26)


### Bug Fixes

* update node version to 10.15 ([f72587f](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/f72587f))



## [2.1.3](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.1.2...v2.1.3) (2019-04-26)


### Features

* add authorization middleware ([816dafd](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/816dafd))



## [2.1.2](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.1.1...v2.1.2) (2019-04-26)


### Bug Fixes

* auto init git repo ([e4ab735](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/e4ab735))



## [2.1.1](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.1.0...v2.1.1) (2019-04-25)


### Bug Fixes

* update IMongoModel ([8baa326](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/8baa326))



# [2.1.0](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.0.2...v2.1.0) (2019-04-22)


### Features

* add build system ([a825770](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/a825770))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.0.1...v2.0.2) (2019-02-22)


### Features

* update README.md; remove .env ([535edeb](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/535edeb))



<a name="2.0.1"></a>
## [2.0.1](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v2.0.0...v2.0.1) (2019-01-29)


### Bug Fixes

* yeoman mv gitignore to npmignore ([0b45efd](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/0b45efd))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v1.1.1...v2.0.0) (2019-01-29)


### Bug Fixes

* remove hardcoded move ([8358a18](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/8358a18))


### Features

* add lint, test and husky hooks ([7fb95b2](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/7fb95b2))
* add support for decorators. Business layer is a class now ([10b26fb](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/10b26fb))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/WandersonAlves/generator-kube-microservice-node/compare/v0.1.11...v1.1.1) (2019-01-24)


### Bug Fixes

* add .env to .gitignore ([91bb327](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/91bb327))
* multiple instances of remoteController been triggered on errors ([54a5cfb](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/54a5cfb))
* remoteController don't send query params ([aca25a4](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/aca25a4))
* use lowerCase on entity collection name ([388202a](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/388202a))
* wrong health import ([c3ac142](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/c3ac142))


### Features

* add  operator ([94df711](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/94df711))
* add Dependency Injection mechanism :rocket: ([acb06a8](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/acb06a8))
* mongo types done ([b205126](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/b205126))
* update remoteController and remove product logic ([fcbf49f](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/fcbf49f))
* use Partial<Interface> in params.filter and add lean support on find and findById ([e6cd216](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/e6cd216))
* WIP working on typing mongo operators ([b7994f1](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/b7994f1))


### Performance Improvements

* prevent memory leaks on /health ([02ecf46](https://github.com/WandersonAlves/generator-kube-microservice-node/commit/02ecf46))
