import { Geometry } from 'geojson';

export interface PredioFrente {
  idPredioFrente: string;
  idPredio: string;
  calle: string;
  medida: number;
  geometry: Geometry;
  // Agregar más datos que se tengan del predio frente
}
