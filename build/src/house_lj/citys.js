"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by admin on 2017/11/6.
 */
var request = require("request");
var cheerio = require("cheerio");
var typeorm_1 = require("typeorm");
var city_1 = require("../entity/city");
var url = 'https://bj.lianjia.com/';
var Citys = /** @class */ (function () {
    function Citys() {
    }
    Citys.prototype.getCitys = function () {
        return new Promise(function (resolve, reject) {
            request(url, null, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    var $ = cheerio.load(body);
                    var leftCitys = $('.fl.citys-l a'), rightCitys = $('.fl.citys-r a'), result = [];
                    leftCitys.each(function () {
                        result.push({
                            href: $(this).attr('href'),
                            name: $(this).text()
                        });
                    });
                    rightCitys.each(function () {
                        result.push({
                            href: $(this).attr('href'),
                            name: $(this).text()
                        });
                    });
                    resolve(result);
                }
                else {
                    reject({ erro: '网络异常' });
                }
            });
        });
    };
    Citys.prototype.saveCity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var citys, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCitys()];
                    case 1:
                        citys = _a.sent();
                        return [4 /*yield*/, typeorm_1.getConnection()
                                .createQueryBuilder()
                                .insert()
                                .into(city_1.City)
                                .values(citys)
                                .execute()];
                    case 2:
                        result = _a.sent();
                        console.log(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    Citys.prototype.getCitysFromDataBase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _citys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, typeorm_1.getConnection().createQueryBuilder(city_1.City, 'city').select().getMany()];
                    case 1:
                        _citys = _a.sent();
                        return [2 /*return*/, _citys];
                }
            });
        });
    };
    return Citys;
}());
exports.Citys = Citys;
//# sourceMappingURL=citys.js.map