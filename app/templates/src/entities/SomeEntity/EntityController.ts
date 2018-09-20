import { <%= interfaceName %> } from './<%= interfaceName %>';
import { AController } from '../../shared/class/AbstractController';

import <%= modelName %> from './<%= modelName %>';

export default class <%= controllerName %> extends AController <<%= interfaceName %>> {
  constructor() {
    super(<%= modelName %>);
  }
}