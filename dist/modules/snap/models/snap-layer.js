"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapLayer = void 0;
class SnapLayer {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }
    isScaleValid(scale) {
        return this.scales[0] <= scale && scale <= this.scales[1];
    }
    isVisible(bbox) {
        if (this.bbox[3] < bbox[1] || this.bbox[1] > bbox[3] || this.bbox[2] < bbox[0] || this.bbox[0] > bbox[2]) {
            return false;
        }
        return true;
    }
}
exports.SnapLayer = SnapLayer;
//# sourceMappingURL=snap-layer.js.map