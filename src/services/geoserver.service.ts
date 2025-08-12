/* eslint-disable @typescript-eslint/no-explicit-any */
import { Comodin, GeoserverParams } from '@src/services/geoserver-params.service';
import environment from '@src/utils/environment';
import Axios, { AxiosStatic } from 'axios';
import { injectable } from 'tsyringe';

const geoserver = environment.GEOSERVER;

@injectable()
export class GeoserverService {
  private http: AxiosStatic;

  constructor() {
    this.http = Axios;
  }

  public async describeLayer(serviceName: string): Promise<any> {
    const parameters = new GeoserverParams();
    parameters.service = 'WMS';
    parameters.version = '1.1.1';
    parameters.request = 'DescribeLayer';
    parameters.outputFormat = 'application/json';
    parameters.layers = serviceName;
    return this.execute(geoserver + 'wms', parameters);
  }

  public async getAttributes(layerName: string): Promise<any> {
    const parameters = new GeoserverParams();
    const idLayerArray = layerName.split(':');
    const workspace = Array.isArray(idLayerArray) ? idLayerArray[0] : undefined;
    parameters.service = 'WFS';
    parameters.version = '2.0.0';
    parameters.request = 'DescribeFeatureType';
    parameters.outputFormat = 'application/json';
    parameters.typeNames = layerName;
    return this.execute(geoserver + workspace + '/wfs', parameters);
  }

  public async getFeatures(layerName: string, cqlFilter: string): Promise<any> {
    const parameters = this.iniConfigQueryParams();
    const idLayerArray = layerName.split(':');
    const workspace = Array.isArray(idLayerArray) ? idLayerArray[0] : undefined;
    parameters.typeNames = layerName;
    parameters.cqlFilter = encodeURIComponent(cqlFilter);
    return this.execute(geoserver + workspace + '/wfs', parameters);
  }

  public async getLegendGraphic(layerName: string): Promise<any> {
    const parameters = new GeoserverParams();
    parameters.service = 'WMS';
    parameters.version = '1.1.0';
    parameters.request = 'GetLegendGraphic';
    parameters.format = 'application/json';
    parameters.layer = layerName;
    return this.execute(geoserver + 'wms', parameters);
  }

  public getAlphanumericalQuery(
    campo: string,
    campo2: string,
    criterio: string,
    criterio2: string,
    comodin: Comodin
  ): string {
    switch (comodin) {
      case Comodin.QUECONTENGA:
        return campo + `%20ilike%20'%25` + criterio.toUpperCase() + `%25'`;
      case Comodin.QUEEMPIEZECON:
        return campo + `%20ilike%20'` + criterio.toUpperCase() + `%25'`;
      case Comodin.QUETERMINECON:
        return campo + `%20ilike%20'%25` + criterio.toUpperCase() + `'`;
      case Comodin.IGUALA:
        return campo + `%20=%20'` + criterio.toUpperCase() + `'`;
      case Comodin.MAYORQUE:
        return campo + `%20>%20'` + criterio.toUpperCase() + `'`;
      case Comodin.MENORQUE:
        return campo + `%20<%20'` + criterio.toUpperCase() + `'`;
      case Comodin.MAYOROIGUALA:
        return campo + `%20>=%20'` + criterio.toUpperCase() + `'`;
      case Comodin.MENOROIGUALA:
        return campo + `%20<=%20'` + criterio.toUpperCase() + `'`;
      case Comodin.ENTRE:
        return (
          campo +
          `%20>=%20'` +
          criterio.toUpperCase() +
          `'%20AND%20` +
          campo +
          `%20<=%20'` +
          criterio2.toUpperCase() +
          `'`
        );
      case Comodin.QUECONTENGAENTRE2:
        return (
          campo +
          `%20ilike%20'%25` +
          criterio.toUpperCase() +
          `%25'%20AND%20` +
          campo2 +
          `%20ilike%20'%25` +
          criterio2.toUpperCase() +
          `%25'`
        );
      case Comodin.EN:
        return `${campo}%20IN%20(${criterio})`;
      case Comodin.TODOS:
        return '1=1';
      default:
        return campo + `%20ilike%20'%25` + criterio.toUpperCase() + `%25'`;
    }
  }

  public async getLayerSource(layerName: string): Promise<any> {
    const url = `${geoserver}rest/layers/${layerName}.json`;
    const header = {
      Authorization: environment.GEOSERVER_AUTH,
      'User-Agent': 'Request-Promise',
    };
    let layerSource;
    let result = await this.http.get(url, {
      headers: header,
    });
    const attributes: string[] = [];

    if (result.data.layer && result.data.layer.resource) {
      result = await this.http.get(result.data.layer.resource.href, { headers: header });
      if (result.data.featureType && result.data.featureType.nativeName && result.data.featureType.store) {
        const nativeName = result.data.featureType.nativeName;
        for (const attribute of result.data.featureType.attributes.attribute) {
          if (attribute.name !== 'geom') {
            attributes.push(attribute.name);
          }
        }
        result = await this.http.get(result.data.featureType.store.href, { headers: header });
        if (
          result.data.dataStore &&
          result.data.dataStore.connectionParameters &&
          result.data.dataStore.connectionParameters.entry
        ) {
          let schema = '';
          for (const entry of result.data.dataStore.connectionParameters.entry) {
            if (entry['@key'] === 'schema') {
              schema = entry.$;
              break;
            }
          }
          layerSource = {
            attributes,
            schema,
            table: nativeName,
          };
        }
      }
    }
    return layerSource;
  }

  private iniConfigQueryParams(): GeoserverParams {
    const parameters = new GeoserverParams();
    parameters.service = 'WFS';
    parameters.version = '2.0.0';
    parameters.request = 'GetFeature';
    parameters.outputFormat = 'application/json';
    parameters.srsName = 'EPSG:100000';
    // parameters.maxFeatures = '50';

    return parameters;
  }

  private async execute(url: string, params: GeoserverParams) {
    const paramsEncode = params.url_encode();
    const header = {
      'User-Agent': 'Request-Promise',
    };
    const result = await this.http.get(url + paramsEncode, { headers: header });
    return result.data;
  }
}
