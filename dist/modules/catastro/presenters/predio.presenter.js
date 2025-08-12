"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredioPresenter = void 0;
class PredioPresenter {
    constructor(predio) {
        this.predio = predio;
    }
    getPredioPlanoAPI() {
        return {
            type: 'Feature',
            properties: {
                idPredio: this.predio.idPredio,
                claveLote: this.predio.clave,
            },
            geometry: Object.assign(Object.assign({}, this.predio.geometry), { crs: {
                    type: 'name',
                    properties: {
                        name: 'urn:ogc:def:crs:EPSG::4326',
                    },
                } }),
        };
    }
}
exports.PredioPresenter = PredioPresenter;
//# sourceMappingURL=predio.presenter.js.map