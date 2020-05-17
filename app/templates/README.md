# <%= projectName %>

This template contains:

- TypeScript
- Dockerfile
- Kubernetes deployment configuration (including `Service` k8s object)
- TypeScript definition for mongo operators on controller functions
- `MongoService` abstract class for all entities services
- `GenericException` base for all exceptions
- `withException` decorator to abstract error handling logic (used on generated controllers)
- `RemoteController` class to handle `axios` requets
- `RabbitMQ` consumers and producers logic
- `expressjs` implementation with `inversifyjs` and `inversify-express-utils`

## How to run

- Run `yarn dev` to spawn a nodemon server watching source files
- Create a .env file in root to handle all your secrets. Look at `src/config/env.ts` to see the default list of variables

## Common everyday commands

- `yarn dev`: starts a nodemon server
- `yarn build`: builds the project
- `yarn build:webpack` (requires `yarn build`): build the project into a single file with webpack
- `yarn build:docker`: builds a docker image of this service
- `yarn publish:docker`: (requires `yarn build:docker`) push the docker image
- `yarn format`: uses Prettier to format your code
- `yarn lint --fix`: runs tslint
- `yarn build:docs`: runs `typedoc` and generate documentation
- `yarn release`: creates a new tag and changelog with a given release number

## Usage

### Controllers

Controllers of this boilerplate are handled by `inversify-express-utils` package.

Here is a exemple:

```typescript
@controller('/user')
export default class UserController {
  @inject(REFERENCES.UserService) private userService: UserService;

  @httpGet('/')
  @withException
  async getTenants(@response() res: Response) {
    const result = await this.tenantService.find({ throwErrors: true });
    res.status(OK).send(result);
  }

  @httpGet('/:id')
  @withException
  async getUser(@response() res: Response, @requestParam('id') id: string) {
    // Using Redis and the default error handling
    const [exception, result] = this.redis.withRedis({ key: 'getUser', expires: 10 }, () =>
      this.userService.findById({ id }),
    );
    if (!exception) {
      return res.status(exception.statusCode).send(exception.formatError())
    }
    return res.status(OK).send(result);
  }
```

There's two types of response when using `MongoService`:

- A result using `Either<L, R>`
- The raw entity

The two examples are described above.

Everything is injected by `inversify` and the composition root lives in `src/config/inversify.config.ts`. Your entities controllers should be imported on `src/config/inversify.config.ts`, so `inversify-express-utils` can inject your controller on express routes.

Inside the composition root, we import all controllers and `inversifyjs` takes care to setup our application (as seen on `src/index.ts`)

### Services

The service layer extends the `MongoService<T>` which has all methods to handle the mongoose model.

```typescript
import { injectable } from 'inversify';
import { MongoService } from '../shared/class/MongoService';
import { UserInterface } from '../models/UserInterface';
import { UserSchema, UserModel } from '../models/UserModel';

@injectable()
export default class UserService extends MongoService<UserInterface> {
  constructor() {
    /**
     * MongoService uses the Schema because if you change the default database while using some method from MongoService,
     * mongoose don't knows how to create the model schema for this non default database, so we help mongoose to do that
     */
    super(UserModel, UserSchema);
  }
}
```


### Redis

Redis connection occurs when you require redis into another class. Use like this:

```typescript
@controller('/user')
export default class UserController {
  @inject(REFERENCES.UserService) private userService: UserService;
  @inject(REFERENCES.RedisController) private redis: RedisController;

  @httpGet('/')
  @withException
  async getUsers(@response() res: Response) {
    const result = await this.userService.find({});
    res.status(OK).send(result);
  }

  @httpGet('/:id')
  @withException
  async getUser(@response() res: Response, @requestParam('id') id: string) {
    // This method gets a entry from cache and set it if don't exist
    const result = this.redis.withRedis({ key: 'getUser', expires: 10 }, () =>
      this.userService.findById({ id, throwErrors: true }),
    );
    if (!result) {
      throw new EntityNotFoundException({ id });
    }
    res.status(OK).send(result);
  }
```

### RabbitMQ

To use a consume/producer function for RabbitMQ, bootstrap the connection on your `Service` like this:

