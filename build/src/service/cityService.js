"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var city_1 = require("../dao/city");
var container_ioc_1 = require("container-ioc");
var cityService = /** @class */ (function () {
    function cityService(dao) {
        this.dao = dao;
    }
    cityService.prototype.getCitys = function () {
        return this.dao.getCitys();
    };
    cityService = __decorate([
        container_ioc_1.Injectable(),
        __param(0, container_ioc_1.Inject(city_1.cityDao)),
        __metadata("design:paramtypes", [city_1.cityDao])
    ], cityService);
    return cityService;
}());
exports.cityService = cityService;
//# sourceMappingURL=cityService.js.map