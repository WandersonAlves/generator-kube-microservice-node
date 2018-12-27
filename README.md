# generator-kube-microservice-node

A yeoman generator for nodejs micro-service with express and other things.

This template contains:

- `GenericException` base for all exceptions
- `AController` for controllers extends from it
- TypeScript
- Dockerfile
- Kubernetes deployment config with load-balancer file

## Install

- `npm i -g yeoman`
- `npm i -g generator-kube-microservice-node`
- `yo generator-kube-microservice-node`
- Follow the inscructions

## Requirements

- nodemon (`npm i -g nodemon`)
- changelog (`npm i -g generate-changelog`)

## How to run

- On one terminal, run `npm run watch:build` to transpile .ts files to .js
- On another terminal, run `npm run watch:server` to server transpiled .ts files with nodemon

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

So, just continuing throwning new Errors


### Dependency Injection

This template have a simple dependence injection on config/providers.ts. This file, handle all the controllers instances of application.

Ex:

```
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

  return {
    vendorController,
    remoteController,
    rankingController,
    utilsController,
    pointsHistoryController,
    gameficationController
  }
})();

export default providers;
```

If your controller has another class dependency, create your class like this:

```
export default class RankingController extends AController <RankingInterface> {

  constructor(private vendorController: VendorController) {
    super(RankingModel);
    this.vendorController = vendorController;
  }
```

In your business file, use providers like this:

```
import providers from '../../config/providers';

const rankingController = providers.rankingController;
const remoteController = providers.remoteController;
const utils = providers.utilsController;
```

This will ensure that you have only singleton classes running