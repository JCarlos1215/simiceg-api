"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManzanaPresenter = void 0;
class ManzanaPresenter {
    constructor(manzana) {
        this.manzana = manzana;
    }
    getManzanaPlanoAPI() {
        return {
            type: 'Feature',
            properties: {
                idManzana: this.manzana.idManzana,
                manzana: this.manzana.manzana,
                clave: this.manzana.clave,
            },
            geometry: Object.assign(Object.assign({}, this.manzana.geometry), { crs: {
                    type: 'name',
                    properties: {
                        name: 'urn:ogc:def:crs:EPSG::4326',
                    },
                } }),
        };
    }
}
exports.ManzanaPresenter = ManzanaPresenter;
//# sourceMappingURL=manzana.presenter.js.map