import Joi from 'joi';

/**
 * @apiDefine NewUser
 * @apiParam (data - NewUser) {String} username Nombre del usuario.
 * @apiParam (data - NewUser) {String} password Contraseña del usuario.
 * @apiParam (data - NewUser) {String} idrol Identificador de rol del usuario.
 * @apiParam (data - NewUser) {String} givenname Nombre de pila del usuario.
 * @apiParam (data - NewUser) {String} surname Apellido del usuario.
 * @apiParam (data - NewUser) {String} company Compañia en la que trabaja el usuario.
 * @apiParam (data - NewUser) {String} job Puesto de trabajo del usuario.
 */
export interface NewUser {
  username: string;
  password: string;
  idrol: string;
  givenname: string;
  surname: string;
  company: string;
  job: string;
}

const schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  idrol: Joi.string().required(),
  givenname: Joi.string().required(),
  surname: Joi.string().required().allow(''),
  company: Joi.string().required().allow(''),
  job: Joi.string().required().allow(''),
});

export default schema;
