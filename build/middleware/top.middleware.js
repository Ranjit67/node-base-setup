"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
class TopMiddleware {
    constructor(app) {
        app.use(express_1.default.json());
        app.use((0, express_fileupload_1.default)({
            useTempFiles: true,
            preserveExtension: true,
        }));
        app.use(express_1.default.urlencoded({ extended: false }));
        app.use(this.allowCrossDomain);
        app.use(this.cacheClear);
    }
    allowCrossDomain(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization");
        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
            return res.status(200).json({});
        }
        next();
    }
    cacheClear(req, res, next) {
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", "0");
        next();
    }
}
exports.default = TopMiddleware;
