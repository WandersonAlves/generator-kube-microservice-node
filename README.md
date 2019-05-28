# generator-kube-microservice-node

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

### Route > Business > Controller

The point of most interest in this boilerplate is the `src/shared/class/AbstractController.ts` file.
This file have all methods necessary to operate on a mongoose model.

Example code:

```typescript
export default SampleController extends AController<SomeInterface> {
  constructor() {
    super(SomeMongooseModel)
  }
}
```

With your new controller, you can do these things (and more) in your business layer (The business layer is instancied on `providers.ts` file):

```typescript
export default class EntityBusiness {
  constructor(
    private entityController: EntityController,
    private redisController?: RedisController
  ) {}

  @withException
  async getEntityCount(req: Request, res: Response, next: NextFunction) {
    const result = await this.entityController.getCount();
    res.status(OK).send({ count: result });
  }
}
```

As you can see above, the `EntityBusiness` class can have a `RedisController` on constructor. Connection with Redis is a problem when testing, so, you can do this on `env.ts`

```typescript
const redisController = process.env.NODE_ENV !== 'test' ? new RedisController() : null;
const productController = new ProductController(priceController, stockController, redisController);
```

And run the test with:
```json
"scripts": {
    "test": "NODE_ENV=test mocha -r ts-node/register src/**/*.spec.ts"
}
```

The `@withException` decorator is a decorator that provides a try/catch out of the box for the methods without logic on catch block. If you need custom behavior on a catch block, remove `@withException` of the method and write a raw try/catch block.

In your routes definitions, use your business layer (see `src/routes/entityRoute/index.ts)

With POST/PUT requests, you'll write something like this:

```typescript
const postChecking = [
  body('someFieldOnRequestBody').exists(),
];

router.post('/', postChecking, (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new UnprocessableEntityException(errors.array()));
    return;
  }
  business.entityBusinessMethod(req, res, next);
});
```

> `check(str: String)` and `validationResult(req: Request)` are from `express-validator/check` package.

### Exceptions

All exceptions that are catch by `src/shared/server/middlewares/exception.ts`, have `GenericException` as they base.

So, just continuing throwning new errors on the business and controller layers that extends the `GenericException.ts`.

### Service authorization

In `src/shared/server/middlewares` you can find a `Unauthorized.ts` file that handles authorization logic of this service.

Using this middleware, you should have another service with endpoint `/auth` that receives a `JWToken` via `Authorization` header.

If that service responds with 200, you're authorized to procced with your request into this service.

### Dependency Injection

This template have a simple dependence injection on config/providers.ts. This file, handle all the controllers instances of application.

```typescript
import VendorController from "../entities/Vendor/VendorController";
import RemoteController from "../shared/class/RemoteController";
import RankingController from "../entities/Ranking/RankingController";
import UtilsClass from "../shared/class/UtilsClass";
import PointsHistoryController from "../entities/PointsHistory/PointsHistoryController";
import GameficationParamsController from "../entities/GameficationParams/GameficationParamsController";

const providers = (() => {
  const vendorController = new VendorController();
  const remoteController = new RemoteController();
  // This controller has dependency on another controller
  const rankingController = new RankingController(vendorController);
  const utilsController = new UtilsClass;
  const pointsHistoryController = new PointsHistoryController();
  const gameficationController = new GameficationParamsController();
  // This business has dependency on another controller
  const productBusiness = new ProductBusiness(productController);
  return {
    vendorController,
    remoteController,
    rankingController,
    utilsController,
    pointsHistoryController,
    gameficationController,
    productBusiness
  }
})();

export default providers;
```

If your controller has another class dependency, create your class like this:

```typescript
export default class RankingController extends AController <RankingInterface> {

  constructor(private _vendorController: VendorController) {
    super(RankingModel);
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
