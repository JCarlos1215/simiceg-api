"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFichaTecnicaDocumentDefinition = void 0;
const formatted_date_1 = require("@src/utils/formatted-date");
const formatted_number_1 = require("@src/utils/formatted-number");
const mm2inches = (mm) => mm / 25.4;
const inches2pixel = (inches) => Math.round(inches * 72);
const mm2pixel = (mm) => inches2pixel(mm2inches(mm));
exports.generateFichaTecnicaDocumentDefinition = (data) => {
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
                                          image: `${data.MANZANILLO_LOGO}`,
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
                                                    text: `Ficha Técnica`,
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
                                                    margin: [0, 5, 2, 0],
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
                                    widths: [mm2pixel(200), mm2pixel(10)],
                                    body: [
                                        [
                                            {
                                                image: `${data.CROQUIS}`,
                                                width: mm2pixel(205.7),
                                                height: mm2pixel(142.8),
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
                                margin: [-5, 0, 0, 10],
                            },
                        ],
                        [
                            {
                                table: {
                                    widths: [mm2pixel(20), mm2pixel(50), mm2pixel(50), mm2pixel(72.5)],
                                    body: [
                                        [
                                            {
                                                text: 'Tarjeta',
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
                                                text: 'PROPIETARIO',
                                                style: 'Titulo',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: `${data.PREDIO_SICAM.cuenta}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.PREDIO_CARTO.formattedClave}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.PREDIO_CARTO.CURT}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.PREDIO_SICAM.propietario}`,
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
                                    widths: [mm2pixel(80.5), mm2pixel(22), mm2pixel(22), mm2pixel(68.7)],
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
                                        ],
                                        [
                                            {
                                                text: `${data.PREDIO_SICAM.ubicacion}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.PREDIO_SICAM.numExterior}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.PREDIO_SICAM.numInterior}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.PREDIO_SICAM.colonia}`,
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
                                text: 'Características del predio',
                                style: 'Titulo',
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                table: {
                                    widths: [mm2pixel(13), mm2pixel(60), mm2pixel(60), mm2pixel(60)],
                                    body: [
                                        [
                                            {
                                                text: 'Clase',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Área Cartografía',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Área Padrón',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Porcentaje',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        [
                                            {
                                                text: `${data.PREDIO_SICAM.clase}`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${formatted_number_1.getFormattedNumber(data.PREDIO_SICAM.areaCartografica)}m²`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${formatted_number_1.getFormattedNumber(data.PREDIO_SICAM.areaPadron)}m²`,
                                                style: 'Contenido',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${data.PREDIO_SICAM.porcentaje}%`,
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
                                text: 'Registro de Avalúo',
                                style: 'Titulo',
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                table: {
                                    widths: [
                                        mm2pixel(16),
                                        mm2pixel(20),
                                        mm2pixel(24),
                                        mm2pixel(21),
                                        mm2pixel(20),
                                        mm2pixel(20),
                                        mm2pixel(14),
                                        mm2pixel(22),
                                        mm2pixel(20),
                                    ],
                                    body: [
                                        [
                                            {
                                                text: 'Fecha',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Superficie Terreno',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Superficie Construcción',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Valor Terreno',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Valor Construcción',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Valor fiscal',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Indiviso',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Frente',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Profundidad',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        ...data.SICAM_DATA.avaluoSICAM.map((row) => [
                                            {
                                                text: `${formatted_date_1.getFormattedDate(row.fecha)}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${formatted_number_1.getFormattedNumber(row.superficieTerreno)}m²`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(row.superficieConstruccion)}m²`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(row.valorTerreno)}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(row.valorConstruccion)}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(row.valorFiscal)}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${row.indiviso}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${row.frente}m`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${row.profundidad}m`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                        ]),
                                    ],
                                },
                                border: [false, false, false, false],
                                margin: [-4.5, -3, 0, 10],
                            },
                        ],
                        [
                            {
                                text: 'Registro de Adeudo',
                                style: 'Titulo',
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                table: {
                                    widths: [mm2pixel(30), mm2pixel(40), mm2pixel(40), mm2pixel(40), mm2pixel(40)],
                                    body: [
                                        [
                                            {
                                                text: 'Tasa',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Importe adeudado',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Recargo adeudado',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Multas',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Saldo',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        ...data.SICAM_DATA.debtSICAM.map((row) => [
                                            {
                                                text: `${row.idTasa}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(row.importeAdeudado)}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(row.recargoAdeudado)}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(row.multas)}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(row.saldo)}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                        ]),
                                    ],
                                },
                                border: [false, false, false, false],
                                margin: [-4.5, -3, 0, 10],
                            },
                        ],
                        [
                            {
                                text: 'Registro de Pagos',
                                style: 'Titulo',
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                table: {
                                    widths: [mm2pixel(40), mm2pixel(50), mm2pixel(50), mm2pixel(52.5)],
                                    body: [
                                        [
                                            {
                                                text: 'Tasa',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Fecha',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Folio',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Importe pagado',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        ...data.SICAM_DATA.paidSICAM.map((row) => [
                                            {
                                                text: `${row.idTasa}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${formatted_date_1.getFormattedDate(row.fecha)}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${row.folio}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `$${formatted_number_1.getFormattedNumber(row.importePagado)}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                        ]),
                                    ],
                                },
                                border: [false, false, false, false],
                                margin: [-4.5, -3, 0, 10],
                            },
                        ],
                        [
                            {
                                text: 'Último Movimiento',
                                style: 'Titulo',
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            {
                                table: {
                                    widths: [mm2pixel(32), mm2pixel(114.5), mm2pixel(23), mm2pixel(23)],
                                    body: [
                                        [
                                            {
                                                text: 'Movimiento',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Descripción',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Año comprobante',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: 'Folio comprobante',
                                                style: 'Titulo2',
                                                border: [false, false, false, false],
                                            },
                                        ],
                                        ...data.SICAM_DATA.historySICAM.map((row) => [
                                            {
                                                text: `${row.idMovimineto}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${row.descripcion}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${row.yearComprobante}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                            {
                                                text: `${row.folioComprobante}`,
                                                style: 'Contenido2',
                                                border: [false, false, false, false],
                                            },
                                        ]),
                                    ],
                                },
                                border: [false, false, false, false],
                                margin: [-4.5, -3, 0, 3],
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
//# sourceMappingURL=ficha-tecnica.js.map