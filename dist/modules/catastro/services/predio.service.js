"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredioService = void 0;
const tsyringe_1 = require("tsyringe");
const predio_pg_repository_1 = require("../repositories/predio.pg.repository");
const bluebird_1 = __importDefault(require("bluebird"));
let PredioService = class PredioService {
    constructor(predioRepository) {
        this.predioRepository = predioRepository;
    }
    async getPredioByGeometry(geom, option = { frentes: false, construcciones: false }) {
        const predioData = await this.predioRepository.getPredioByGeometry(geom);
        if (option.frentes) {
            await bluebird_1.default.map(predioData, async (row) => {
                const frentes = await this.predioRepository.getPredioFrenteById(row.idPredio);
                row.frente = frentes;
            }, { concurrency: 4 });
        }
        if (option.construcciones) {
            await bluebird_1.default.map(predioData, async (row) => {
                const construcciones = await this.predioRepository.getPredioConstruction(row.geometry, false);
                row.construction = construcciones;
            }, { concurrency: 4 });
        }
        return predioData;
    }
    async getConstructionByGeometry(geom) {
        return this.predioRepository.getConstructionByGeometry(geom);
    }
    async getPredioByClave(clave, isDownload = false, option = { frentes: false, construcciones: false }) {
        const predioData = await this.predioRepository.getPredioByField(clave, 'clave', isDownload);
        if (option.frentes) {
            await bluebird_1.default.map(predioData, async (row) => {
                const frentes = await this.predioRepository.getPredioFrenteById(row.idPredio);
                row.frente = frentes;
            }, { concurrency: 4 });
        }
        if (option.construcciones) {
            await bluebird_1.default.map(predioData, async (row) => {
                const construcciones = await this.predioRepository.getPredioConstruction(row.geometry, isDownload);
                row.construction = construcciones;
            }, { concurrency: 4 });
        }
        return predioData;
    }
    async getPredioById(idPredio, isDownload = false, option = { frentes: false, construcciones: false }) {
        const predioData = await this.predioRepository.getPredioByField(idPredio, 'idpredio', isDownload);
        if (option.frentes) {
            await bluebird_1.default.map(predioData, async (row) => {
                const frentes = await this.predioRepository.getPredioFrenteById(row.idPredio);
                row.frente = frentes;
            }, { concurrency: 4 });
        }
        if (option.construcciones) {
            await bluebird_1.default.map(predioData, async (row) => {
                const construcciones = await this.predioRepository.getPredioConstruction(row.geometry, isDownload);
                row.construction = construcciones;
            }, { concurrency: 4 });
        }
        return predioData;
    }
    async getPredioByFormattedClave(clave, isDownload = false, option = { frentes: false, construcciones: false }) {
        const predioData = await this.predioRepository.getPredioByField(clave, 'clavecat', isDownload);
        if (option.frentes) {
            await bluebird_1.default.map(predioData, async (row) => {
                const frentes = await this.predioRepository.getPredioFrenteById(row.idPredio);
                row.frente = frentes;
            }, { concurrency: 4 });
        }
        if (option.construcciones) {
            await bluebird_1.default.map(predioData, async (row) => {
                const construcciones = await this.predioRepository.getPredioConstruction(row.geometry, isDownload);
                row.construction = construcciones;
            }, { concurrency: 4 });
        }
        return predioData;
    }
    async getHeadingByIdPredioFrente(idPredioFrente) {
        return this.predioRepository.getHeadingByIdPredioFrente(idPredioFrente);
    }
    async getHeadingReferredByIdPredioFrente(idPredioFrente) {
        return this.predioRepository.getHeadingReferredByIdPredioFrente(idPredioFrente);
    }
    async getPredioFrenteById(idPredio) {
        return this.predioRepository.getPredioFrenteById(idPredio);
    }
    async getPredioFrenteReferredById(idPredio, year) {
        return this.predioRepository.getPredioFrenteReferredById(idPredio, year);
    }
    async getPredioCotaByClave(clave, isDownload = false) {
        return this.predioRepository.getPredioCotaByClave(clave, isDownload);
    }
    async getPlanoCertificadoData(clave) {
        return this.predioRepository.getPlanoCertificadoData(clave);
    }
    async getPredioNumeroExteriorByGeometry(geom) {
        return this.predioRepository.getPredioNumeroExteriorByGeometry(geom);
    }
    async createPrediCotaLegal(idPredio) {
        return this.predioRepository.generatePrediCotaLegal(idPredio);
    }
    async getPredioUrbanInformationByGeometry(geom) {
        return this.predioRepository.getPredioUrbanInformationByGeometry(geom);
    }
    async getPredioUPInformationByGeometry(geom) {
        return this.predioRepository.getPredioUPInformationByGeometry(geom);
    }
    async getPredioParcelaInformationByGeometry(geom) {
        return this.predioRepository.getPredioParcelaInformationByGeometry(geom);
    }
    async getPredioRusticoInformationByGeometry(geom) {
        return this.predioRepository.getPredioRusticoInformationByGeometry(geom);
    }
    async getPredioUrbanInformationByClave(formattedClave) {
        return this.predioRepository.getPredioUrbanInformationByClave(formattedClave);
    }
    async getPredioUPInformationByClave(formattedClave) {
        return this.predioRepository.getPredioUPInformationByClave(formattedClave);
    }
    async getPredioParcelaInformationByClave(formattedClave) {
        return this.predioRepository.getPredioParcelaInformationByClave(formattedClave);
    }
    async getPredioRusticoInformationByClave(formattedClave) {
        return this.predioRepository.getPredioRusticoInformationByClave(formattedClave);
    }
    async getFichaSIMICEGData(formattedClave) {
        return this.predioRepository.getFichaSIMICEGData(formattedClave);
    }
};
PredioService = __decorate([
    tsyringe_1.injectable(),
    tsyringe_1.registry([{ token: 'PredioRepository', useClass: predio_pg_repository_1.PredioPGRepository }]),
    __param(0, tsyringe_1.inject('PredioRepository')),
    __metadata("design:paramtypes", [Object])
], PredioService);
exports.PredioService = PredioService;
//# sourceMappingURL=predio.service.js.map