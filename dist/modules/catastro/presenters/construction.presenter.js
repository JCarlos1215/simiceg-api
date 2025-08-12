"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructionPresenter = void 0;
class ConstructionPresenter {
    constructor(construction) {
        this.construction = construction;
    }
    getConstructionPlanoAPI() {
        return {
            type: 'Feature',
            properties: {
                idConstruccion: this.construction.idConstruccion,
                bloque: this.construction.bloque,
                niveles: this.construction.niveles,
                clasificacion: this.construction.clasificacion,
            },
            geometry: Object.assign({}, this.construction.geometry),
        };
    }
}
exports.ConstructionPresenter = ConstructionPresenter;
//# sourceMappingURL=construction.presenter.js.map