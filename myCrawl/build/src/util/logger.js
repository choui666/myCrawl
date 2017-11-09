"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by admin on 2017/11/5.
 */
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Logger.switch && console.log(args.slice());
    };
    Logger.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Logger.switch && console.log(args.slice());
    };
    Logger.warning = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Logger.switch && console.log(args.slice());
    };
    Logger.switch = false;
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map