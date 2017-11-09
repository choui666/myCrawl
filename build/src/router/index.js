"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Router = require("koa-router");
var cityController_1 = require("../controllers/cityController");
var container_ioc_1 = require("container-ioc");
var cityService_1 = require("../service/cityService");
var city_1 = require("../dao/city");
var container = new container_ioc_1.Container();
container.register([city_1.cityDao, cityService_1.cityService, cityController_1.cityController]);
var cityCtr = container.resolve(cityController_1.cityController);
exports.routes = [
    {
        path: "/",
        method: "get",
        action: cityCtr.getIndex
    },
    {
        path: "/citys",
        method: "get",
        action: cityCtr.getCitys
    }
];
exports.router = new Router();
exports.routes.forEach(function (rt) {
    exports.router[rt.method](rt.path, rt.action);
});
//# sourceMappingURL=index.js.map