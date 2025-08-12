"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormattedNumber = void 0;
exports.getFormattedNumber = (valor) => {
    return new Intl.NumberFormat('es-MX', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        minimumIntegerDigits: 1,
    }).format(valor);
};
//# sourceMappingURL=formatted-number.js.map