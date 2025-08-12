"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFichaSIMICEGDocumentDefinition = void 0;
const formatted_number_1 = require("@src/utils/formatted-number");
const mm2inches = (mm) => mm / 25.4;
const inches2pixel = (inches) => Math.round(inches * 72);
const mm2pixel = (mm) => inches2pixel(mm2inches(mm));
exports.generateFichaSIMICEGDocumentDefinition = (data) => {
    const dd = {
        pageSize: { width: mm2pixel(215.9), height: mm2pixel(330) },
        pageMargins: [mm2pixel(5), mm2pixel(35), mm2pixel(5), 28],
        header: {
            table: {
                widths: ['*'],
                body: [
                    [
                        {
                            text: 'INFORMACIÓN VIGENTE DEL PREDIO',
                            fontSize: 27,
                            bold: true,
                            margin: [0, 10, 0, 0],
                            border: [false],
                        },
                    ],
                    [
                        {
                            text: `${data.SIMICEG_DATA.formattedClave}   ${data.SIMICEG_DATA.nombrePropietario} ${data.SIMICEG_DATA.apellidoParternoPropietario} ${data.SIMICEG_DATA.apellidoMaternoPropietario ? data.SIMICEG_DATA.apellidoMaternoPropietario : ''}`,
                            fontSize: 12,
                            bold: true,
                            margin: [0, 3, 0, 0],
                            border: [false],
                        },
                    ],
                    [
                        {
                            table: {
                                widths: [mm2pixel(40)],
                                body: [
                                    [
                                        {
                                            text: `${data.SIMICEG_DATA.uso}`,
                                            fontSize: 7,
                                            bold: true,
                                            fillColor: '#000000',
                                            color: '#ffffff',
                                            border: [false],
                                        },
                                    ],
                                ],
                            },
                            margin: [0, 5, 0, 0],
                            border: [false, false, false, false],
                        },
                    ],
                ],
            },
            border: [false, false, false, false],
            margin: [10, 3, 0, 0],
        },
        footer(currentPage, pageCount) {
            return {
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                text: [
                                    '- Página ',
                                    {
                                        text: currentPage.toString() + ' de ' + pageCount,
                                    },
                                    ' -',
                                ],
                                style: 'Contenido',
                                alignment: 'center',
                                border: [false, false, false, false],
                            },
                        ],
                    ],
                },
            };
        },
        content: [
            {
                table: {
                    widths: [mm2pixel(202.5)],
                    body: [
                        [
                            {
                                table: {
                                    widths: [mm2pixel(200), mm2pixel(10)],
                                    body: [
                                        [
                                            {
                                                image: `${data.CROQUIS}`,
                                                width: mm2pixel(205.7),
                                                height: mm2pixel(100),
                                                margin: [-4, 0, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                image: `${data.NORTE}`,
                                                width: mm2pixel(6),
                                                height: mm2pixel(10),
                                                margin: [-20, 5, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: 'Croquis de localización del predio',
                                                style: 'Contenido',
                                                alignment: 'center',
                                                colSpan: 2,
                                                border: [false, false, false, false],
                                            },
                                            {},
                                        ],
                                    ],
                                },
                                border: [false, false, false, false],
                                margin: [-5, 0, 0, 0],
                            },
                        ],
                        [
                            {
                                table: {
                                    widths: [mm2pixel(100), mm2pixel(100)],
                                    body: [
                                        [
                                            {
                                                text: 'REGISTRO DE LA PROPIEDAD',
                                                style: 'Titulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'NOMENCLATURA',
                                                style: 'Titulo',
                                                margin: [5, 0, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                table: {
                                                    widths: [mm2pixel(62), mm2pixel(34)],
                                                    body: [
                                                        [
                                                            {
                                                                text: 'FECHA DE REGISTRO:',
                                                                style: 'Subtitulo',
                                                                margin: [-5, 0, 0, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                text: `${data.SIMICEG_DATA.fechaRegistro}`,
                                                                style: 'Contenido',
                                                                alignment: 'right',
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                text: 'TARJETA:',
                                                                style: 'Subtitulo',
                                                                margin: [-5, 0, 0, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                text: `${data.SIMICEG_DATA.tarjeta}`,
                                                                style: 'Contenido',
                                                                alignment: 'right',
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                text: 'ÚLTIMA ACTUALIZACIÓN:',
                                                                style: 'Subtitulo',
                                                                margin: [-5, 0, 0, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                text: `${data.SIMICEG_DATA.ultimaActualizacion}`,
                                                                style: 'Contenido',
                                                                alignment: 'right',
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                text: 'MONTO PREDIAL ANUAL SIN MULTAS:',
                                                                style: 'Subtitulo',
                                                                margin: [-5, 0, 0, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                text: `$${formatted_number_1.getFormattedNumber(+data.SIMICEG_DATA.montoAnual)}`,
                                                                style: 'Contenido',
                                                                alignment: 'right',
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                text: 'AÑO PAGADO:',
                                                                style: 'Subtitulo',
                                                                margin: [-5, 0, 0, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                text: `${data.SIMICEG_DATA.anioPagado}`,
                                                                style: 'Contenido',
                                                                alignment: 'right',
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                text: 'BIMESTRE PAGADO:',
                                                                style: 'Subtitulo',
                                                                margin: [-5, 0, 0, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                text: `${data.SIMICEG_DATA.bimestre}`,
                                                                style: 'Contenido',
                                                                alignment: 'right',
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                    ],
                                                },
                                                border: [false, false, false, false],
                                            },
                                            {
                                                table: {
                                                    widths: [mm2pixel(48), mm2pixel(48)],
                                                    body: [
                                                        [
                                                            {
                                                                text: 'MUNICIPIO:',
                                                                style: 'Subtitulo',
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                text: `${data.SIMICEG_DATA.municipio}`,
                                                                style: 'Contenido',
                                                                alignment: 'right',
                                                                margin: [0, 0, -5, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                text: 'USO:',
                                                                style: 'Subtitulo',
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                text: `${data.SIMICEG_DATA.uso}`,
                                                                style: 'Contenido',
                                                                alignment: 'right',
                                                                margin: [0, 0, -5, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                text: 'DIRECCIÓN:',
                                                                style: 'Subtitulo',
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                text: `${data.SIMICEG_DATA.ubicacion}`,
                                                                style: 'Contenido',
                                                                alignment: 'right',
                                                                margin: [0, 0, -5, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                text: 'USO DE SUELO:',
                                                                style: 'Subtitulo',
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                text: `${data.SIMICEG_DATA.usoSuelo}`,
                                                                style: 'Contenido',
                                                                alignment: 'right',
                                                                margin: [0, 0, -5, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                text: 'RÉGIMEN DE PROPIEDAD:',
                                                                style: 'Subtitulo',
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                text: `${data.SIMICEG_DATA.regimen}`,
                                                                style: 'Contenido',
                                                                alignment: 'right',
                                                                margin: [0, 0, -5, 0],
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
                                margin: [-10, 0, 0, 0],
                            },
                        ],
                        [
                            {
                                table: {
                                    widths: [mm2pixel(80), mm2pixel(59), mm2pixel(59)],
                                    body: [
                                        [
                                            {
                                                text: ' ',
                                                fontSize: 24,
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'SUPERFICIES',
                                                fontSize: 24,
                                                style: 'Superficies',
                                                margin: [0, 15, 0, 15],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'VALORES',
                                                fontSize: 24,
                                                style: 'Valores',
                                                margin: [0, 15, 0, 15],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: 'TERRENO',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${formatted_number_1.getFormattedNumber(+data.SIMICEG_DATA.superficieTerreno)}m²`,
                                                style: ['Contenido', 'Superficies'],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(+data.SIMICEG_DATA.valorTerreno)}`,
                                                style: ['Contenido', 'Valores'],
                                                alignment: 'center',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: 'CONSTRUCCIÓN',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${formatted_number_1.getFormattedNumber(+data.SIMICEG_DATA.supeficieConstruccion)}m²`,
                                                style: ['Contenido', 'Superficies'],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(+data.SIMICEG_DATA.valorConstruccion)}`,
                                                style: ['Contenido', 'Valores'],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: 'ESQUINA',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${formatted_number_1.getFormattedNumber(+data.SIMICEG_DATA.superficeEsquina)}m²`,
                                                style: ['Contenido', 'Superficies'],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(+data.SIMICEG_DATA.valorEsquina)}`,
                                                style: ['Contenido', 'Valores'],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: 'DEMERITO',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: ``,
                                                style: ['Contenido', 'Superficies'],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(+data.SIMICEG_DATA.valorDemerito)}`,
                                                style: ['Contenido', 'Valores'],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: '-----',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: ``,
                                                style: ['Contenido', 'Superficies'],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: ``,
                                                style: ['Contenido', 'Valores'],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: 'VALOR CATASTRAL',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: ' ',
                                                style: ['Contenido', 'Superficies'],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(+data.SIMICEG_DATA.valorTotal)}`,
                                                style: ['Contenido', 'Valores'],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                    ],
                                },
                                border: [false, false, false, false],
                                margin: [-10, 0, 0, 0],
                            },
                        ],
                        [
                            {
                                table: {
                                    widths: [mm2pixel(100), mm2pixel(100)],
                                    body: [
                                        [
                                            {
                                                text: 'ÚLTIMO MOVIMIENTO',
                                                style: 'Titulo',
                                                colSpan: 2,
                                                border: [false, false, false, false],
                                            },
                                            {},
                                        ],
                                        [
                                            {
                                                table: {
                                                    widths: [mm2pixel(62), mm2pixel(34)],
                                                    body: [
                                                        [
                                                            {
                                                                text: 'MOVIMIENTO:',
                                                                style: 'Subtitulo',
                                                                margin: [-5, 0, 0, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                text: `${data.HISTORY_SICAM.idMovimineto}`,
                                                                style: 'Contenido',
                                                                alignment: 'right',
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                text: 'AÑO DEL COMPROBANTE:',
                                                                style: 'Subtitulo',
                                                                margin: [-5, 0, 0, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                text: `${data.HISTORY_SICAM.yearComprobante}`,
                                                                style: 'Contenido',
                                                                alignment: 'right',
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                text: 'FOLIO DEL COMPROBANTE:',
                                                                style: 'Subtitulo',
                                                                margin: [-5, 0, 0, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                text: `${data.HISTORY_SICAM.folioComprobante}`,
                                                                style: 'Contenido',
                                                                alignment: 'right',
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                    ],
                                                },
                                                border: [false, false, false, false],
                                            },
                                            {
                                                table: {
                                                    widths: [mm2pixel(48), mm2pixel(48)],
                                                    body: [
                                                        [
                                                            {
                                                                text: 'DESCRIPCIÓN:',
                                                                style: 'Subtitulo',
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                text: `${data.HISTORY_SICAM.descripcion}`,
                                                                style: 'Contenido',
                                                                alignment: 'right',
                                                                margin: [0, 0, -5, 0],
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
                                margin: [-10, 0, 0, 0],
                            },
                        ],
                    ],
                },
            },
        ],
        styles: {
            Titulo: {
                fontSize: 14,
            },
            Subtitulo: {
                fontSize: 10,
                bold: true,
            },
            Contenido: {
                fontSize: 10,
            },
            Contenido2: {
                fontSize: 10,
                alignment: 'center',
            },
            Superficies: {
                alignment: 'center',
                fillColor: '#eeeeee',
                margin: [0, 0, 0, 15],
            },
            Valores: {
                alignment: 'center',
                color: '#bebebe',
                fillColor: '#3e3e3e',
                margin: [0, 0, 0, 15],
            },
        },
    };
    return dd;
};
//# sourceMappingURL=ficha-tecnica.js.map