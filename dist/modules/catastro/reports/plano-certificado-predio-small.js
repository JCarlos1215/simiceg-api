"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePlanoCertificatePredioSmallDocumentDefinition = void 0;
const formatted_number_1 = require("@src/utils/formatted-number");
const mm2inches = (mm) => mm / 25.4;
const inches2pixel = (inches) => Math.round(inches * 72);
const mm2pixel = (mm) => inches2pixel(mm2inches(mm));
exports.generatePlanoCertificatePredioSmallDocumentDefinition = (data) => {
    const dd = {
        pageSize: getPageSize(data.TIPO_HOJA),
        pageOrientation: 'Landscape',
        pageMargins: [mm2pixel(5), mm2pixel(5), mm2pixel(5), 20],
        footer(currentPage, pageCount) {
            return {
                table: {
                    widths: getFooterWidths(data.TIPO_HOJA),
                    body: [
                        [
                            {
                                text: '',
                                bold: true,
                                fontSize: 8,
                                alignment: 'left',
                                margin: [10, -5, 0, 0],
                                border: [false, false, false, false],
                            },
                            {
                                text: 'ESTE DOCUMENTO NO SERÁ VALIDO COMO CERTIFICADO SI NO PRESENTA LA FIRMA Y EL SELLO CORRESPONDIENTES',
                                style: 'Texto',
                                bold: true,
                                margin: [0, -5, 0, 0],
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
                                margin: [0, -5, 10, 0],
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
                    widths: getMainWidths(data.TIPO_HOJA),
                    body: [
                        [
                            {
                                table: {
                                    widths: getTableCroquisWidths(data.TIPO_HOJA),
                                    body: [
                                        [
                                            {
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
                                                margin: [-4, -3, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                table: {
                                                    widths: getConstructionSquareSectionWidths(data.TIPO_HOJA),
                                                    body: [
                                                        [
                                                            {
                                                                table: {
                                                                    widths: getTableConstructionSquareWidths(data.TIPO_HOJA),
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: 'CUADRO DE CONSTRUCCIÓN (según cartografía)',
                                                                                style: 'Titulo',
                                                                                colSpan: 7,
                                                                            },
                                                                            {},
                                                                            {},
                                                                            {},
                                                                            {},
                                                                            {},
                                                                            {},
                                                                        ],
                                                                        [
                                                                            {
                                                                                text: 'Lado',
                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                colSpan: 2,
                                                                                margin: [0, -1, 0, -2],
                                                                            },
                                                                            {},
                                                                            {
                                                                                text: 'Rumbo',
                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                rowSpan: 2,
                                                                                margin: [0, 2, 0, -2],
                                                                            },
                                                                            {
                                                                                text: 'Distancia',
                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                rowSpan: 2,
                                                                                margin: [0, 2, 0, -2],
                                                                            },
                                                                            {
                                                                                text: 'V',
                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                rowSpan: 2,
                                                                                margin: [0, 2, 0, -2],
                                                                            },
                                                                            {
                                                                                text: 'Coordenada UTM',
                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                colSpan: 2,
                                                                                margin: [0, -2, 0, -2],
                                                                            },
                                                                            {},
                                                                        ],
                                                                        [
                                                                            {
                                                                                text: 'EST',
                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                margin: [0, -2, 0, -2],
                                                                            },
                                                                            {
                                                                                text: 'PV',
                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                margin: [0, -2, 0, -2],
                                                                            },
                                                                            {},
                                                                            {},
                                                                            {},
                                                                            {
                                                                                text: 'y',
                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                margin: [0, -3, 0, -2],
                                                                            },
                                                                            {
                                                                                text: 'x',
                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                margin: [0, -3, 0, -2],
                                                                            },
                                                                        ],
                                                                        ...data.PLANO_CERTIFICATE.map((row) => [
                                                                            {
                                                                                text: `${row.est}`,
                                                                                style: 'Cuadro',
                                                                                margin: [0, -2, 0, -2],
                                                                            },
                                                                            {
                                                                                text: `${row.pv}`,
                                                                                style: 'Cuadro',
                                                                                margin: [0, -2, 0, -2],
                                                                            },
                                                                            {
                                                                                text: `${row.rumbo}`,
                                                                                style: 'Cuadro',
                                                                                margin: [0, -2, 0, -2],
                                                                            },
                                                                            {
                                                                                text: `${row.distancia}`,
                                                                                style: 'Cuadro',
                                                                                margin: [0, -2, 0, -2],
                                                                            },
                                                                            {
                                                                                text: `${row.v}`,
                                                                                style: 'Cuadro',
                                                                                margin: [0, -2, 0, -2],
                                                                            },
                                                                            {
                                                                                text: `${formatted_number_1.getFormattedNumber(row.yUTM)}`,
                                                                                style: 'Cuadro',
                                                                                margin: [0, -2, 0, -2],
                                                                            },
                                                                            {
                                                                                text: `${formatted_number_1.getFormattedNumber(row.xUTM)}`,
                                                                                style: 'Cuadro',
                                                                                margin: [0, -2, 0, -2],
                                                                            },
                                                                        ]),
                                                                    ],
                                                                },
                                                                margin: [-10, 0, 0, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                            {
                                                                table: {
                                                                    widths: getNormalizedClaveSectionWidths(data.TIPO_HOJA),
                                                                    body: [
                                                                        [
                                                                            {
                                                                                table: {
                                                                                    widths: getTableNormalizedClaveWidths(data.TIPO_HOJA),
                                                                                    body: [
                                                                                        [
                                                                                            {
                                                                                                text: 'CLAVE NORMALIZADA',
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
                                                                                                text: 'Estado',
                                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                                rowSpan: 2,
                                                                                                margin: [0, 2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: 'Región',
                                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                                rowSpan: 2,
                                                                                                margin: [0, 2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: 'Municipio',
                                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                                rowSpan: 2,
                                                                                                margin: [0, 2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: 'Zona',
                                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                                rowSpan: 2,
                                                                                                margin: [0, 2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: 'Localidad',
                                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                                rowSpan: 2,
                                                                                                margin: [0, 2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: 'Sector',
                                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                                rowSpan: 2,
                                                                                                margin: [0, 2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: 'Manzana',
                                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                                rowSpan: 2,
                                                                                                margin: [0, 2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: 'Predio',
                                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                                rowSpan: 2,
                                                                                                margin: [0, 2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: 'Condominio',
                                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                                colSpan: 2,
                                                                                                margin: [0, -2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {},
                                                                                        ],
                                                                                        [
                                                                                            {},
                                                                                            {},
                                                                                            {},
                                                                                            {},
                                                                                            {},
                                                                                            {},
                                                                                            {},
                                                                                            {},
                                                                                            {
                                                                                                text: 'Edificio',
                                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                                margin: [0, -2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: 'Unidad',
                                                                                                style: ['Cuadro', 'Subtitulo'],
                                                                                                margin: [0, -2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                        ],
                                                                                        [
                                                                                            {
                                                                                                text: `${data.PLANO_CERTIFICATE[0].estado}`,
                                                                                                style: 'Cuadro',
                                                                                                fontSize: 7,
                                                                                                margin: [0, -2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: `${data.PLANO_CERTIFICATE[0].region}`,
                                                                                                style: 'Cuadro',
                                                                                                fontSize: 7,
                                                                                                margin: [0, -2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: `${data.PLANO_CERTIFICATE[0].municipio}`,
                                                                                                style: 'Cuadro',
                                                                                                fontSize: 7,
                                                                                                margin: [0, -2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: `${data.PLANO_CERTIFICATE[0].zona}`,
                                                                                                style: 'Cuadro',
                                                                                                fontSize: 7,
                                                                                                margin: [0, -2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: `${data.PLANO_CERTIFICATE[0].localidad}`,
                                                                                                style: 'Cuadro',
                                                                                                fontSize: 7,
                                                                                                margin: [0, -2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: `${data.PLANO_CERTIFICATE[0].sector}`,
                                                                                                style: 'Cuadro',
                                                                                                fontSize: 7,
                                                                                                margin: [0, -2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: `${data.PLANO_CERTIFICATE[0].manzana}`,
                                                                                                style: 'Cuadro',
                                                                                                fontSize: 7,
                                                                                                margin: [0, -2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: `${data.PLANO_CERTIFICATE[0].predio}`,
                                                                                                style: 'Cuadro',
                                                                                                fontSize: 7,
                                                                                                margin: [0, -2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: `${data.PLANO_CERTIFICATE[0].edificio}`,
                                                                                                style: 'Cuadro',
                                                                                                fontSize: 7,
                                                                                                margin: [0, -2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: `${data.PLANO_CERTIFICATE[0].unidad}`,
                                                                                                style: 'Cuadro',
                                                                                                fontSize: 7,
                                                                                                margin: [0, -2, 0, -2],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                        ],
                                                                                    ],
                                                                                },
                                                                                margin: [-10, -3, 0, 0],
                                                                                border: [false, false, false, false],
                                                                            },
                                                                        ],
                                                                        [
                                                                            {
                                                                                text: [
                                                                                    {
                                                                                        text: 'CURT: ',
                                                                                        bold: true,
                                                                                    },
                                                                                    `${data.PLANO_CERTIFICATE[0].CURT}`,
                                                                                ],
                                                                                fontSize: 8,
                                                                                alignment: 'center',
                                                                                margin: [-10, 0, 0, 0],
                                                                                border: [false, false, false, false],
                                                                            },
                                                                        ],
                                                                        [
                                                                            {
                                                                                text: [
                                                                                    {
                                                                                        text: 'Clave Catastral: ',
                                                                                        bold: true,
                                                                                    },
                                                                                    `${data.PLANO_CERTIFICATE[0].formattedClave}`,
                                                                                ],
                                                                                fontSize: 8,
                                                                                alignment: 'center',
                                                                                margin: [-10, 0, 0, 0],
                                                                                border: [false, false, false, false],
                                                                            },
                                                                        ],
                                                                        [
                                                                            {
                                                                                text: `${data.NOMBRE_JEFE_CERTIFICACIONES}`,
                                                                                bold: true,
                                                                                fontSize: '10',
                                                                                alignment: 'center',
                                                                                margin: [-10, 20, 0, 0],
                                                                                border: [false, false, false, false],
                                                                            },
                                                                        ],
                                                                        [
                                                                            {
                                                                                text: `${data.TITULO_JEFE_CERTIFICACIONES}`,
                                                                                bold: true,
                                                                                fontSize: '8',
                                                                                alignment: 'center',
                                                                                margin: [-10, -5, 0, 10],
                                                                                border: [false, false, false, false],
                                                                            },
                                                                        ],
                                                                        [
                                                                            {
                                                                                table: {
                                                                                    widths: ['*', '*', '*'],
                                                                                    body: [
                                                                                        [
                                                                                            {
                                                                                                text: `${data.CERTIFICATE_DATA.printer}`,
                                                                                                style: 'Cuadro',
                                                                                                alignment: 'center',
                                                                                                margin: [0, 7, 0, 0],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: `${data.CERTIFICATE_DATA.capture}`,
                                                                                                style: 'Cuadro',
                                                                                                alignment: 'center',
                                                                                                margin: [0, 7, 0, 0],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: `${data.CERTIFICATE_DATA.verify}`,
                                                                                                style: 'Cuadro',
                                                                                                alignment: 'center',
                                                                                                margin: [0, 7, 0, 0],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                        ],
                                                                                        [
                                                                                            {
                                                                                                text: 'Imprimió',
                                                                                                style: 'Cuadro',
                                                                                                bold: true,
                                                                                                alignment: 'center',
                                                                                                margin: [0, -4, 0, 0],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: 'Capturó',
                                                                                                style: 'Cuadro',
                                                                                                bold: true,
                                                                                                alignment: 'center',
                                                                                                margin: [0, -4, 0, 0],
                                                                                                border: [false, false, false, false],
                                                                                            },
                                                                                            {
                                                                                                text: 'Revisó',
                                                                                                style: 'Cuadro',
                                                                                                bold: true,
                                                                                                alignment: 'center',
                                                                                                margin: [0, -4, 0, 0],
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
                                                            },
                                                        ],
                                                    ],
                                                },
                                                margin: [-4, -3, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                    ],
                                },
                                border: [false, false, false, false],
                            },
                            {
                                table: {
                                    widths: [mm2pixel(75)],
                                    body: [
                                        [
                                            {
                                                table: {
                                                    widths: [mm2pixel(74.9)],
                                                    body: [
                                                        [
                                                            /*{
                                                              image: `${data.TLQ_LOGO}`,
                                                              width: mm2pixel(38),
                                                              height: mm2pixel(21.5),
                                                              margin: [0, -5, 0, 0],
                                                              border: [false, false, false, false],
                                                            },*/
                                                            {
                                                                image: `${data.MANZANILLO_LOGO}`,
                                                                width: mm2pixel(37),
                                                                height: mm2pixel(16),
                                                                alignment: 'right',
                                                                margin: [0, -5, 0, 0],
                                                                border: [false, false, false, false],
                                                            },
                                                        ],
                                                    ],
                                                },
                                                margin: [-10, -3, 0, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: 'CERTIFICACIÓN DE PLANO CARTOGRÁFICO',
                                                style: 'Titulo',
                                                margin: [-5, 0, -5, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: `FOLIO: ${data.CERTIFICATE_DATA.folio}`,
                                                style: 'Texto',
                                                bold: true,
                                                margin: [-5, 0, -5, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: 'Simbología',
                                                style: 'Texto',
                                                bold: true,
                                                margin: [-5, 0, -5, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                image: `${data.SIMBOLOGIA}`,
                                                width: mm2pixel(78.7),
                                                height: mm2pixel(69.9),
                                                alignment: 'center',
                                                margin: [-3, 0, -3, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: `El que suscribe, ${data.DIRECTOR_CATASTRO}; Director de Catastro, adscrito a la Tesorería Municipal del H. Ayuntamiento Constitucional de Manzanillo, Colima. Y en uso de las facultades que le otorga el artículo 13, fracción XXI y XXII de la Ley de Catastro Municipal.`,
                                                style: 'Contenido',
                                                fontSize: 7,
                                                alignment: 'justify',
                                                margin: [-5, 5, -5, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: 'Certifica',
                                                style: 'Contenido',
                                                fontSize: 7,
                                                bold: true,
                                                margin: [-5, 0, -5, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: 'Que la presente es impresión obtenida de la base de datos geográfica municipal que se encuentra en la red de telecomunicaciones del municipio, que a su vez es impresión de los archivos digitales de la Dirección de Catastro Municipal y corresponde a la clave normalizada que se encuentra especificada a la derecha del cuadro de construcción del predio.',
                                                style: 'Contenido',
                                                fontSize: 7,
                                                alignment: 'justify',
                                                margin: [-5, 0, -5, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: 'Ley de Catastro, Artículo 42: Las resoluciones, datos y demás elementos catastrales, cualesquiera que sean, en ningún caso acreditarán derechos o gravámenes respecto de los bienes registrados; sólo producirán efectos fiscales, estadísticos y los previstos en materia de ordenamiento territorial.',
                                                style: 'Contenido',
                                                fontSize: 7,
                                                alignment: 'justify',
                                                margin: [-5, 0, -5, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: `Se extiende la constancia a solicitud de ${data.CERTIFICATE_DATA.applicant} en el Municipio de Manzanillo, Colima. A los ${data.FECHA_LETRA}.`,
                                                style: 'Contenido',
                                                fontSize: 7,
                                                alignment: 'justify',
                                                margin: [-5, 0, -5, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: `${data.PRINT_DATA.observation}`,
                                                style: 'Contenido',
                                                fontSize: 7,
                                                alignment: 'justify',
                                                margin: [-5, 0, -5, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                table: {
                                                    widths: [mm2pixel(5), mm2pixel(5), mm2pixel(10), mm2pixel(10), mm2pixel(10), mm2pixel(5)],
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
                                                margin: [-5, 0, -5, 0],
                                                border: [false, false, false, false],
                                            },
                                        ],
                                    ],
                                },
                                margin: [10, 0, 0, 0],
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
                fillColor: '#bbbbbb',
            },
            Subtitulo: {
                alignment: 'center',
                bold: true,
                fillColor: '#d9d9d9',
            },
            Contenido: {
                fontSize: 6,
                alignment: 'center',
            },
            Texto: {
                fontSize: 8,
                alignment: 'center',
            },
            Cuadro: {
                fontSize: 5,
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
        default:
            sizePage = 'LETTER';
            break;
    }
    return sizePage;
};
const getFooterWidths = (size) => {
    let widths;
    switch (size) {
        case 'carta':
            widths = ['*', mm2pixel(180), '*'];
            break;
        case 'oficio':
            widths = ['*', mm2pixel(220), '*'];
            break;
        default:
            widths = ['*', mm2pixel(180), '*'];
            break;
    }
    return widths;
};
const getMainWidths = (size) => {
    let widths;
    switch (size) {
        case 'carta':
            widths = [mm2pixel(182), mm2pixel(81)];
            break;
        case 'oficio':
            widths = [mm2pixel(232), mm2pixel(81)];
            break;
        default:
            widths = [mm2pixel(182), mm2pixel(81)];
            break;
    }
    return widths;
};
const getTableCroquisWidths = (size) => {
    let widths;
    switch (size) {
        case 'carta':
            widths = [mm2pixel(184)];
            break;
        case 'oficio':
            widths = [mm2pixel(234)];
            break;
        default:
            widths = [mm2pixel(184)];
            break;
    }
    return widths;
};
const getCroquisSectionWidths = (size) => {
    let widths;
    switch (size) {
        case 'carta':
            widths = [mm2pixel(184), mm2pixel(10)];
            break;
        case 'oficio':
            widths = [mm2pixel(234), mm2pixel(10)];
            break;
        default:
            widths = [mm2pixel(184), mm2pixel(10)];
            break;
    }
    return widths;
};
const getCroquisWidth = (size) => {
    let width;
    switch (size) {
        case 'carta':
            width = mm2pixel(185);
            break;
        case 'oficio':
            width = mm2pixel(235);
            break;
        default:
            width = mm2pixel(185);
            break;
    }
    return width;
};
const getCroquisHeight = (size) => {
    let height;
    switch (size) {
        case 'carta':
            height = mm2pixel(140);
            break;
        case 'oficio':
            height = mm2pixel(140);
            break;
        default:
            height = mm2pixel(140);
            break;
    }
    return height;
};
const getConstructionSquareSectionWidths = (size) => {
    let widths;
    switch (size) {
        case 'carta':
            widths = [mm2pixel(80), mm2pixel(97)];
            break;
        case 'oficio':
            widths = [mm2pixel(100), mm2pixel(127)];
            break;
        default:
            widths = [mm2pixel(80), mm2pixel(97)];
            break;
    }
    return widths;
};
const getTableConstructionSquareWidths = (size) => {
    let widths;
    switch (size) {
        case 'carta':
            widths = [mm2pixel(3), mm2pixel(3), mm2pixel(21), mm2pixel(7), mm2pixel(2), mm2pixel(12), mm2pixel(12)];
            break;
        case 'oficio':
            widths = [mm2pixel(6), mm2pixel(6), mm2pixel(24), mm2pixel(8), mm2pixel(6), mm2pixel(14), mm2pixel(14)];
            break;
        default:
            widths = [mm2pixel(3), mm2pixel(3), mm2pixel(21), mm2pixel(7), mm2pixel(2), mm2pixel(12), mm2pixel(12)];
            break;
    }
    return widths;
};
const getNormalizedClaveSectionWidths = (size) => {
    let widths;
    switch (size) {
        case 'carta':
            widths = [mm2pixel(96)];
            break;
        case 'oficio':
            widths = [mm2pixel(126)];
            break;
        default:
            widths = [mm2pixel(96)];
            break;
    }
    return widths;
};
const getTableNormalizedClaveWidths = (size) => {
    let widths;
    switch (size) {
        case 'carta':
            widths = [
                mm2pixel(6),
                mm2pixel(6),
                mm2pixel(8),
                mm2pixel(5),
                mm2pixel(8),
                mm2pixel(6),
                mm2pixel(8),
                mm2pixel(8),
                mm2pixel(6),
                mm2pixel(6),
            ];
            break;
        case 'oficio':
            widths = [
                mm2pixel(10),
                mm2pixel(10),
                mm2pixel(10),
                mm2pixel(9),
                mm2pixel(10),
                mm2pixel(10),
                mm2pixel(10),
                mm2pixel(10),
                mm2pixel(10),
                mm2pixel(10),
            ];
            break;
        default:
            widths = [
                mm2pixel(6),
                mm2pixel(6),
                mm2pixel(8),
                mm2pixel(5),
                mm2pixel(8),
                mm2pixel(6),
                mm2pixel(8),
                mm2pixel(8),
                mm2pixel(6),
                mm2pixel(6),
            ];
            break;
    }
    return widths;
};
//# sourceMappingURL=plano-certificado-predio-small.js.map