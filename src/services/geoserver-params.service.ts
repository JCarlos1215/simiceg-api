export class GeoserverParams {
  // Obligatorios
  public service: string;
  public version: string;
  public request: string;
  public token: string;
  // Opcionales
  public namespace: string;
  public typeNames: string;
  public layers: string;
  public layer: string;
  public styles: string;
  public srs: string;
  public crs: string;
  public width: string;
  public height: string;
  public queryLayers: string;
  public infoFormat: string;
  public featureCount: string;
  public x: string;
  public i: string;
  public y: string;
  public j: string;
  public buffer: string;
  public filter: string;
  public featureID: string;
  public count: string;
  public maxFeatures: string;
  public sortBy: string;
  public propertyName: string;
  public bbox: string;
  public srsName: string;
  public exceptions: string;
  public outputFormat: string;
  public cqlFilter: string;
  public format: string;

  public url_encode(): string {
    let urlParam = '?';
    urlParam += 'service=' + this.service;
    urlParam += '&version=' + this.version;
    urlParam += '&request=' + this.request;

    urlParam += this.token ? '&TOKEN=' + this.token : '';

    urlParam += this.namespace ? '&namespace=' + this.request : '';
    urlParam += this.typeNames ? '&typeNames=' + this.typeNames : '';
    urlParam += this.featureID ? '&featureID=' + this.featureID : '';

    urlParam += this.layers ? '&layers=' + this.layers : '';
    urlParam += this.layer ? '&layer=' + this.layer : '';
    urlParam += this.styles ? '&styles=' + this.styles : '';
    urlParam += this.srs ? '&srs=' + this.srs : '';
    urlParam += this.crs ? '&crs=' + this.crs : '';
    urlParam += this.width ? '&width=' + this.width : '';
    urlParam += this.height ? '&height=' + this.height : '';
    urlParam += this.queryLayers ? '&query_layers=' + this.queryLayers : '';
    urlParam += this.infoFormat ? '&info_format=' + this.infoFormat : '';
    urlParam += this.featureCount ? '&feature_count=' + this.featureCount : '';
    urlParam += this.x ? '&x=' + this.x : '';
    urlParam += this.i ? '&i=' + this.i : '';
    urlParam += this.y ? '&y=' + this.y : '';
    urlParam += this.j ? '&j=' + this.j : '';
    urlParam += this.buffer ? '&buffer=' + this.buffer : '';
    urlParam += this.filter ? '&filter=' + this.filter : '';

    urlParam += this.count ? '&count=' + this.count : '';
    urlParam += this.sortBy ? '&sortBy=' + this.sortBy : '';
    urlParam += this.maxFeatures ? '&maxFeatures=' + this.maxFeatures : '';
    urlParam += this.propertyName ? '&propertyName=' + this.propertyName : '';
    urlParam += this.bbox ? '&bbox=' + this.bbox : '';
    urlParam += this.srsName ? '&srsName=' + this.srsName : '';
    urlParam += this.exceptions ? '&exceptions=' + this.exceptions : '';
    urlParam += this.format ? '&format=' + this.format : '';
    urlParam += this.outputFormat ? '&outputFormat=' + this.outputFormat : '';
    urlParam += this.cqlFilter ? '&cql_filter=' + this.cqlFilter : '';

    return urlParam;
  }
}

export enum SpatialFunctions {
  INTERSECTS = 'INTERSECTS',
  DISJOINT = 'DISJOINT',
  CONTAINS = 'CONTAINS',
  WITHIN = 'WITHIN',
  TOUCHES = 'TOUCHES',
  CROSSES = 'CROSSES',
  OVERLAPS = 'OVERLAPS',
  EQUALS = 'EQUALS',
  RELATE = 'RELATE',
  DWITHIN = 'DWITHIN',
  BEYOND = 'BEYOND',
  BBOX = 'BBOX',
}

export enum GeometryType {
  POLYGON = 'POLYGON',
  POINT = 'POINT',
  LINESTRING = 'LINESTRING',
  MULTIPOLYGON = 'MULTIPOLYGON',
  MULTIPOINT = 'MULTIPOINT',
  MULTILINESTRING = 'MULTILINESTRING',
  GEOMETRYCOLLECTION = 'GEOMETRYCOLLECTION',
}

export enum Comodin {
  QUECONTENGA,
  QUEEMPIEZECON,
  QUETERMINECON,
  IGUALA,
  MAYORQUE,
  MENORQUE,
  MAYOROIGUALA,
  MENOROIGUALA,
  ENTRE,
  QUECONTENGAENTRE2,
  TODOS,
  EN,
}
