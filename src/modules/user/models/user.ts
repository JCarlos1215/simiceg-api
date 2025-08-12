/**
 * @apiDefine User
 * @apiSuccess (data - User) {String} idUser Identificador de usuario.
 * @apiSuccess (data - User) {String} username Nombre del usuario.
 * @apiSuccess (data - User) {Date} createdAt Fecha de creación del usuario.
 * @apiSuccess (data - User) {String} idRol Identificador de rol del usuario.
 * @apiSuccess (data - User) {String} givenname Nombre de pila del usuario.
 * @apiSuccess (data - User) {String} surname Apellido del usuario.
 * @apiSuccess (data - User) {String} company Compañia en la que trabaja el usuario.
 * @apiSuccess (data - User) {String} job Puesto de trabajo del usuario.
 */
export interface User {
  idUser: string;
  username: string;
  createdAt: Date;
  idRol: string;
  givenname: string;
  surname: string;
  company: string;
  job: string;
}
