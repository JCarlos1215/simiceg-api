"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAvaluoSimpleDocumentDefinition = void 0;
const formatted_number_1 = require("@src/utils/formatted-number");
const mm2inches = (mm) => mm / 25.4;
const inches2pixel = (inches) => Math.round(inches * 72);
const mm2pixel = (mm) => inches2pixel(mm2inches(mm));
exports.generateAvaluoSimpleDocumentDefinition = (data) => {
    const dd = {
        pageSize: { width: mm2pixel(215.9), height: mm2pixel(330) },
        pageMargins: [mm2pixel(5), mm2pixel(35), mm2pixel(5), 28],
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
                                                    text: `Avalúo Catastral ${data.TYPE_TITLE}`,
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
                                            stack: [
                                                {
                                                    image: `${data.MANZANILLO_LOGO}`,
                                                    width: mm2pixel(49.7),
                                                    height: mm2pixel(21.5),
                                                    margin: [-4, 5, 0, 0],
                                                    border: [false, false, false, false],
                                                },
                                                {
                                                    text: [
                                                        'Fecha: ',
                                                        {
                                                            text: `${data.FECHA_EMISION}`,
                                                            bold: false,
                                                        },
                                                    ],
                                                    bold: true,
                                                    fontSize: 10,
                                                    alignment: 'right',
                                                    margin: [0, 5, -4, 0],
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
                                    widths: [
                                        mm2pixel(21),
                                        mm2pixel(35),
                                        mm2pixel(31.5),
                                        mm2pixel(7),
                                        mm2pixel(7),
                                        mm2pixel(10),
                                        mm2pixel(5),
                                        mm2pixel(10),
                                        mm2pixel(7),
                                        mm2pixel(9),
                                        mm2pixel(8),
                                        mm2pixel(7),
                                        mm2pixel(7),
                                    ],
                                    body: [
                                        [
                                            {
                                                text: 'Cuenta predial',
                                                style: 'Titulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Clave catastral',
                                                style: 'Titulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'CURT',
                                                style: 'Titulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Clave catastral normalizada',
                                                style: 'Titulo',
                                                colSpan: 10,
                                                border: [false, false, false, false],
                                            },
                                            {},
                                            {},
                                            {},
                                            {},
                                            {},
                                            {},
                                            {},
                                            {},
                                            {},
                                        ],
                                        [
                                            {
                                                text: `${data.AVALUO_DATA.clave.cuenta}`,
                                                style: 'Contenido',
                                                rowSpan: 2,
                                                margin: [0, 6, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.AVALUO_DATA.predio.formattedClave}`,
                                                style: 'Contenido',
                                                rowSpan: 2,
                                                margin: [0, 6, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.AVALUO_DATA.clave.CURT}`,
                                                style: 'Contenido',
                                                rowSpan: 2,
                                                margin: [0, 6, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Estado',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Región',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Municipio',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Zona',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Localidad',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Sector',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Manzana',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Predio',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Edificio',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Unidad',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {},
                                            {},
                                            {},
                                            {
                                                text: `${data.AVALUO_DATA.clave.estado}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.AVALUO_DATA.clave.region}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.AVALUO_DATA.clave.municipio}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.AVALUO_DATA.clave.zona}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.AVALUO_DATA.clave.localidad}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.AVALUO_DATA.clave.sector}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.AVALUO_DATA.clave.manzana}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.AVALUO_DATA.clave.predio}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.AVALUO_DATA.clave.edificio}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.AVALUO_DATA.clave.unidad}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                    ],
                                },
                                border: [false, false, false, false],
                                margin: [-5, 0, 0, 10],
                            },
                        ],
                        [
                            {
                                text: 'Ubicación del predio',
                                style: 'Titulo',
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                table: {
                                    widths: [
                                        mm2pixel(49.5),
                                        mm2pixel(12),
                                        mm2pixel(12),
                                        mm2pixel(48.7),
                                        mm2pixel(14),
                                        mm2pixel(14),
                                        mm2pixel(16),
                                        mm2pixel(14),
                                    ],
                                    body: [
                                        [
                                            {
                                                text: 'Calle',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'No. exterior',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'No. interior',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Colonia',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Área Carto.',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Área Padrón',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Perímetro',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Forma',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: `${data.AVALUO_DATA.ubication.ubicacion}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.AVALUO_DATA.ubication.numeroExterior}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.AVALUO_DATA.ubication.numeroInterior}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.AVALUO_DATA.ubication.colonia}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${formatted_number_1.getFormattedNumber(data.AVALUO_DATA.clave.areaCartografica)}m²`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${formatted_number_1.getFormattedNumber(data.AVALUO_DATA.ubication.areaTitulo)}m²`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${formatted_number_1.getFormattedNumber(data.AVALUO_DATA.clave.perimetro)}m`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.AVALUO_DATA.clave.forma}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                    ],
                                },
                                border: [false, false, false, false],
                                margin: [-5, -3, 0, 10],
                            },
                        ],
                        [
                            {
                                table: {
                                    widths: [mm2pixel(100), mm2pixel(100)],
                                    body: [
                                        [
                                            {
                                                image: `${data.CROQUIS_PREDIO}`,
                                                width: mm2pixel(100.7),
                                                height: mm2pixel(92.8),
                                                margin: [-4, 0, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                image: `${data.CROQUIS_MANZANA}`,
                                                width: mm2pixel(100.7),
                                                height: mm2pixel(92.8),
                                                margin: [3, 0, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: 'Croquis de localización del predio',
                                                style: 'Contenido',
                                                alignment: 'center',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Croquis de localización del predio en manzana',
                                                style: 'Contenido',
                                                alignment: 'center',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                    ],
                                },
                                border: [false, false, false, false],
                                margin: [-5, 0, 0, 10],
                            },
                        ],
                        [
                            {
                                text: 'Avalúo de terreno',
                                style: 'Titulo',
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                table: {
                                    widths: [
                                        mm2pixel(14),
                                        mm2pixel(14),
                                        mm2pixel(14),
                                        mm2pixel(14),
                                        mm2pixel(6),
                                        mm2pixel(6),
                                        mm2pixel(6),
                                        mm2pixel(10),
                                        mm2pixel(22),
                                        mm2pixel(27),
                                        mm2pixel(37.5),
                                    ],
                                    body: [
                                        [
                                            {
                                                text: 'Valores',
                                                style: 'Titulo2',
                                                colSpan: 2,
                                                border: [false, false, true, false],
                                            },
                                            {},
                                            {
                                                text: 'Longitudes',
                                                style: 'Titulo2',
                                                colSpan: 2,
                                                border: [false, false, false, false],
                                            },
                                            {},
                                            {
                                                text: 'Deméritos',
                                                style: 'Titulo2',
                                                colSpan: 3,
                                                border: [true, false, true, false],
                                            },
                                            {},
                                            {},
                                            {
                                                text: 'Factor',
                                                style: 'Titulo2',
                                                rowSpan: 2,
                                                margin: [0, 4, 0, 0],
                                                border: [false, false, true, false],
                                            },
                                            {
                                                text: 'Valor reducido',
                                                style: 'Titulo2',
                                                rowSpan: 2,
                                                margin: [0, 4, 0, 0],
                                                border: [false, false, true, false],
                                            },
                                            {
                                                text: 'Superficie',
                                                style: 'Titulo2',
                                                rowSpan: 2,
                                                margin: [0, 4, 0, 0],
                                                border: [false, false, true, false],
                                            },
                                            {
                                                text: 'Valor',
                                                style: 'Titulo2',
                                                rowSpan: 2,
                                                margin: [0, 4, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: 'De calle',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'De zona',
                                                style: 'Titulo2',
                                                border: [false, false, true, false],
                                            },
                                            {
                                                text: 'F',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'P',
                                                style: 'Titulo2',
                                                border: [false, false, true, false],
                                            },
                                            {
                                                text: 'F',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'P',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'S',
                                                style: 'Titulo2',
                                                border: [false, false, true, false],
                                            },
                                            {},
                                            {},
                                            {},
                                            {},
                                        ],
                                        ...data.AVALUO_DATA.terrain.map((row) => [
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(row.valorCalle)}`,
                                                style: 'Contenido2',
                                                border: [false, false, true, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(row.valorZona)}`,
                                                style: 'Contenido2',
                                                border: [false, false, true, false],
                                            },
                                            {
                                                text: `${formatted_number_1.getFormattedNumber(row.frente)}m`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${formatted_number_1.getFormattedNumber(row.profundidad)}m`,
                                                style: 'Contenido2',
                                                border: [false, false, true, false],
                                            },
                                            {
                                                text: `${row.demeritoFrente}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${row.demeritoProfundidad}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${row.demeritoSuperficie}`,
                                                style: 'Contenido2',
                                                border: [false, false, true, false],
                                            },
                                            {
                                                text: `${row.factor.toFixed(5)}`,
                                                style: 'Contenido2',
                                                border: [false, false, true, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(row.valorReducido)}`,
                                                style: 'Contenido2',
                                                border: [false, false, true, false],
                                            },
                                            {
                                                text: `${formatted_number_1.getFormattedNumber(row.superficie)}m²`,
                                                style: 'Contenido2',
                                                border: [false, false, true, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(row.valor)}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                        ]),
                                        [
                                            {
                                                text: 'Suma',
                                                style: 'Contenido',
                                                bold: true,
                                                alignment: 'right',
                                                colSpan: 10,
                                                fillColor: '#eeeeee',
                                                border: [false, false, false, false],
                                            },
                                            {},
                                            {},
                                            {},
                                            {},
                                            {},
                                            {},
                                            {},
                                            {},
                                            {},
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(data.AVALUO_DATA.totalTerrainValue)}`,
                                                style: 'Contenido',
                                                bold: true,
                                                fillColor: '#eeeeee',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                    ],
                                },
                                border: [false, false, false, false],
                                margin: [-4.5, -3, 0, 10],
                            },
                        ],
                        getTitleAvaluoCorner(data.AVALUO_DATA.corner),
                        getDataAvaluoCorner(data.AVALUO_DATA.corner, data.AVALUO_DATA.totalCornerValue),
                        [
                            {
                                text: 'Avalúo de la construcción',
                                style: 'Titulo',
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                table: {
                                    widths: [
                                        mm2pixel(8),
                                        mm2pixel(8),
                                        mm2pixel(24),
                                        mm2pixel(8),
                                        mm2pixel(33),
                                        mm2pixel(30),
                                        mm2pixel(33),
                                        mm2pixel(36),
                                    ],
                                    body: [
                                        [
                                            {
                                                text: 'Bloque',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Niveles',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Clasificación',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Volado',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Valor Unitario',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Factor Construcción',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Superficie',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Total',
                                                style: 'Subtitulo',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        ...data.AVALUO_DATA.construction.map((row) => [
                                            {
                                                text: `${row.bloque}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${row.nivel}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${row.ce}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${row.volado}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$ ${formatted_number_1.getFormattedNumber(row.valorUnitario)}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$ ${formatted_number_1.getFormattedNumber(row.valorUnitarioIncrementado)}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${formatted_number_1.getFormattedNumber(row.sc)}m²`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$ ${formatted_number_1.getFormattedNumber(row.valor)}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                        ]),
                                        [
                                            {
                                                text: 'Suma',
                                                style: 'Contenido',
                                                bold: true,
                                                alignment: 'right',
                                                colSpan: 6,
                                                fillColor: '#eeeeee',
                                                border: [false, false, false, false],
                                            },
                                            {},
                                            {},
                                            {},
                                            {},
                                            {},
                                            {
                                                text: `${formatted_number_1.getFormattedNumber(data.AVALUO_DATA.totalConstruction)}m²`,
                                                style: 'Contenido',
                                                bold: true,
                                                fillColor: '#eeeeee',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(data.AVALUO_DATA.totalConstructionValue)}`,
                                                style: 'Contenido',
                                                bold: true,
                                                fillColor: '#eeeeee',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                    ],
                                },
                                border: [false, false, false, false],
                                margin: [-5, -3, 0, 0],
                            },
                        ],
                        [
                            {
                                table: {
                                    widths: [
                                        mm2pixel(34),
                                        mm2pixel(5),
                                        mm2pixel(22),
                                        mm2pixel(5),
                                        mm2pixel(34),
                                        mm2pixel(5),
                                        mm2pixel(34),
                                        mm2pixel(5),
                                        mm2pixel(34),
                                    ],
                                    body: [
                                        [
                                            {
                                                text: 'Avalúo de terreno',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: '+',
                                                style: 'Contenido',
                                                rowSpan: 2,
                                                margin: [0, 6, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Predio en esquina',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: '=',
                                                style: 'Contenido',
                                                rowSpan: 2,
                                                margin: [0, 6, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Valor total de terreno',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: '+',
                                                style: 'Contenido',
                                                rowSpan: 2,
                                                margin: [0, 6, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Valor total de construcción',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: '=',
                                                style: 'Contenido',
                                                rowSpan: 2,
                                                margin: [0, 6, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Valor fiscal',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(data.AVALUO_DATA.totalTerrainValue)}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {},
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(data.AVALUO_DATA.totalCornerValue)}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {},
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(data.AVALUO_DATA.totalTerrainCornerValue)}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {},
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(data.AVALUO_DATA.totalConstructionValue)}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {},
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(data.AVALUO_DATA.totalValue)}`,
                                                style: 'Contenido2',
                                                bold: true,
                                                border: [false, false, false, false],
                                            },
                                        ],
                                    ],
                                },
                                border: [false, false, false, false],
                                margin: [-5, 0, 0, 10],
                            },
                        ],
                        [
                            {
                                text: 'Observaciones',
                                style: 'Titulo',
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                text: `${data.OBSERVACIONES}`,
                                style: 'Contenido2',
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                table: {
                                    widths: ['*', '*'],
                                    body: [
                                        [
                                            {
                                                text: 'Valuador',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Revisó',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: `${data.VALUADOR}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.REVISO}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                    ],
                                },
                                border: [false, false, false, false],
                                margin: [-5, 0, 0, 0],
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
            Titulo2: {
                fontSize: 6,
                alignment: 'center',
                bold: true,
                fillColor: '#eeeeee',
            },
            Subtitulo: {
                fontSize: 6,
                alignment: 'center',
                bold: true,
            },
            Contenido: {
                fontSize: 7,
                alignment: 'center',
            },
            Contenido2: {
                fontSize: 7,
                alignment: 'center',
            },
        },
    };
    return dd;
};
const getTitleAvaluoCorner = (avaluoCorner) => {
    if (avaluoCorner.length > 0) {
        return [
            {
                text: 'Avalúo de esquina',
                style: 'Titulo',
                border: [false, false, false, false],
            },
        ];
    }
    else {
        return [
            {
                text: '',
                style: '',
                fontSize: 0,
                border: [false, false, false, false],
            },
        ];
    }
};
const getDataAvaluoCorner = (avaluoCorner, totalCornerValue) => {
    if (avaluoCorner.length > 0) {
        return [
            {
                table: {
                    widths: [
                        mm2pixel(4),
                        mm2pixel(23),
                        mm2pixel(12),
                        mm2pixel(10),
                        mm2pixel(23),
                        mm2pixel(12),
                        mm2pixel(10),
                        mm2pixel(14),
                        mm2pixel(10),
                        mm2pixel(15),
                        mm2pixel(14),
                        mm2pixel(20.8),
                    ],
                    body: [
                        [
                            {
                                text: 'No.',
                                style: 'Titulo2',
                                margin: [0, 4, 0, 0],
                                border: [false, false, false, false],
                            },
                            {
                                text: 'Calle A',
                                style: 'Titulo2',
                                margin: [0, 4, 0, 0],
                                border: [false, false, false, false],
                            },
                            {
                                text: 'Valor m²',
                                style: 'Titulo2',
                                margin: [0, 4, 0, 0],
                                border: [false, false, false, false],
                            },
                            {
                                text: 'Medida',
                                style: 'Titulo2',
                                margin: [0, 4, 0, 0],
                                border: [false, false, false, false],
                            },
                            {
                                text: 'Calle B',
                                style: 'Titulo2',
                                margin: [0, 4, 0, 0],
                                border: [false, false, false, false],
                            },
                            {
                                text: 'Valor m²',
                                style: 'Titulo2',
                                margin: [0, 4, 0, 0],
                                border: [false, false, false, false],
                            },
                            {
                                text: 'Medida',
                                style: 'Titulo2',
                                margin: [0, 4, 0, 0],
                                border: [false, false, false, false],
                            },
                            {
                                text: 'Valor promedio',
                                style: 'Titulo2',
                                border: [false, false, false, false],
                            },
                            {
                                text: 'Factor de zona',
                                style: 'Titulo2',
                                border: [false, false, false, false],
                            },
                            {
                                text: 'Uso',
                                style: 'Titulo2',
                                margin: [0, 4, 0, 0],
                                border: [false, false, false, false],
                            },
                            {
                                text: 'Superficie',
                                style: 'Titulo2',
                                margin: [0, 4, 0, 0],
                                border: [false, false, false, false],
                            },
                            {
                                text: 'Valor Esquina',
                                style: 'Titulo2',
                                margin: [0, 4, 0, 0],
                                border: [false, false, false, false],
                            },
                        ],
                        ...avaluoCorner.map((row) => [
                            {
                                text: `${row.numero}`,
                                style: 'Contenido2',
                                border: [false, false, false, false],
                            },
                            {
                                text: `${row.nombreCalleA}`,
                                style: 'Contenido2',
                                border: [false, false, false, false],
                            },
                            {
                                text: `$${row.valorCalleA}`,
                                style: 'Contenido2',
                                border: [false, false, false, false],
                            },
                            {
                                text: `${formatted_number_1.getFormattedNumber(row.medidaFrenteA)}m`,
                                style: 'Contenido2',
                                border: [false, false, false, false],
                            },
                            {
                                text: `${row.nombreCalleB}`,
                                style: 'Contenido2',
                                border: [false, false, false, false],
                            },
                            {
                                text: `$${row.valorCalleB}`,
                                style: 'Contenido2',
                                border: [false, false, false, false],
                            },
                            {
                                text: `${formatted_number_1.getFormattedNumber(row.medidaFrenteB)}m`,
                                style: 'Contenido2',
                                border: [false, false, false, false],
                            },
                            {
                                text: `$${formatted_number_1.getFormattedNumber(row.valorPromedio)}`,
                                style: 'Contenido2',
                                border: [false, false, false, false],
                            },
                            {
                                text: `${row.factorZona}`,
                                style: 'Contenido2',
                                border: [false, false, false, false],
                            },
                            {
                                text: `${row.uso}`,
                                style: 'Contenido2',
                                border: [false, false, false, false],
                            },
                            {
                                text: `${formatted_number_1.getFormattedNumber(row.superficieEsquina)}m²`,
                                style: 'Contenido2',
                                border: [false, false, false, false],
                            },
                            {
                                text: `$${formatted_number_1.getFormattedNumber(row.valorEsquina)}`,
                                style: 'Contenido2',
                                border: [false, false, false, false],
                            },
                        ]),
                        [
                            {
                                text: 'Suma',
                                style: 'Contenido',
                                bold: true,
                                alignment: 'right',
                                colSpan: 11,
                                fillColor: '#eeeeee',
                                border: [false, false, false, false],
                            },
                            {},
                            {},
                            {},
                            {},
                            {},
                            {},
                            {},
                            {},
                            {},
                            {},
                            {
                                text: `$${formatted_number_1.getFormattedNumber(totalCornerValue)}`,
                                style: 'Contenido',
                                bold: true,
                                fillColor: '#eeeeee',
                                border: [false, false, false, false],
                            },
                        ],
                    ],
                },
                border: [false, false, false, false],
                margin: [-4.5, -3, 0, 10],
            },
        ];
    }
    else {
        return [
            {
                text: '',
                style: '',
                fontSize: 0,
                border: [false, false, false, false],
            },
        ];
    }
};
//# sourceMappingURL=avaluo-simple.js.map