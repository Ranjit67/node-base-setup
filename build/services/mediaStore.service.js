"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const client_cloudfront_1 = require("@aws-sdk/client-cloudfront");
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
class MediaStoreService {
    constructor() {
        this.s3 = new client_s3_1.S3Client({
            region: config_1.region,
            credentials: {
                accessKeyId: config_1.accessKey,
                secretAccessKey: config_1.secretKey,
            },
        });
        this.cloudFont = new client_cloudfront_1.CloudFrontClient({
            region: config_1.region,
            credentials: {
                accessKeyId: config_1.accessKey,
                secretAccessKey: config_1.secretKey,
            },
        });
    }
    invalidateFileCache(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const path = [`/${filename}`];
                const cmd = new client_cloudfront_1.CreateInvalidationCommand({
                    DistributionId: config_1.cloudFontDistribution,
                    InvalidationBatch: {
                        CallerReference: new Date().getTime().toString(),
                        Paths: { Quantity: path.length, Items: path },
                    },
                });
                yield this.cloudFont.send(cmd);
            }
            catch (error) {
                return false;
            }
        });
    }
    delete({ key }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const params = {
                        Bucket: `${config_1.bucketName}`,
                        Key: key,
                    };
                    const deleteData = new client_s3_1.DeleteObjectCommand(Object.assign({}, params));
                    yield this.s3.send(deleteData);
                    yield this.invalidateFileCache(key);
                    return resolve(true);
                }
                catch (error) {
                    new Error();
                    return resolve(false);
                }
            }));
        });
    }
    updateImage({ path, file }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const params = {
                        Bucket: `${config_1.bucketName}`,
                        Key: path,
                        Body: file === null || file === void 0 ? void 0 : file.data,
                        ContentType: file.mimetype,
                    };
                    const objectSetUp = new client_s3_1.PutObjectCommand(Object.assign({}, params));
                    const data = yield this.s3.send(objectSetUp);
                    yield this.invalidateFileCache(path);
                    return resolve(data);
                }
                catch (error) {
                    new Error();
                    return resolve(false);
                }
            }));
        });
    }
    upload({ file, dir }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var e_1, _a;
                try {
                    const fileSplit = file.name.split(".");
                    const fileType = fileSplit[fileSplit.length - 1];
                    const fileName = `${new Date().getTime()}.${fileType}`;
                    const fileStream = fs_1.default.createReadStream(file.tempFilePath);
                    const multipartParams = {
                        Bucket: config_1.bucketName,
                        Key: `${dir}/${fileName}`,
                        ContentType: file.mimetype,
                    };
                    const { UploadId } = yield this.s3.send(new client_s3_1.CreateMultipartUploadCommand(multipartParams));
                    const parts = [];
                    try {
                        for (var fileStream_1 = __asyncValues(fileStream), fileStream_1_1; fileStream_1_1 = yield fileStream_1.next(), !fileStream_1_1.done;) {
                            const chunk = fileStream_1_1.value;
                            const partNumber = parts.length + 1;
                            const partParams = {
                                Body: chunk,
                                Bucket: config_1.bucketName,
                                Key: `${dir}/${fileName}`,
                                PartNumber: partNumber,
                                UploadId: UploadId,
                            };
                            const { ETag } = yield this.s3.send(new client_s3_1.UploadPartCommand(partParams));
                            parts.push({ ETag, PartNumber: partNumber });
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (fileStream_1_1 && !fileStream_1_1.done && (_a = fileStream_1.return)) yield _a.call(fileStream_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    const params = {
                        Bucket: config_1.bucketName,
                        Key: `${dir}/${fileName}`,
                        UploadId: UploadId,
                        MultipartUpload: { Parts: parts },
                    };
                    yield this.s3.send(new client_s3_1.CompleteMultipartUploadCommand(params));
                    return resolve({
                        key: `${config_1.cloudFont}/${params === null || params === void 0 ? void 0 : params.Key}`,
                        Location: `${params === null || params === void 0 ? void 0 : params.Key}`,
                        allData: "",
                    });
                }
                catch (error) {
                    console.log(error);
                    return resolve(false);
                }
            }));
        });
    }
    newUpload({ file, dir }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = MediaStoreService;
