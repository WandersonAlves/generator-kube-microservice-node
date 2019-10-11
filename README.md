# generator-kube-microservice-node
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

A yeoman generator for nodejs micro-service with express and other things.

## Why?

This project is a boilerplate for extensible micro-services.
Contains the minimum to instant deploy a service on a Kubernetes Cluster.

## Contents

This template contains:

- TypeScript
- Dockerfile
- Kubernetes deployment configuration (including `Service` k8s object)
- TypeScript definition for mongo operators on controller functions
- `AController` abstract controller for all entities controllers
- `GenericException` base for all exceptions
- `withException` decorator to abstract error handling logic (used on generated controllers)
- `RemoteController` class to handle `axios` requets
- `RabbitMQ` consumers and producers logic
- `inversifyjs`, `inversify-express-utils` and `swagger-express-ts` packages

## Install

- `npm i -g yo`
- `npm i -g generator-kube-microservice-node`
- `yo kube-microservice-node`
- Follow the inscructions

## How to run

- Run `yarn dev` to spawn a nodemon server watching source files
- Create a .env file in root. This file keep some important enviromment variables has:
  - PORT
  - MONGO_URL
  - MONGO_DB

Edit `src/config/env.ts` with your current needs

## Usage

### Controllers

Controllers of this boilerplate are handled by `inversify-express-utils` package.

Here is a exemple:

```typescript
@controller('/tenant')
export default class TenantController {
  @inject(REFERENCES.TenantService) private tenantService: TenantService;

  @ApiOperationGet({
    description: 'Get a list of available Tenants',
    summary: 'Get a list of available Tenants',
    responses: {
      200: {
        description: 'Success',
        type: SwaggerDefinitionConstant.Response.Type.ARRAY,
        model: 'Tenant',
      },
    },
  })
  @httpGet('/')
  @withException
  async getTenants(@response() res: Response) {
    const result = await this.tenantService.find({});
    res.status(OK).send(result);
  }
```

Everything is injected by `inversify` and the composition root lives in `src/config/inversify.config.ts`. Your entities controllers should be imported on `src/config/inversify.config.ts`, so `inversify-express-utils` can inject your controller on express routes.

Inside the composition root, we import all controllers and `inversifyjs` takes care to setup our application (as seen on `src/index.ts`)

### Services

The service layer extends the `BaseController<T>` which has all methods to handle the mongoose model.

If your service don't use mongoose, you can create a new `BaseController` with your needs. Just remember that the controller should receive a model or similar to operate

### Exceptions

All exceptions that are catch by `src/shared/server/middlewares/exception.ts`, have `GenericException` as they base.

So, just continuing throwning new errors on the business and controller layers that extends the `GenericException.ts`.

### Service authorization

In `src/shared/server/middlewares` you can find a `Unauthorized.ts` file that handles authorization logic of this service.

Using this middleware, you should have another service with endpoint `/auth` that receives a `JWToken` via `Authorization` header.

If that service responds with 200, you're authorized to procced with your request into this service.

### Dependency Injection

This template uses `inversifyjs` to handle DI with a IoC container.
The file that handles that is `src/config/inversify.config.ts`

```typescript
import '../entities/Tenant/TenantController';
import '../shared/middlewares/HealthCheck';

import { Container } from 'inversify';

import REFERENCES from './inversify.references';
import Connection from '../shared/class/Connection';
import TenantService from '../entities/Tenant/TenantService';
import tenantModel from '../entities/Tenant/TenantModel';
import RemoteController from '../shared/class/RemoteController';

const injectionContainer = new Container({ defaultScope: 'Singleton' });

injectionContainer.bind(REFERENCES.Connection).to(Connection);
injectionContainer.bind(REFERENCES.RemoteController).to(RemoteController);
injectionContainer.bind(REFERENCES.TenantService).to(TenantService);

injectionContainer.bind(REFERENCES.TenantModel).toConstantValue(tenantModel);

export default injectionContainer;

```

If your controller has another class dependency, inject the dependency onto your class like this:

```typescript
export default class TenantController {
  @inject(REFERENCES.TenantService) private tenantService: TenantService;
}
```

## Docker and Kubernetes

To build a docker image, you have to build the project using `npm run build` and `npm run build:webpack`. Then, use `npm run build:docker`, and to publish, use `npm run publish:docker`. Remember to edit these commands if you use private repos.

The Kubernetes deployment file (`deployment.yaml`), has a `LivenessProbe` that checks if the route `/health` returns 200. This route, pings to the database. If something goes wrong, your service will be restarted.

The deployment also has a `TimeZone` configuration that you can set the `TimeZone` of the running container. The default is pointing to America/Recife and you can change this anytime if you need.

The `Service` object in `deployment.yaml` file expose the `Pod` created by the `Deployment` to the world on port 80 and binding the port 3000 of the `Pod` to it.

After configuring, you need to add the `Service` definition in a `ingress` controller of your k8s cluster.

Since this template uses Kubernetes, the `.dockerignore` and `Dockerfile` files **DOESN'T** have a reference to `.env`file (which, also is ignored on `.gitignore` file). The way we use here on @e3labs is setting a `envFrom` field on `deployment.yaml`.

Here is a example:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: e3-product-service
spec:
  replicas: 4
  selector:
    matchLabels:
      app: e3-product-service
  template:
    metadata:
      labels:
        app: e3-product-service
    spec:
      containers:
      - name: e3-product-service
        image: <some-image>
        ports:
          - containerPort: 3000
        envFrom:
        - configMapRef:
            name: env-config
        livenessProbe:
          initialDelaySeconds: 20
          periodSeconds: 5
          httpGet:
            path: /health
            port: 3000
```

# Contributing

PR's and new issues are welcome. Anything you think that'll be great to this project will be discussed.

## Development

Clone this repo, then, `npm install` and `npm link`. Now you can test this generator locally using `yo` command.

# Acknowledgements

Many thanks for the folks that worked hard on:

- `inversifyjs` (https://github.com/inversify/InversifyJS)
- `inversify-express-utils` (https://github.com/inversify/inversify-express-utils)
- `swagger-express-ts` (https://github.com/olivierlsc/swagger-express-ts)

Without these libs, this boilerplate doesn't exists
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/vitor-diego/"><img src="https://avatars1.githubusercontent.com/u/15676011?v=4" width="100px;" alt="Vitor Die.go"/><br /><sub><b>Vitor Die.go</b></sub></a><br /><a href="https://github.com/e3Labs/generator-kube-microservice-node/issues?q=author%3Adiegofreemind" title="Bug reports">🐛</a> <a href="#ideas-diegofreemind" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/Blira"><img src="https://avatars2.githubusercontent.com/u/43551066?v=4" width="100px;" alt="Bruno Lira"/><br /><sub><b>Bruno Lira</b></sub></a><br /><a href="https://github.com/e3Labs/generator-kube-microservice-node/commits?author=Blira" title="Code">💻</a> <a href="#maintenance-Blira" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!