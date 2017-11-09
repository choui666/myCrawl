import { SimpleConsoleLogger } from "./SimpleConsoleLogger";
import { AdvancedConsoleLogger } from "./AdvancedConsoleLogger";
import { FileLogger } from "./FileLogger";
/**
 * Helps to create logger instances.
 */
var LoggerFactory = /** @class */ (function () {
    function LoggerFactory() {
    }
    /**
     * Creates a new logger depend on a given connection's driver.
     */
    LoggerFactory.prototype.create = function (logger, options) {
        if (logger instanceof Object)
            return logger;
        if (logger) {
            switch (logger) {
                case "simple-console":
                    return new SimpleConsoleLogger(options);
                case "file":
                    return new FileLogger(options);
                case "advanced-console":
                    return new AdvancedConsoleLogger(options);
            }
        }
        return new AdvancedConsoleLogger(options);
    };
    return LoggerFactory;
}());
export { LoggerFactory };

//# sourceMappingURL=LoggerFactory.js.map
