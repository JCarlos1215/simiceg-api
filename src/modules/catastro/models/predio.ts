import { Geometry } from 'geojson';
import { PredioFrente } from './predio-frente';

export interface Predio {
  clave: string;
  idPredio: string;
  ubicacion: string;
  colonia: string;
  frente: PredioFrente[];
  geometry: Geometry;
  // Agregar más datos que se tengan del predio
}
