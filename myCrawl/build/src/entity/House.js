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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by admin on 2017/11/3.
 */
/**
 * Created by admin on 2017/11/2.
 */
var typeorm_1 = require("typeorm");
var city_1 = require("./city");
var House = /** @class */ (function () {
    function House() {
        this.name = '';
        this.img = '';
        this.totalPrice = 0;
        this.averagePrice = 0;
        this.square = 0;
        this.address = '';
        this.code = '';
        this.orientation = '';
        this.rooms = '';
        this.isBoutique = false;
        this.haveElevatar = false;
        this.moreInfoHref = '';
        this.totalFloor = '';
        this.floor = '';
        this.buildTime = 0;
        this.buildType = '';
        this.focusNumber = 0;
        this.watchedNumber = 0;
        this.taxfree = false;
        this.subway = false;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], House.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], House.prototype, "name", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], House.prototype, "img", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], House.prototype, "totalPrice", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], House.prototype, "averagePrice", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], House.prototype, "square", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], House.prototype, "address", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], House.prototype, "code", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], House.prototype, "orientation", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], House.prototype, "rooms", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Boolean)
    ], House.prototype, "isBoutique", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Boolean)
    ], House.prototype, "haveElevatar", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], House.prototype, "moreInfoHref", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], House.prototype, "totalFloor", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], House.prototype, "floor", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], House.prototype, "buildTime", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], House.prototype, "buildType", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], House.prototype, "focusNumber", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], House.prototype, "watchedNumber", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Boolean)
    ], House.prototype, "taxfree", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Boolean)
    ], House.prototype, "subway", void 0);
    __decorate([
        typeorm_1.CreateDateColumn(),
        __metadata("design:type", Date)
    ], House.prototype, "createTime", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return city_1.City; }, function (city) { return city.house; }),
        __metadata("design:type", city_1.City)
    ], House.prototype, "city", void 0);
    House = __decorate([
        typeorm_1.Entity()
    ], House);
    return House;
}());
exports.House = House;
//# sourceMappingURL=House.js.map