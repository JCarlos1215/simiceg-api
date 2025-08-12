"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDebtReportDocumentDefinition = void 0;
const formatted_number_1 = require("@src/utils/formatted-number");
const mm2inches = (mm) => mm / 25.4;
const inches2pixel = (inches) => Math.round(inches * 72);
const mm2pixel = (mm) => inches2pixel(mm2inches(mm));
exports.generateDebtReportDocumentDefinition = (data) => {
    const dd = {
        pageSize: 'LETTER',
        pageMargins: [mm2pixel(5), mm2pixel(37), mm2pixel(5), 28],
        header: {
            table: {
                widths: ['*'],
                body: [
                    [
                        {
                            table: {
                                widths: [mm2pixel(150), mm2pixel(49.7)],
                                body: [
                                    [
                                        /*{
                                          image: `${data.TLQ_LOGO}`,
                                          width: mm2pixel(45),
                                          height: mm2pixel(21.5),
                                          margin: [-2, 5, 0, 0],
                                          border: [false, false, false, false],
                                        },*/
                                        {
                                            stack: [
                                                {
                                                    text: 'Ayuntamiento Constitucional de Manzanillo',
                                                    fontSize: 14,
                                                    bold: true,
                                                    alignment: 'center',
                                                    margin: [0, 14, 0, 0],
                                                    border: [false],
                                                },
                                                {
                                                    text: 'Tesorería Municipal',
                                                    fontSize: 12,
                                                    bold: true,
                                                    alignment: 'center',
                                                    border: [false],
                                                },
                                                {
                                                    text: 'Dirección de Catastro',
                                                    fontSize: 12,
                                                    bold: true,
                                                    alignment: 'center',
                                                    border: [false],
                                                },
                                                {
                                                    text: 'Reporte de predios con adeudo del impuesto predial',
                                                    fontSize: 12,
                                                    bold: true,
                                                    alignment: 'center',
                                                    margin: [0, 8, 0, 0],
                                                    border: [false],
                                                },
                                            ],
                                            border: [false, false, false, false],
                                        },
                                        {
                                            image: `${data.MANZANILLO_LOGO}`,
                                            width: mm2pixel(49.7),
                                            height: mm2pixel(21.5),
                                            margin: [-4, 5, 0, 0],
                                            border: [false, false, false, false],
                                        },
                                    ],
                                ],
                            },
                            border: [false, false, false, false],
                        },
                    ],
                ],
            },
            border: [false, false, false, false],
            margin: [6, 3, 0, 0],
        },
        footer(currentPage, pageCount) {
            return {
                table: {
                    widths: ['*', '*'],
                    body: [
                        [
                            {
                                text: [
                                    'Fecha: ',
                                    {
                                        text: `${data.FECHA_EMISION}`,
                                        bold: false,
                                    },
                                ],
                                bold: true,
                                fontSize: 8,
                                alignment: 'left',
                                margin: [10, 0, 0, 0],
                                border: [false, false, false, false],
                            },
                            {
                                text: [
                                    '- Página ',
                                    {
                                        text: currentPage.toString() + ' de ' + pageCount,
                                    },
                                    ' -',
                                ],
                                style: 'Contenido',
                                alignment: 'right',
                                margin: [0, 0, 10, 0],
                                border: [false, false, false, false],
                            },
                        ],
                    ],
                },
            };
        },
        styles: {
            Titulo: {
                fontSize: 9,
                alignment: 'center',
                bold: true,
                fillColor: '#d9d9d9',
            },
            Subtitulo: {
                fontSize: 6,
                alignment: 'center',
                bold: true,
            },
            Contenido: {
                fontSize: 8,
                alignment: 'center',
            },
        },
        content: [
            {
                table: {
                    widths: [mm2pixel(202.5)],
                    body: [
                        [
                            {
                                text: `${data.TIPO_SELECCION} ${data.SELECCION}`,
                                style: ['Titulo', 'Fondo'],
                                alignment: 'center',
                                border: [false, false, false, false],
                            },
                        ],
                    ],
                },
                margin: [-0.5, 0, 0, 3],
                border: [false, false, false, false],
            },
            {
                table: {
                    widths: [mm2pixel(6), mm2pixel(12), mm2pixel(42), mm2pixel(84), mm2pixel(14), mm2pixel(28)],
                    body: [
                        [
                            {
                                text: 'Tipo',
                                style: 'Subtitulo',
                                border: [false, false, false, true],
                            },
                            {
                                text: 'Cuenta',
                                style: 'Subtitulo',
                                border: [false, false, false, true],
                            },
                            {
                                text: 'Clave Catastral',
                                style: 'Subtitulo',
                                border: [false, false, false, true],
                            },
                            {
                                text: 'Ubicación',
                                style: 'Subtitulo',
                                border: [false, false, false, true],
                            },
                            {
                                text: 'Núm. Ext.',
                                style: 'Subtitulo',
                                border: [false, false, false, true],
                            },
                            {
                                text: 'Saldo',
                                style: 'Subtitulo',
                                alignment: 'right',
                                border: [false, false, false, true],
                            },
                        ],
                        ...data.PREDIO_DEBT.map((row) => [
                            {
                                text: `${row.predioType}`,
                                style: 'Contenido',
                                border: [false, false, false, true],
                            },
                            {
                                text: `${row.cuenta}`,
                                style: 'Contenido',
                                border: [false, false, false, true],
                            },
                            {
                                text: `${row.formattedClave}`,
                                style: 'Contenido',
                                border: [false, false, false, true],
                            },
                            {
                                text: `${row.ubicacion}`,
                                style: 'Contenido',
                                border: [false, false, false, true],
                            },
                            {
                                text: `${row.numberExterior}`,
                                style: 'Contenido',
                                border: [false, false, false, true],
                            },
                            {
                                text: `$ ${formatted_number_1.getFormattedNumber(row.saldo)}`,
                                style: 'Contenido',
                                alignment: 'right',
                                border: [false, false, false, true],
                            },
                        ]),
                        [
                            {
                                text: 'TOTAL: ',
                                style: 'Subtitulo',
                                colSpan: 5,
                                alignment: 'right',
                                border: [false, false, false, false],
                            },
                            {},
                            {},
                            {},
                            {},
                            {
                                text: `$ ${data.TOTAL}`,
                                style: 'Contenido',
                                bold: true,
                                alignment: 'right',
                                border: [false, false, false, false],
                            },
                        ],
                    ],
                },
                margin: [1, 0, 0, 0],
                border: [false, false, false, false],
            },
        ],
    };
    return dd;
};
//# sourceMappingURL=debt-report-layout.js.map