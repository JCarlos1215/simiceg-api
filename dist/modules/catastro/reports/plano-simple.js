"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePlanoSimpleDocumentDefinition = void 0;
const mm2inches = (mm) => mm / 25.4;
const inches2pixel = (inches) => Math.round(inches * 72);
const mm2pixel = (mm) => inches2pixel(mm2inches(mm));
exports.generatePlanoSimpleDocumentDefinition = (data) => {
    const dd = {
        pageSize: getPageSize(data.TIPO_HOJA),
        pageOrientation: 'Landscape',
        pageMargins: [mm2pixel(5), mm2pixel(40), mm2pixel(5), 5],
        header: {
            table: {
                widths: ['*'],
                body: [
                    [
                        {
                            table: {
                                widths: getTitleWidths(data.TIPO_HOJA),
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
                                                    text: `Plano Simple - Clave Catastral: ${data.CLAVE_CATASTRAL}`,
                                                    fontSize: 12,
                                                    bold: true,
                                                    alignment: 'center',
                                                    margin: [0, 14, 0, 0],
                                                    border: [false],
                                                },
                                            ],
                                            border: [false, false, false, false],
                                        },
                                        {
                                            stack: [
                                                {
                                                    image: `${data.MANZANILLO_LOGO}`,
                                                    width: mm2pixel(49.7),
                                                    height: mm2pixel(21.5),
                                                    margin: [-4, 5, 0, 0],
                                                    border: [false, false, false, false],
                                                },
                                                {
                                                    text: 'Fecha de impresión: ',
                                                    fontSize: 10,
                                                    alignment: 'right',
                                                    margin: [0, 5, 2, 0],
                                                    border: [false],
                                                },
                                                {
                                                    text: `${data.FECHA_EMISION}`,
                                                    bold: true,
                                                    fontSize: 10,
                                                    alignment: 'right',
                                                    margin: [0, -1, 2, 0],
                                                    border: [false],
                                                },
                                            ],
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
        content: [
            {
                table: {
                    widths: getMainWidths(data.TIPO_HOJA),
                    body: [
                        [
                            {
                                border: [false, false, false, false],
                                table: {
                                    widths: getCroquisSectionWidths(data.TIPO_HOJA),
                                    body: [
                                        [
                                            {
                                                image: `${data.CROQUIS}`,
                                                width: getCroquisWidth(data.TIPO_HOJA),
                                                height: getCroquisHeight(data.TIPO_HOJA),
                                                margin: [-10, -5, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                image: `${data.NORTE}`,
                                                width: mm2pixel(6),
                                                height: mm2pixel(10),
                                                margin: [-42, 5, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                    ],
                                },
                            },
                        ],
                        [
                            {
                                border: [false, false, false, false],
                                table: {
                                    widths: [mm2pixel(240)],
                                    body: [
                                        [
                                            {
                                                border: [false, false, false, false],
                                                table: {
                                                    widths: ['*'],
                                                    body: [
                                                        [
                                                            {
                                                                text: `${data.OBSERVATION}`,
                                                                bold: true,
                                                                fontSize: 7,
                                                                margin: [-14, -2, 0, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                table: {
                                                                    widths: [
                                                                        mm2pixel(5),
                                                                        mm2pixel(5),
                                                                        mm2pixel(10),
                                                                        mm2pixel(10),
                                                                        mm2pixel(10),
                                                                        mm2pixel(5),
                                                                    ],
                                                                    body: [
                                                                        [
                                                                            { text: ' ', style: 'SmallBar', fillColor: '#000000' },
                                                                            { text: ' ', style: 'SmallBar' },
                                                                            { text: ' ', style: 'SmallBar', fillColor: '#000000' },
                                                                            { text: ' ', style: 'SmallBar', colSpan: 2 },
                                                                            {},
                                                                            { text: ' ', style: 'SmallBar', border: [true, false, false, false] },
                                                                        ],
                                                                        [
                                                                            { text: ' ', style: 'SmallBar' },
                                                                            { text: ' ', style: 'SmallBar', fillColor: '#000000' },
                                                                            { text: ' ', style: 'SmallBar' },
                                                                            { text: ' ', style: 'SmallBar', colSpan: 2, fillColor: '#000000' },
                                                                            {},
                                                                            { text: ' ', style: 'SmallBar', border: [true, false, false, false] },
                                                                        ],
                                                                        [
                                                                            {
                                                                                text: `${(data.ESCALA / 100).toFixed(1)}`,
                                                                                style: 'SmallScale',
                                                                                border: [false, false, false, false],
                                                                            },
                                                                            {
                                                                                text: '',
                                                                                style: 'SmallScale',
                                                                                border: [false, false, false, false],
                                                                            },
                                                                            {
                                                                                text: '0',
                                                                                style: 'SmallScale',
                                                                                border: [false, false, false, false],
                                                                            },
                                                                            {
                                                                                text: `${(data.ESCALA / 100).toFixed(1)}`,
                                                                                style: 'SmallScale',
                                                                                border: [false, false, false, false],
                                                                            },
                                                                            {
                                                                                text: '',
                                                                                style: 'SmallScale',
                                                                                border: [false, false, false, false],
                                                                            },
                                                                            {
                                                                                text: `${(3 * (data.ESCALA / 100)).toFixed(1)}`,
                                                                                style: 'SmallScale',
                                                                                border: [false, false, false, false],
                                                                            },
                                                                        ],
                                                                    ],
                                                                    style: 'SmallScale',
                                                                },
                                                                border: [false, false, false, false],
                                                                layout: {
                                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                                                                    paddingLeft: (_i, _node) => {
                                                                        return 0;
                                                                    },
                                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                                                                    paddingRight: (_i, _node) => {
                                                                        return 0;
                                                                    },
                                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                                                                    paddingTop: (_i, _node) => {
                                                                        return 0;
                                                                    },
                                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                                                                    paddingBottom: (_i, _node) => {
                                                                        return 0;
                                                                    },
                                                                },
                                                            },
                                                        ],
                                                        [
                                                            {
                                                                text: `ESCALA: 1:${data.ESCALA.toString()}`,
                                                                bold: true,
                                                                fontSize: 7,
                                                                margin: [-14, -2, 0, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                    ],
                                                },
                                            },
                                        ],
                                    ],
                                },
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
                fontSize: 6,
                alignment: 'center',
                bold: true,
            },
            Contenido: {
                fontSize: 8,
                alignment: 'center',
            },
            SmallScale: {
                fontSize: 5,
                border: [false, false, false, false],
            },
            SmallBar: {
                fontSize: 2,
            },
        },
    };
    return dd;
};
const getPageSize = (size) => {
    let sizePage;
    switch (size) {
        case 'carta':
            sizePage = 'LETTER';
            break;
        case 'oficio':
            sizePage = { width: mm2pixel(330), height: mm2pixel(215.9) };
            break;
        case 'tabloide':
            sizePage = 'TABLOID';
            break;
        case '60':
            sizePage = { width: mm2pixel(600), height: mm2pixel(600) };
            break;
        case '90':
            sizePage = { width: mm2pixel(900), height: mm2pixel(900) };
            break;
        default:
            sizePage = 'LETTER';
            break;
    }
    return sizePage;
};
const getTitleWidths = (size) => {
    let widths;
    switch (size) {
        case 'carta':
            widths = [mm2pixel(214.4), mm2pixel(49.7)];
            break;
        case 'oficio':
            widths = [mm2pixel(264.4), mm2pixel(49.7)];
            break;
        case 'tabloide':
            widths = [mm2pixel(366.4), mm2pixel(49.7)];
            break;
        case '60':
            widths = [mm2pixel(534.4), mm2pixel(49.7)];
            break;
        case '90':
            widths = [mm2pixel(834.4), mm2pixel(49.7)];
            break;
        default:
            widths = [mm2pixel(214.4), mm2pixel(49.7)];
            break;
    }
    return widths;
};
const getMainWidths = (size) => {
    let widths;
    switch (size) {
        case 'carta':
            widths = [mm2pixel(266)];
            break;
        case 'oficio':
            widths = [mm2pixel(316)];
            break;
        case 'tabloide':
            widths = [mm2pixel(418)];
            break;
        case '60':
            widths = [mm2pixel(586)];
            break;
        case '90':
            widths = [mm2pixel(886)];
            break;
        default:
            widths = [mm2pixel(266)];
            break;
    }
    return widths;
};
const getCroquisSectionWidths = (size) => {
    let widths;
    switch (size) {
        case 'carta':
            widths = [mm2pixel(268), mm2pixel(10)];
            break;
        case 'oficio':
            widths = [mm2pixel(318), mm2pixel(10)];
            break;
        case 'tabloide':
            widths = [mm2pixel(420), mm2pixel(10)];
            break;
        case '60':
            widths = [mm2pixel(588), mm2pixel(10)];
            break;
        case '90':
            widths = [mm2pixel(888), mm2pixel(10)];
            break;
        default:
            widths = [mm2pixel(268), mm2pixel(10)];
            break;
    }
    return widths;
};
const getCroquisWidth = (size) => {
    let width;
    switch (size) {
        case 'carta':
            width = mm2pixel(270);
            break;
        case 'oficio':
            width = mm2pixel(320);
            break;
        case 'tabloide':
            width = mm2pixel(422);
            break;
        case '60':
            width = mm2pixel(590);
            break;
        case '90':
            width = mm2pixel(890);
            break;
        default:
            width = mm2pixel(270);
            break;
    }
    return width;
};
const getCroquisHeight = (size) => {
    let height;
    switch (size) {
        case 'carta':
            height = mm2pixel(147);
            break;
        case 'oficio':
            height = mm2pixel(147);
            break;
        case 'tabloide':
            height = mm2pixel(212);
            break;
        case '60':
            height = mm2pixel(532);
            break;
        case '90':
            height = mm2pixel(832);
            break;
        default:
            height = mm2pixel(147);
            break;
    }
    return height;
};
//# sourceMappingURL=plano-simple.js.map