```typescript

@injectable()
export default class UserService extends MongoService<UserInterface> {

  @inject(REFERENCES.EventBus) private eventBus: EventEmitter;
  private _channel: Channel;
  constructor() {
    super(UserModel, UserSchema);
    // Only connect to Rabbit when mongo is connected
    this.eventBus.on('mongoConnection', this._createRabbitMQChannelAndSetupQueue);
    // Reconnect to rabbitmq
    this.eventBus.on('reconnectRabbitMQ', this._createRabbitMQChannelAndSetupQueue);
  }

  /**
 * Creates a RabbitMQ Channel and setup the queue for this service
 */
  // Run this function on constructor
  private async _createRabbitMQChannelAndSetupQueue() {
    this._channel = await createRabbitMQChannel(env.rabbitmq_url);
    // Some consumer on ./src/queue/consumers
    consumeCreateUser(this._channel, this._consumeCreateUser);
  }
  /**
   * RabbitMQ Consumer CREATE_USER Function
   *
   * Creates a user
   * @param payload RabbitMQ ConsumeMessage type.
   */
  private _consumeCreateUser = async (payload: ConsumeMessage) => {
    const data = JSON.parse(payload.content.toString());
    /** DO SOMETHING  */
    this._channel.ack(payload); // sends a acknowledgement
  };
}

```

The producer is straight forward: just call the function that sends something to a queue (ex: `./src/queue/producers/`)

### Exceptions

All exceptions that are catch by `src/server/middlewares/index.ts`, have `GenericException` as they base.

So, just continuing throw new errors based on `GenericException.ts` that express will catch and handle. (see `src/shared/exceptions/` folder for default exceptions created)

### Service authorization

In `src/server/` you can find a `Unauthorized.ts` file that handles authorization logic of this service.

Using this middleware, you should have another service with endpoint `/auth` that receives a `JWToken` via `Authorization` header.

If that service responds with 200, you're authorized to procced with your request into this service.

To use it, just insert into `src/server/ServerFactory.ts` a line containing this middleware

```typescript
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import { RouteNotFoundMiddleware, ExceptionMiddleware } from './middlewares';
import Unauthorized from './Unauthorized';

export default {
  initExternalMiddlewares(server: express.Application) {
    server.use(compression());
    server.use(bodyParser.json());
    server.use(cors());
  },
  initExceptionMiddlewares(server: express.Application) {
    // New Line!!!
    server.use(Unauthorized)
    server.use(RouteNotFoundMiddleware);
    server.use(ExceptionMiddleware);
  },
};
```

### Dependency Injection

This template uses `inversifyjs` to handle DI with a IoC container.
The file that handles that is `src/config/inversify.config.ts`

```typescript
import '../entities/User/UserController';
import '../shared/middlewares/HealthCheck';

import { Container } from 'inversify';

import REFERENCES from './inversify.references';
import Connection from '../shared/class/Connection';
import UserService from '../entities/User/UserService';
import RemoteController from '../shared/class/RemoteController';

const injectionContainer = new Container({ defaultScope: 'Singleton' });

injectionContainer.bind(REFERENCES.Connection).to(Connection);
injectionContainer.bind(REFERENCES.RemoteController).to(RemoteController);
injectionContainer.bind(REFERENCES.UserService).to(UserService);


export default injectionContainer;

```

If your controller has another class dependency, inject the dependency onto your class like this:

```typescript
export default class UserController {
  @inject(REFERENCES.UserService) private userService: UserService;
}
```

## Docker and Kubernetes

To build a docker image, you have to build the project using `npm run build` and `npm run build:webpack`. Then, use `npm run build:docker`, and to publish, use `npm run publish:docker`. Remember to edit these commands if you use private repos.

The Kubernetes deployment file (`deployment.yaml`), has a `LivenessProbe` that checks if the route `/health` returns 200. This route, pings to the database. If something goes wrong, your service will be restarted.

The `Service` object in `deployment.yaml` file expose the `Pod` created by the `Deployment` to the world on port 80 and binding the port 3000 of the `Pod` to it.

After configuring, you need to add the `Service` definition in a `ingress` controller of your k8s cluster.

Since this template uses Kubernetes, the `.dockerignore` and `Dockerfile` files **DOESN'T** have a reference to `.env`file (which, also is ignored on `.gitignore` file). The way to go about it is setting a `envFrom` field on `deployment.yaml`.

Here is a example:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 4
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
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

Always remember:
- Set configmap on your cluster
- Change the image of your container to match your registry