"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormattedHour = exports.getFormattedDate = void 0;
exports.getFormattedDate = (fecha, separador = '/', order = 'dmy') => {
    const formatDay = fecha.getDate() < 10 ? '0' + fecha.getDate().toString() : fecha.getDate().toString();
    const formatMonth = fecha.getMonth() + 1 < 10 ? '0' + (fecha.getMonth() + 1).toString() : (fecha.getMonth() + 1).toString();
    let date = '';
    switch (order) {
        case 'dmy':
            date = formatDay + separador + formatMonth + separador + fecha.getFullYear().toString();
            break;
        case 'ymd':
            date = fecha.getFullYear().toString() + separador + formatMonth + separador + formatDay;
            break;
        case 'mdy':
            date = formatMonth + separador + formatDay + separador + fecha.getFullYear().toString();
            break;
        case 'letra':
            date = formatDay + ' DÍAS DEL MES DE ' + getNameMonth(formatMonth) + ' DE ' + fecha.getFullYear().toString();
            break;
        default:
            date = formatDay + separador + formatMonth + separador + fecha.getFullYear().toString();
            break;
    }
    return date;
};
exports.getFormattedHour = (fecha) => {
    const formatHour = fecha.getHours() < 10 ? '0' + fecha.getHours().toString() : fecha.getHours().toString();
    const formatMinutes = fecha.getMinutes() < 10 ? '0' + fecha.getMinutes().toString() : fecha.getMinutes().toString();
    return formatHour + ':' + formatMinutes;
};
const getNameMonth = (month) => {
    let nameMonth = '';
    switch (month) {
        case '01':
            nameMonth = 'ENERO';
            break;
        case '02':
            nameMonth = 'FEBRERO';
            break;
        case '03':
            nameMonth = 'MARZO';
            break;
        case '04':
            nameMonth = 'ABRIL';
            break;
        case '05':
            nameMonth = 'MAYO';
            break;
        case '06':
            nameMonth = 'JUNIO';
            break;
        case '07':
            nameMonth = 'JULIO';
            break;
        case '08':
            nameMonth = 'AGOSTO';
            break;
        case '09':
            nameMonth = 'SEPTIEMBRE';
            break;
        case '10':
            nameMonth = 'OCTUBRE';
            break;
        case '11':
            nameMonth = 'NOVIEMBRE';
            break;
        case '12':
            nameMonth = 'DICIEMBRE';
            break;
        default:
            nameMonth = '';
            break;
    }
    return nameMonth;
};
//# sourceMappingURL=formatted-date.js.map