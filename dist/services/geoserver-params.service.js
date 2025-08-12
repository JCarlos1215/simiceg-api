"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comodin = exports.GeometryType = exports.SpatialFunctions = exports.GeoserverParams = void 0;
class GeoserverParams {
    url_encode() {
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
exports.GeoserverParams = GeoserverParams;
var SpatialFunctions;
(function (SpatialFunctions) {
    SpatialFunctions["INTERSECTS"] = "INTERSECTS";
    SpatialFunctions["DISJOINT"] = "DISJOINT";
    SpatialFunctions["CONTAINS"] = "CONTAINS";
    SpatialFunctions["WITHIN"] = "WITHIN";
    SpatialFunctions["TOUCHES"] = "TOUCHES";
    SpatialFunctions["CROSSES"] = "CROSSES";
    SpatialFunctions["OVERLAPS"] = "OVERLAPS";
    SpatialFunctions["EQUALS"] = "EQUALS";
    SpatialFunctions["RELATE"] = "RELATE";
    SpatialFunctions["DWITHIN"] = "DWITHIN";
    SpatialFunctions["BEYOND"] = "BEYOND";
    SpatialFunctions["BBOX"] = "BBOX";
})(SpatialFunctions = exports.SpatialFunctions || (exports.SpatialFunctions = {}));
var GeometryType;
(function (GeometryType) {
    GeometryType["POLYGON"] = "POLYGON";
    GeometryType["POINT"] = "POINT";
    GeometryType["LINESTRING"] = "LINESTRING";
    GeometryType["MULTIPOLYGON"] = "MULTIPOLYGON";
    GeometryType["MULTIPOINT"] = "MULTIPOINT";
    GeometryType["MULTILINESTRING"] = "MULTILINESTRING";
    GeometryType["GEOMETRYCOLLECTION"] = "GEOMETRYCOLLECTION";
})(GeometryType = exports.GeometryType || (exports.GeometryType = {}));
var Comodin;
(function (Comodin) {
    Comodin[Comodin["QUECONTENGA"] = 0] = "QUECONTENGA";
    Comodin[Comodin["QUEEMPIEZECON"] = 1] = "QUEEMPIEZECON";
    Comodin[Comodin["QUETERMINECON"] = 2] = "QUETERMINECON";
    Comodin[Comodin["IGUALA"] = 3] = "IGUALA";
    Comodin[Comodin["MAYORQUE"] = 4] = "MAYORQUE";
    Comodin[Comodin["MENORQUE"] = 5] = "MENORQUE";
    Comodin[Comodin["MAYOROIGUALA"] = 6] = "MAYOROIGUALA";
    Comodin[Comodin["MENOROIGUALA"] = 7] = "MENOROIGUALA";
    Comodin[Comodin["ENTRE"] = 8] = "ENTRE";
    Comodin[Comodin["QUECONTENGAENTRE2"] = 9] = "QUECONTENGAENTRE2";
    Comodin[Comodin["TODOS"] = 10] = "TODOS";
    Comodin[Comodin["EN"] = 11] = "EN";
})(Comodin = exports.Comodin || (exports.Comodin = {}));
//# sourceMappingURL=geoserver-params.service.js.map