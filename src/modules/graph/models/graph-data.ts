/**
 * @apiDefine GraphData
 * @apiSuccess (data - GraphData) {Colors[]} chartColors Arreglo con los colores para la gráfica
 * @apiSuccess (data - GraphData) {number[]} chartData Arreglo de números con los totales para gráficar
 * @apiSuccess (data - GraphData) {string[]} chartLabels Arreglo con las leyendas de cada total
 * @apiSuccess (data - GraphData) {string} title Titulo de la gráfica
 * @apiSuccess (data - GraphData) {Totals[]} total Arreglo con las sumatorias de los totales
 * @apiSuccess (data - GraphData) {ExtraData} extraData Arreglo con la información extra obtenida de las opciones
 */

interface Colors {
  backgroundColor: string[];
}

interface Totals {
  type: string;
  count: number;
}

interface ExtraData {
  name: string;
  data: number;
  type: string;
}

export interface GraphData {
  chartColors: Colors[];
  chartData: number[];
  chartLabels: string[];
  title: string;
  total: Totals[];
  extraData: ExtraData[];
}
