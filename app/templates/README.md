# <%= projectName %>

Initial template for your services!.

Comes with:

- `GenericException` base for all exceptions
- `AController` for controllers extends from it
- TypeScript
- Dockerfile
- RabbitMQ consumers/producers
- Swagger endpoints using `swagger-express-ts` package
- TSDoc with `typedoc` package
- Kubernetes deployment config

## How to run

- `yarn dev` will open a nodemon server watching for changing on your files

## Common everyday commands

- `yarn dev`: starts a nodemon server
- `yarn build`: builds the project
- `yarn build:webpack` (requires `yarn build`): build the project into a single file with webpack
- `yarn build:docker`: builds a docker image of this service
- `yarn publish:docker`: (requires `yarn build:docker`) push the docker image
- `yarn format`: uses Prettier to format your code
- `yarn release`: creates a new tag and changelog with a given release number

## Usage

### Route > Business > Controller flow

The point of most interest in this boilerplate is the `src/shared/class/AbstractController.ts` file.
This file have all methods necessary to operate on a mongoose model.

Example code:

```
export default SampleController extends AController<SomeInterface> {
  constructor() {
    super(SomeMongooseModel)
  }
}
```

With your new controller, you can do these things (and more) in your BusinessLayer:

```
export const sampleBussinesMethod = async (req, res, next) => {
  try {
    // Find all documents within the collection
    const result = await sampleController.findAll();
    res.status(httpStatus.OK).send(result);
  }
  catch (err) {
    next(new GenericException({ name: err.name, message: err.message }));
  }
}
```

If you have custom behavior in your controller, just create new methods there.

Then, in the route definitions, use your business layer (see `src/routes/entityRoute/index.ts)

With POST/PUT requests, you'll write something like this:

```
const postChecking = [
  check('someFieldOnRequestBody').exists(),
];

router.post('/', postChecking, (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new UnprocessableEntityException(errors.array()));
    return;
  }
  entityBusinessMethod(req, res, next);
});
```

`check(str: String)` and `validationResult(req: Request)` are from `express-validator/check` package.

### Exceptions

All exceptions that are catch by `src/shared/server/middlewares/exception.ts`, have `GenericException` as they base.

Currently exceptions:

- `AuthException`: should be throw on authentication errors
- `EntityNotFoundException`: should be throw on not found queries
- `MongoNotConnectedException`: internal exception for mongo errors
- `RouteNotFoundException`: throw when you hit a route that doenst't exist
- `UnprocessableEntityException`: should be throw on a entity can't be saved/updated
- `UpstreamConnectionException`: internal exception for `RemoteController` exceptions