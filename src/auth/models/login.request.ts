import Joi from 'joi';

/**
 * @apiDefine LoginRequest
 * @apiParam (Body) {String} username Nombre de usuario a autentificar.
 * @apiParam (Body) {String} password Contraseña del usuario.
 *
 * @apiParamExample {json} Request - Body:
 * {
 *   "username": "usuario",
 *   "password": "contraseña"
 * }
 */
export interface LoginRequest {
  username: string;
  password: string;
}

const schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export default schema;
