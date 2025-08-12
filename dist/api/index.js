"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.router = router;
const response_object_1 = require("@src/utils/response-object");
const auth_router_1 = require("@src/auth/auth.router");
const user_router_1 = require("@src/modules/user/user.router");
const toc_router_1 = require("@src/modules/toc/toc.router");
const snap_router_1 = require("@src/modules/snap/snap.router");
const graph_router_1 = require("@src/modules/graph/graph.router");
const search_router_1 = require("@src/modules/search/search.router");
const catastro_router_1 = require("@src/modules/catastro/catastro.router");
const avaluo_router_1 = require("@src/modules/avaluo/avaluo.router");
const payment_router_1 = require("@src/modules/payment/payment.router");
const sicam_router_1 = require("@src/modules/sicam/sicam.router");
router.use('/auth', auth_router_1.router);
router.use('/user', user_router_1.router);
router.use('/toc', toc_router_1.router);
router.use('/snap', snap_router_1.router);
router.use('/graph', graph_router_1.router);
router.use('/search', search_router_1.router);
router.use('/catastro', catastro_router_1.router);
router.use('/avaluo', avaluo_router_1.router);
router.use('/payment', payment_router_1.router);
router.use('/sicam', sicam_router_1.router);
router.get('/', (req, res) => {
    res.json(new response_object_1.ResponseObject(`Welcome to API skeleton.`));
});
//# sourceMappingURL=index.js.map