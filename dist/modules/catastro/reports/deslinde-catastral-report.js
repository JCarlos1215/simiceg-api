"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDeslindeCatastralDocumentDefinition = void 0;
const mm2inches = (mm) => mm / 25.4;
const inches2pixel = (inches) => Math.round(inches * 72);
const mm2pixel = (mm) => inches2pixel(mm2inches(mm));
exports.generateDeslindeCatastralDocumentDefinition = (data) => {
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
                                                    text: `Deslinde Catastral`,
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
        content: [
            {
                table: {
                    widths: [mm2pixel(202)],
                    body: [
                        [
                            {
                                table: {
                                    widths: [mm2pixel(202), mm2pixel(10)],
                                    body: [
                                        [
                                            {
                                                text: 'Croquis del predio',
                                                style: 'Titulo',
                                                alignment: 'center',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: '',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                image: `${data.CROQUIS}`,
                                                width: mm2pixel(205.7),
                                                height: mm2pixel(92.8),
                                                style: 'Contenido',
                                                margin: [-5, 0, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                image: `${data.NORTE}`,
                                                width: mm2pixel(6),
                                                height: mm2pixel(10),
                                                margin: [-35, 5, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                    ],
                                },
                                border: [false, false, false, false],
                                margin: [-5, 0, 0, 0],
                            },
                        ],
                        [
                            {
                                text: 'Deslinde',
                                style: 'Titulo',
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                text: `${data.DESLINDE.descripcion}`,
                                style: 'Contenido',
                                margin: [-5, 0, -5, 0],
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                text: 'Colindancia al norte',
                                style: 'Subtitulo',
                                fillColor: '#fbea00',
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                text: `${data.DESLINDE.colindanciaNorte}`,
                                style: 'Contenido',
                                margin: [-5, 0, -5, 0],
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                text: 'Colindancia al este',
                                style: 'Subtitulo',
                                fillColor: '#26e600',
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                text: `${data.DESLINDE.colindanciaEste}`,
                                style: 'Contenido',
                                margin: [-5, 0, -5, 0],
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                text: 'Colindancia al sur',
                                style: 'Subtitulo',
                                fillColor: '#45c8f4',
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                text: `${data.DESLINDE.colindanciaSur}`,
                                style: 'Contenido',
                                margin: [-5, 0, -5, 0],
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                text: 'Colindancia al oeste',
                                style: 'Subtitulo',
                                fillColor: '#ec518c',
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                text: `${data.DESLINDE.colindanciaOeste}`,
                                style: 'Contenido',
                                margin: [-5, 0, -5, 0],
                                border: [false, false, false, false],
                            },
                        ],
                    ],
                },
            },
        ],
        styles: {
            Titulo: {
                fontSize: 9,
                alignment: 'center',
                bold: true,
                fillColor: '#d9d9d9',
            },
            Subtitulo: {
                fontSize: 9,
                alignment: 'center',
                bold: true,
            },
            Contenido: {
                fontSize: 8,
                alignment: 'justify',
            },
        },
    };
    return dd;
};
//# sourceMappingURL=deslinde-catastral-report.js.map