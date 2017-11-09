"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This metadata contains all information about entity's listeners.
 */
var EntityListenerMetadata = /** @class */ (function () {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    function EntityListenerMetadata(args) {
        this.target = args.target;
        this.propertyName = args.propertyName;
        this.type = args.type;
    }
    // ---------------------------------------------------------------------
    // Public Methods
    // ---------------------------------------------------------------------
    /**
     * Checks if entity listener is allowed to be executed on the given entity.
     */
    EntityListenerMetadata.prototype.isAllowed = function (entity) {
        return this.target === entity.constructor || // todo: .constructor won't work for entity schemas
            (this.target instanceof Function && entity.constructor.prototype instanceof this.target); // todo: also need to implement entity schema inheritance
    };
    return EntityListenerMetadata;
}());
exports.EntityListenerMetadata = EntityListenerMetadata;

//# sourceMappingURL=EntityListenerMetadata.js.map
