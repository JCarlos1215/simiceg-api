import { GraphOption } from './graph-option';

export interface LayerData {
  title: string;
  type: 'TILE' | 'WMTS' | 'IMAGE' | 'VECTORTILE';
  server: string;
  service: string;
  legend: string;
  attribution: string;
  isVisible: boolean;
  opacity: number;
  hasIdentify: boolean;
  zIndex: number;
  options: string;
  graphOptions: GraphOption;
}
