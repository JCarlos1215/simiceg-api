/**
 * @apiDefine NewGraph
 * @apiParam (Body) {String} service
 * @apiParam (Body) {Array} graphOptions
 *
 * @apiParamExample {json} Request - Body:
 * {
 *    "service": "servicio",
 *    "graphOptions": {
 *        canGraph: true,
 *        options: [];
 *    }
 * }
 */
import Joi from 'joi';

interface functionGraph {
  code: string;
  alias: string;
}

interface optionGraph {
  table: string;
  schema: string;
  functions: functionGraph[];
}

export interface NewGraph {
  service: string;
  graphOptions: {
    canGraph: boolean;
    options: optionGraph[];
  };
}

const schema = Joi.object({
  service: Joi.string().required(),
  graphOptions: Joi.required(),
});

export default schema;
