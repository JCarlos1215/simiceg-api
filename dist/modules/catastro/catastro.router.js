"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.router = router;
const response_codes_1 = require("@src/utils/response-codes");
const response_error_object_1 = require("@src/utils/response-error-object");
const logger_1 = __importDefault(require("@src/utils/logger"));
const tsyringe_1 = require("tsyringe");
const predio_error_1 = require("./errors/predio.error");
const predio_controller_1 = require("./controllers/predio.controller");
const response_object_1 = require("@src/utils/response-object");
const passport_1 = __importDefault(require("passport"));
const joi_1 = require("joi");
const edicion_error_1 = require("./errors/edicion.error");
const edicion_controller_1 = require("./controllers/edicion.controller");
const lindero_1 = __importDefault(require("./models/lindero"));
const manzana_error_1 = require("./errors/manzana.error");
const certificate_data_1 = __importDefault(require("./models/certificate-data"));
const print_data_1 = __importDefault(require("./models/print-data"));
const sector_error_1 = require("./errors/sector.error");
const colonia_error_1 = require("./errors/colonia.error");
const manzana_controller_1 = require("./controllers/manzana.controller");
const colonia_controller_1 = require("./controllers/colonia.controller");
const sector_controller_1 = require("./controllers/sector.controller");
const upload_geom_kml_1 = __importDefault(require("./models/upload-geom-kml"));
const duplicated_name_kml_error_1 = require("./errors/duplicated-name-kml.error");
const street_view_data_1 = __importDefault(require("./models/street-view-data"));
/*import { PredioPresenter } from './presenters/predio.presenter';
import bluebird from 'bluebird';
import fs = require('fs');
import zipstream = require('zip-stream');*/
router.post('/predio', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    let predioData;
    try {
        const predioController = tsyringe_1.container.resolve(predio_controller_1.PredioController);
        if (req.body.geometry) {
            predioData = await predioController.getPredioByGeometry(req.body.geometry, req.body.options);
        }
        else if (req.body.x && req.body.y) {
            predioData = await predioController.getPredioByPoint(req.body.x, req.body.y, req.body.options);
        }
        else {
            throw new predio_error_1.PredioError('Se necesita el parametro geometry o el punto como parametros x, y');
        }
        res.json(new response_object_1.ResponseObject({ total: predioData.length, predios: predioData }));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /predio] Error: %s', err.message);
        if (err instanceof predio_error_1.PredioError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/construction', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    let constructionData;
    try {
        const predioController = tsyringe_1.container.resolve(predio_controller_1.PredioController);
        if (req.body.geometry) {
            constructionData = await predioController.getConstructionByGeometry(req.body.geometry);
        }
        else if (req.body.x && req.body.y) {
            constructionData = await predioController.getConstructionByPoint(req.body.x, req.body.y);
        }
        else {
            throw new predio_error_1.PredioError('Se necesita el parametro geometry o el punto como parametros x, y');
        }
        res.json(new response_object_1.ResponseObject({ total: constructionData.length, construcciones: constructionData }));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /construction] Error: %s', err.message);
        if (err instanceof predio_error_1.PredioError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/predio/frente/:idPredioFrente', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const predioController = tsyringe_1.container.resolve(predio_controller_1.PredioController);
    try {
        const heading = await predioController.getHeadingByIdPredioFrente(req.params.idPredioFrente);
        res.json(new response_object_1.ResponseObject(heading));
    }
    catch (e) {
        logger_1.default.error('[Modulo: Catastro][GET /predio/frente/:idPredioFrente] Error', e.message, e);
        res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${e.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.get('/predio/frente-referred/:idPredioFrente', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const predioController = tsyringe_1.container.resolve(predio_controller_1.PredioController);
    try {
        const heading = await predioController.getHeadingReferredByIdPredioFrente(req.params.idPredioFrente);
        res.json(new response_object_1.ResponseObject(heading));
    }
    catch (e) {
        logger_1.default.error('[Modulo: Catastro][GET /predio/frente-referred/:idPredioFrente] Error', e.message, e);
        res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${e.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.post('/predio/cota-legal', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(predio_controller_1.PredioController);
        const data = await controller.createPrediCotaLegal(req.body.idpredio);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /predio/cota-legal] Error: %s', err.message);
        if (err instanceof predio_error_1.PredioError) {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
/*router.get('/predio/:clave/download', async (req: Request, res: Response) => {
  try {
    const predioController = container.resolve(PredioController);
    const clave = req.params.clave;
    if (clave) {
      const predioData = await predioController.getPredioByClave(clave, true);
      const predioPlano = new PredioPresenter(predioData).getPredioPlanoAPI();

      const zipPaths = await bluebird.all([
        new Promise((resolveP, rejectP) => {
          fs.writeFile(
            './temp/predio.geojson',
            JSON.stringify({ type: 'FeatureCollection', features: [predioPlano] }, null, 4),
            (err: unknown) => {
              if (err) {
                rejectP(err);
              } else {
                resolveP('./temp/predio.geojson');
              }
            }
          );
        }),
      ]);

      const download = zipPaths.map((item: string) => {
        return {
          path: item,
          name: item.substring(7),
        };
      });

      res.header('Content-Type', 'application/zip');
      res.header('Content-Disposition', `attachment; filename="plano_${clave}.zip"`);

      const zip = zipstream({ level: 1 });
      zip.pipe(res);

      await bluebird.map(
        download,
        (file: { path: string; name: string }) => {
          return new Promise((resolveR, rejectR) => {
            zip.entry(fs.createReadStream(file.path), { name: file.name }, (err: unknown) => {
              if (err) {
                rejectR(err);
              }
              resolveR(file.name);
            });
          });
        },
        { concurrency: 1 }
      );
      zip.finalize();
    } else {
      throw new PredioError('Se necesita el parametro clave del predio');
    }
  } catch (err) {
    logger.error('[Modulo: Catastro][GET /predio/:clave/download] Error', err.message, err);
    if (err instanceof PredioError) {
      res.status(ERROR_CODE.BAD_REQUEST).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.BAD_REQUEST));
    } else {
      res.status(ERROR_CODE.SERVER_ERROR).json(new ErrorResponseObject(`${err.message}`, ERROR_CODE.SERVER_ERROR));
    }
  }
});*/
router.post('/manzana', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    let manzanaData;
    try {
        const manzanaController = tsyringe_1.container.resolve(manzana_controller_1.ManzanaController);
        if (req.body.geometry) {
            manzanaData = await manzanaController.getManzanaByGeometry(req.body.geometry);
        }
        else if (req.body.x && req.body.y) {
            manzanaData = await manzanaController.getManzanaByPoint(req.body.x, req.body.y);
        }
        else {
            throw new manzana_error_1.ManzanaError('Se necesita el parametro geometry o el punto como parametros x, y');
        }
        res.json(new response_object_1.ResponseObject({ total: manzanaData.length, manzanas: manzanaData }));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /manzana] Error: %s', err.message);
        if (err instanceof manzana_error_1.ManzanaError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/colonia', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    let coloniaData;
    try {
        const coloniaController = tsyringe_1.container.resolve(colonia_controller_1.ColoniaController);
        if (req.body.geometry) {
            coloniaData = await coloniaController.getColoniaByGeometry(req.body.geometry);
        }
        else if (req.body.x && req.body.y) {
            coloniaData = await coloniaController.getColoniaByPoint(req.body.x, req.body.y);
        }
        else {
            throw new colonia_error_1.ColoniaError('Se necesita el parametro geometry o el punto como parametros x, y');
        }
        res.json(new response_object_1.ResponseObject({ total: coloniaData.length, colonias: coloniaData }));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /colonia] Error: %s', err.message);
        if (err instanceof colonia_error_1.ColoniaError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/sector', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    let sectorData;
    try {
        const zonaCatastralController = tsyringe_1.container.resolve(sector_controller_1.SectorController);
        if (req.body.geometry) {
            sectorData = await zonaCatastralController.getSectorByGeometry(req.body.geometry);
        }
        else if (req.body.x && req.body.y) {
            sectorData = await zonaCatastralController.getSectorByPoint(req.body.x, req.body.y);
        }
        else {
            throw new sector_error_1.SectorError('Se necesita el parametro geometry o el punto como parametros x, y');
        }
        res.json(new response_object_1.ResponseObject({ total: sectorData.length, sector: sectorData }));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /sector] Error: %s', err.message);
        if (err instanceof sector_error_1.SectorError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/predio/:clave', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    const predioController = tsyringe_1.container.resolve(predio_controller_1.PredioController);
    try {
        const predioData = await predioController.getPredioByClave(req.params.clave);
        res.json(new response_object_1.ResponseObject(predioData[0]));
    }
    catch (e) {
        logger_1.default.error('[Modulo: Catastro][GET /predio/:clave] Error', e.message, e);
        res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${e.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.post('/predio/plano-simple', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const printData = await print_data_1.default.validateAsync(req.body.printData);
        const controller = tsyringe_1.container.resolve(predio_controller_1.PredioController);
        const data = await controller.getReportPlanoSimple(printData);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /predio/plano-simple] Error: %s', err.message);
        if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else if (err instanceof predio_error_1.PredioError) {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/manzana/plano-simple', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const printData = await print_data_1.default.validateAsync(req.body.printData);
        const controller = tsyringe_1.container.resolve(manzana_controller_1.ManzanaController);
        const data = await controller.getReportPlanoSimple(printData);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /manzana/plano-simple] Error: %s', err.message);
        if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else if (err instanceof manzana_error_1.ManzanaError) {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/predio/plano-certificado', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const printData = await print_data_1.default.validateAsync(req.body.printData);
        const certificateData = await certificate_data_1.default.validateAsync(req.body.certificateData);
        const controller = tsyringe_1.container.resolve(predio_controller_1.PredioController);
        const data = await controller.getReportPlanoCertificado(printData, certificateData);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /predio/plano-certificado] Error: %s', err.message);
        if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else if (err instanceof predio_error_1.PredioError) {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/manzana/plano-certificado', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const printData = await print_data_1.default.validateAsync(req.body.printData);
        const certificateData = await certificate_data_1.default.validateAsync(req.body.certificateData);
        const controller = tsyringe_1.container.resolve(manzana_controller_1.ManzanaController);
        const data = await controller.getReportPlanoCertificado(printData, certificateData);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /manzana/plano-certificado] Error: %s', err.message);
        if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else if (err instanceof manzana_error_1.ManzanaError) {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/fusion/generate', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.createFusion(req.body.json, user.username, 'prueba');
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /fusion/generate] Error: %s', err.message);
        if (err instanceof edicion_error_1.EdicionError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/fusion/apply', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.applyFusion(req.body.idFusion, req.body.idPredominante);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /fusion/apply] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.post('/fusion/validate', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.validateFusion(req.body.claves);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /fusion/validate] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.post('/fusion/validate-owner-debt', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.validateDebtOwnerFusion(req.body.claves);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /fusion/validate-owner-debt] Error: %s', err.message);
        res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.get('/division/linderos/:idpredio', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.getLinderos(req.params.idpredio, user.username);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][GET /division/linderos/:idpredio] Error: %s', err.message);
        if (err instanceof edicion_error_1.EdicionError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.delete('/division/linderos/:idpredio', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.deleteLinderos(req.params.idpredio);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][DELETE /division/linderos/:idpredio] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.post('/division/lindero', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const linderoData = await lindero_1.default.validateAsync(req.body.linderoData);
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.divideLindero(linderoData);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /division/lindero] Error: %s', err.message);
        if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else if (err instanceof edicion_error_1.EdicionError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/division/paralela', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const linderoData = await lindero_1.default.validateAsync(req.body.linderoData);
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.createParalela(linderoData);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /division/paralela] Error: %s', err.message);
        if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else if (err instanceof edicion_error_1.EdicionError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/division/paralela/:idpredio', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.getParalelas(req.params.idpredio, user.username);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][GET /division/paralela/:idpredio] Error: %s', err.message);
        if (err instanceof edicion_error_1.EdicionError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.delete('/division/clean/:idpredio', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.cleanEditionPredio(req.params.idpredio);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][DELETE /division/clean/:idpredio] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.post('/division/generate', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.createDivision(req.body.json, req.body.id, user.username, 'subdivisionTest');
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /division/generate] Error: %s', err.message);
        if (err instanceof edicion_error_1.EdicionError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/division/apply', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.applyDivision(req.body.idDivision);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /division/apply] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.post('/division/validate', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.validateDivision(req.body.claves);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /division/validate] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.post('/division/align-lindero', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.alignLindero(req.body.idPredios, req.body.tolerance);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /division/align-lindero] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.post('/division/split-construction', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.splitConstruction(req.body.idPredios);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /division/split-construction] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.get('/edition/layers', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.getEditionLayers();
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][GET /edition/layers] Error: %s', err.message);
        if (err instanceof edicion_error_1.EdicionError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/edition/attribute/:idlayer', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.getEditionAttributeByIdLayer(req.params.idlayer);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][GET /edition/attribute/:idlayer] Error: %s', err.message);
        if (err instanceof edicion_error_1.EdicionError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/construction/:clasification/is-valid', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.existClasificationConstruction(req.params.clasification);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][GET /construction/:clasification/is-valid] Error: %s', err.message);
        if (err instanceof edicion_error_1.EdicionError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/numero-exterior', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    let numeroExteriorData;
    try {
        const predioController = tsyringe_1.container.resolve(predio_controller_1.PredioController);
        if (req.body.geometry) {
            numeroExteriorData = await predioController.getPredioNumeroExteriorByGeometry(req.body.geometry);
        }
        else if (req.body.x && req.body.y) {
            numeroExteriorData = await predioController.getPredioNumeroExteriorByPoint(req.body.x, req.body.y);
        }
        else {
            throw new predio_error_1.PredioError('Se necesita el parametro geometry o el punto como parametros x, y');
        }
        res.json(new response_object_1.ResponseObject({ total: numeroExteriorData.length, numerosExteriores: numeroExteriorData }));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /numero-exterior] Error: %s', err.message);
        if (err instanceof predio_error_1.PredioError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.put('/edition/attribute', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.updateAttributes(req.body.layer, req.body.attributes, req.body.id);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][PUT /edition/attribute] Error: %s', err.message);
        if (err instanceof edicion_error_1.EdicionError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/object', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    let objectData;
    try {
        const editionController = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        if (req.body.geometry) {
            objectData = await editionController.getEditionObjectByGeometry(req.body.layer, req.body.attributes, req.body.geometry);
        }
        else if (req.body.x && req.body.y) {
            objectData = await editionController.getEditionObjectByPoint(req.body.layer, req.body.attributes, req.body.x, req.body.y);
        }
        else {
            throw new predio_error_1.PredioError('Se necesita el parametro geometry o el punto como parametros x, y');
        }
        res.json(new response_object_1.ResponseObject({ total: objectData.length, objects: objectData }));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /object] Error: %s', err.message);
        if (err instanceof predio_error_1.PredioError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.delete('/edition/:id', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const editionLayer = {
            idLayer: String(req.query.idLayer),
            schema: String(req.query.schema),
            name: String(req.query.name),
            layerName: String(req.query.layerName),
            idName: String(req.query.idName),
            canDelete: Boolean(req.query.canDelete),
        };
        if (editionLayer.canDelete) {
            const data = await controller.deleteObjectById(editionLayer, req.params.id);
            res.json(new response_object_1.ResponseObject(data));
        }
        else {
            throw new edicion_error_1.EdicionError(`No se tiene permiso de eliminar objetos de la capa ${editionLayer.schema}.´${editionLayer.name}`);
        }
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][DELETE /edition/id] Error: %s', err.message);
        if (err instanceof edicion_error_1.EdicionError) {
            res.status(response_codes_1.ERROR_CODE.UNAUTHORIZED).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.UNAUTHORIZED));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/report/deslinde-catastral/:idpredio', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const data = await controller.getReportDeslindeCatastral(req.params.idpredio, user.username);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][GET /report/deslinde-catastral/:idpredio] Error: %s', err.message);
        if (err instanceof edicion_error_1.EdicionError) {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
        else {
            res
                .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
                .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/predio/information', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    let predioUrban;
    let predioRustico;
    let predioUP;
    let predioParcela;
    try {
        const predioController = tsyringe_1.container.resolve(predio_controller_1.PredioController);
        if (req.body.geometry) {
            predioUrban = await predioController.getPredioUrbanInformationByGeometry(req.body.geometry);
            predioRustico = await predioController.getPredioRusticoInformationByGeometry(req.body.geometry);
            predioUP = await predioController.getPredioUPInformationByGeometry(req.body.geometry);
            predioParcela = await predioController.getPredioParcelaInformationByGeometry(req.body.geometry);
        }
        else if (req.body.x && req.body.y) {
            predioUrban = await predioController.getPredioUrbanInformationByPoint(req.body.x, req.body.y);
            predioRustico = await predioController.getPredioRusticoInformationByPoint(req.body.x, req.body.y);
            predioUP = await predioController.getPredioUPInformationByPoint(req.body.x, req.body.y);
            predioParcela = await predioController.getPredioParcelaInformationByPoint(req.body.x, req.body.y);
        }
        else {
            throw new predio_error_1.PredioError('Se necesita el parametro geometry o el punto como parametros x, y');
        }
        res.json(new response_object_1.ResponseObject({
            PredioUrbano: predioUrban,
            PredioUP: predioUP,
            PredioParcela: predioParcela,
            PredioRustico: predioRustico,
        }));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /predio/information] Error: %s', err.message);
        if (err instanceof predio_error_1.PredioError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.get('/report/ficha/:clavecat/:typePredio', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(predio_controller_1.PredioController);
        const data = await controller.getFichaTecnica(req.params.clavecat, req.params.typePredio);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][GET /report/ficha/:clavecat/:typePredio] Error: %s', err.message);
        res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
router.post('/upload-kml', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const uploadKML = await upload_geom_kml_1.default.validateAsync(req.body);
        const user = req.user;
        const result = await controller.addKMLGeometries(uploadKML, user.username);
        res.json(new response_object_1.ResponseObject(result));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /upload-kml] Error: %s', err.message);
        if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else if (err instanceof duplicated_name_kml_error_1.DuplicatedNameKMLError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.post('/street-view-taking', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const streetViewData = await street_view_data_1.default.validateAsync(req.body);
        const user = req.user;
        const result = await controller.getStreetViewTaking(streetViewData, user.username);
        res.json(new response_object_1.ResponseObject(result));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][POST /street-view-taking] Error: %s', err.message);
        if (err instanceof joi_1.ValidationError) {
            res.status(response_codes_1.ERROR_CODE.BAD_REQUEST).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.BAD_REQUEST));
        }
        else {
            res.status(response_codes_1.ERROR_CODE.SERVER_ERROR).json(new response_error_object_1.ErrorResponseObject(`${err.message}`, response_codes_1.ERROR_CODE.SERVER_ERROR));
        }
    }
});
router.delete('/street-view-taking', passport_1.default.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const controller = tsyringe_1.container.resolve(edicion_controller_1.EdicionController);
        const user = req.user;
        const data = await controller.deleteStreetViewTaking(user.username);
        res.json(new response_object_1.ResponseObject(data));
    }
    catch (err) {
        logger_1.default.error(err, '[Modulo: Catastro][DELETE /street-view-taking] Error: %s', err.message);
        res
            .status(response_codes_1.ERROR_CODE.SERVER_ERROR)
            .json(new response_error_object_1.ErrorResponseObject(`No se pudo procesar su solicitud`, response_codes_1.ERROR_CODE.SERVER_ERROR));
    }
});
//# sourceMappingURL=catastro.router.js.map