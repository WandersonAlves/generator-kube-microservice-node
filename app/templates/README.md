# <%= projectName %>

Initial template for your services!.

Comes with:

- TypeScript;
- `GenericException` base for all exceptions;
- `BaseController` for controllers extends from it;
- Dockerfile;
- RabbitMQ consumers/producers;
- Swagger endpoints using `swagger-express-ts` package;
- TSDoc with `typedoc` package;
- Kubernetes deployment config;

## How to run

- Run `yarn dev` to spawn a nodemon server watching source files
- Create a .env file in root. This file keep some important enviromment variables has:
  - PORT
  - MONGO_URL
  - MONGO_DB

Edit `src/config/env.ts` with your current needs

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
@controller('/<%= entityNameLowerCase %>')
export default class <%= controllerName %> {
  @inject(REFERENCES.<%= serviceName %>) private <%= serviceInstanceName %>: <%= serviceName %>;

  @ApiOperationGet({
    description: '',
    summary: '',
    responses: {
      200: {
        description: 'Success',
        type: SwaggerDefinitionConstant.Response.Type.ARRAY,
        model: '',
      },
    },
  })
  @httpGet('/')
  @withException
  async get<%= entityName %>s(@response() res: Response) {
    const result = await this.<%= serviceInstanceName %>.find({});
    res.status(OK).send(result);
  }

  @httpPost('/', ..._createEdit<%= entityName %>Validator)
  @withException
  async post<%= entityName %>(@request() req: Request, @response() res: Response, @requestBody() <%= entityNameLowerCase %>: <%= interfaceName %>) {
    this.<%= serviceInstanceName %>.validateRequest(req);
    const new<%= entityName %> = await this.<%= serviceInstanceName %>.insert(<%= entityNameLowerCase %>);
    res.status(CREATED).send(new<%= entityName %>);
  }
```

Everything is injected by `inversify` and the composition root lives in `src/config/inversify.config.ts`.

Inside the composition root, we import all controllers and `inversifyjs` takes care to setup our application (as seen on `src/index.ts`)

To use swagger, see documentation of `swagger-express-ts` (https://github.com/olivierlsc/swagger-express-ts)

### Services

The service layer extends the `BaseController<T>` which has all methods to handle the mongoose model (with has typings too!).

### RabbitMQ

To use a consume/producer function for RabbitMQ, bootstrap the connection on your `service` like this:

```typescript
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
```

The producer is straight forward: just call the function that sends something to a queue (ex: `./src/queue/producers/`)

### Exceptions

All exceptions that are catch by `src/shared/server/middlewares/exception.ts`, have `GenericException` as they base (some edge cases will be handled by the default `express` error handler).

Currently built-in exceptions:

- `AuthException`: should be throw on authentication errors
- `EntityNotFoundException`: should be throw on not found queries
- `MongoNotConnectedException`: internal exception for mongo errors
- `RouteNotFoundException`: throw when you hit a route that doenst't exist
- `UnprocessableEntityException`: should be throw on a entity can't be saved/updated
- `UpstreamConnectionException`: internal exception for `RemoteController` exceptions

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

Your entities controllers should be imported on `src/config/inversify.config.ts`, so `inversify-express-utils` can inject your controller on express routes (as seen on first two lines on example above).

If your controller has another class dependency, inject the dependency onto your class like this:

```typescript
export default class <%= controllerName %> {
  @inject(REFERENCES.<%= serviceName %>) private <%= serviceInstanceName %>: <%= serviceName %>;
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

Always remember:
- Set configmap on your cluster
- Change the image of your container to match your registry