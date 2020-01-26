import { <%= interfaceName %> } from '../entities/<%= entityName %>/<%= interfaceName %>';
import { OK, NO_CONTENT, CREATED } from 'http-status-codes';
import { Response, Request } from 'express';
import { ValidationChain } from 'express-validator';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  response,
  request,
  requestParam,
  requestBody,
} from 'inversify-express-utils';

import <%= serviceName %> from '../entities/<%= entityName %>/<%= serviceName %>';
import REFERENCES from '../config/inversify.references';
import EntityNotFoundException from '../shared/exceptions/EntityNotFoundException';
import withException from '../shared/decorators/withException';
import { validateRequest } from '../shared/utils';

const _createEdit<%= entityName %>Validator: ValidationChain[] = [];

@controller('/v1/<%= entityNameLowerCase %>')
export default class <%= controllerName %> {

  @inject(REFERENCES.<%= serviceName %>) private <%= serviceInstanceName %>: <%= serviceName %>;

  @httpGet('/')
  @withException
  async get<%= entityName %>s(@response() res: Response) {
    const result = await this.<%= serviceInstanceName %>.find({});
    res.status(OK).send(result);
  }

  @httpGet('/:id')
  @withException
  async get<%= entityName %>(@response() res: Response, @requestParam('id') id: string) {
    const result = await this.<%= serviceInstanceName %>.findById({ id });
    if (!result) {
      throw new EntityNotFoundException({ id });
    }
    res.status(OK).send(result);
  }

  @httpDelete('/:id')
  @withException
  async delete<%= entityName %>(@response() res: Response, @requestParam('id') id: string) {
    await this.<%= serviceInstanceName %>.delete({ id, throwErrors: true });
    res.status(NO_CONTENT).send();
  }

  @httpPost('/', ..._createEdit<%= entityName %>Validator)
  @withException
  async post<%= entityName %>(@request() req: Request, @response() res: Response, @requestBody() <%= entityNameLowerCase %>: <%= interfaceName %>) {
    validateRequest(req);
    const new<%= entityName %> = await this.<%= serviceInstanceName %>.insert({ entity: <%= entityNameLowerCase %>, throwErrors: true });
    res.status(CREATED).send(new<%= entityName %>);
  }

  @httpPut('/', ..._createEdit<%= entityName %>Validator)
  @withException
  async put<%= entityName %>(@request() req: Request, @response() res: Response, @requestBody() <%= entityNameLowerCase %>: <%= interfaceName %>) {
    validateRequest(req);
    const updated<%= entityName %> = await this.<%= serviceInstanceName %>.update({ entity: <%= entityNameLowerCase %>, conditions: { _id: <%= entityNameLowerCase %>._id }, throwErrors: true });
    res.status(CREATED).send(updated<%= entityName %>);
  }
}
