"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredioCotaPresenter = void 0;
class PredioCotaPresenter {
    constructor(cota) {
        this.cota = cota;
    }
    getPredioCotaPlanoAPI() {
        return {
            type: 'Feature',
            properties: {
                cota: this.cota.cota,
                angulo: this.cota.angulo,
                est: this.cota.est,
                pv: this.cota.pv,
                rumbo: this.cota.rumbo,
                x: this.cota.x,
                y: this.cota.y,
                azimut: this.cota.azimut,
                clave: this.cota.clave,
            },
            geometry: Object.assign({}, this.cota.geometry),
        };
    }
}
exports.PredioCotaPresenter = PredioCotaPresenter;
//# sourceMappingURL=predio-cota.presenter.js.map