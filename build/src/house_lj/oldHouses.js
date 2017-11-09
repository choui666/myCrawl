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
 * Created by admin on 2017/11/5.
 */
var request = require("request");
var cheerio = require("cheerio");
var House_1 = require("../entity/House");
var logger_1 = require("../util/logger");
var oldHouses = /** @class */ (function () {
    function oldHouses(connection, citys) {
        this.connection = connection;
        this.citys = citys;
        this.ershouFang = [];
        this.pointer = 0;
        this.errorTime = 0;
        logger_1.Logger.switch = true;
    }
    oldHouses.prototype.saveHouses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.Logger.switch = true;
                        logger_1.Logger.log('values is', this.ershouFang);
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.ershouFang.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.connection.createQueryBuilder().insert().into(House_1.House).values(this.ershouFang.splice(i, 20)).execute()];
                    case 2:
                        result = _a.sent();
                        logger_1.Logger.log(result);
                        _a.label = 3;
                    case 3:
                        i += 20;
                        return [3 /*break*/, 1];
                    case 4:
                        ++this.pointer;
                        this.ershouFang = [];
                        this.oldHousesPages();
                        return [2 /*return*/];
                }
            });
        });
    };
    oldHouses.prototype.getHouseDetail = function ($, li) {
        var house = new House_1.House();
        var title_a = $('div.title a', li), houseInfo_a = $('div.houseInfo', li), positionInfo_div = $('div.positionInfo', li), followInfo_div = $('div.followInfo', li), priceInfo_div = $('div.priceInfo', li);
        // Logger.log('$ is ',$);
        // Logger.log('li is ',li);
        // Logger.log('title_a is',title_a);
        // Logger.log('houseInfo_a is ',houseInfo_a);
        // Logger.log('positionInfo_div is ',positionInfo_div);
        // Logger.log('followInfo_div is ',followInfo_div);
        house.name = title_a.text();
        house.code = title_a.attr('data-housecode');
        house.moreInfoHref = title_a.attr('href');
        var infos = houseInfo_a.text().split('|');
        logger_1.Logger.log('houseInfo_a', infos);
        infos.length >= 1 && (house.address = infos[0]);
        infos.length >= 2 && (house.rooms = infos[1]);
        infos.length >= 3 && (house.square = Number.parseInt(infos[2].replace('平米', '')));
        infos.length >= 4 && (house.orientation = infos[3]);
        infos.length >= 5 && (house.isBoutique = infos[4].indexOf('简装') > -1 ? false : true);
        infos.length >= 6 && (house.haveElevatar = infos[5].indexOf('无电梯') > -1 ? false : true);
        var position = positionInfo_div.text();
        logger_1.Logger.log('position is ', position);
        house.floor = (/(.*)层/.exec(position) && /(.*)层/.exec(position)[1]) || '0';
        house.totalFloor = (/\(共(\d*)层\)/.exec(position) && /\(共(\d*)层\)/.exec(position)[1]) || '0';
        house.buildTime = Number.parseInt((/([\d]*)年建/.exec(position) && /([\d]*)年建/.exec(position)[1]) || '0');
        house.buildType = (/.*年建(.*)-/.exec(position) && /.*年建(.*)-/.exec(position)[1]) || '0';
        house.address = house.address + '--' + /.*-(.*)/.exec(position)[1];
        house.floor = house.floor.replace('(共' + house.totalFloor, '');
        var followInfo = followInfo_div.text(), matched;
        logger_1.Logger.log('followInfo is ', followInfo);
        matched = /(\d+)人关注 \/ 共(\d+)次带看 \/ (.+)发布/.exec(followInfo);
        logger_1.Logger.log('matched is', matched);
        house.focusNumber = Number.parseInt(matched[1]);
        house.watchedNumber = Number.parseInt(matched[2]);
        house.subway = !!$('span.subway', li).text();
        house.taxfree = !!$('span.taxfree', li).text();
        house.totalPrice = Number.parseInt($('div.totalPrice span', priceInfo_div).text());
        house.averagePrice = Number.parseInt(/单价(\d+)元\/平米/.exec($('div.unitPrice span', priceInfo_div).text())[1]);
        house.img = $('a.img img.lj-lazy', li).attr('data-original');
        house.city = this.citys[this.pointer];
        return house;
    };
    oldHouses.prototype.oldHousesOne = function (maxPage, currentPage) {
        var _this = this;
        request(this.citys[this.pointer].href + "ershoufang/pg" + currentPage, null, function (err, res, body) {
            if (!err && res.statusCode == 200) {
                _this.errorTime = 0;
                var $_1 = cheerio.load(body);
                var li_nodes = $_1('.sellListContent li');
                li_nodes.each(function (index, item) {
                    _this.ershouFang.push(_this.getHouseDetail($_1, item));
                });
                console.log('currentPage,maxPage', currentPage, maxPage);
                if (currentPage <= maxPage) {
                    _this.oldHousesOne(maxPage, ++currentPage);
                }
                else {
                    _this.saveHouses();
                }
            }
            else {
                ++_this.errorTime;
                _this.errorTime < 5 && _this.oldHousesOne(maxPage, currentPage);
                logger_1.Logger.error('网络异常--oldHousesOne,retry angain times:', _this.errorTime);
            }
        });
    };
    oldHouses.prototype.maxPage = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            logger_1.Logger.log(_this.citys, _this.pointer, _this.citys[_this.pointer].href + "ershoufang/pg1");
            request(_this.citys[_this.pointer].href + "ershoufang/pg1", null, function (err, res, body) {
                if (!err && res.statusCode == 200) {
                    var $ = cheerio.load(body), maxPages = 0;
                    try {
                        maxPages = Number.parseInt(JSON.parse($('.page-box.house-lst-page-box').attr('page-data')).totalPage);
                    }
                    catch (err) {
                        logger_1.Logger.log(err);
                    }
                    resolve(maxPages);
                }
                else {
                    logger_1.Logger.error('网络异常--maxPage');
                    reject(0);
                }
            });
        });
    };
    oldHouses.prototype.oldHousesPages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _maxPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.pointer < this.citys.length)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.maxPage()];
                    case 1:
                        _maxPage = _a.sent();
                        if (_maxPage === 0) {
                            ++this.pointer;
                            return [2 /*return*/, this.oldHousesPages()];
                        }
                        logger_1.Logger.log('max page is :', _maxPage);
                        this.oldHousesOne(_maxPage, 1);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    oldHouses.prototype.start = function () {
        this.oldHousesPages();
    };
    return oldHouses;
}());
exports.oldHouses = oldHouses;
//# sourceMappingURL=oldHouses.js.map