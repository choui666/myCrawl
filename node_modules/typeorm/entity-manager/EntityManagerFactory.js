"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityManager_1 = require("./EntityManager");
var MongoEntityManager_1 = require("./MongoEntityManager");
var MongoDriver_1 = require("../driver/mongodb/MongoDriver");
/**
 * Helps to create entity managers.
 */
var EntityManagerFactory = /** @class */ (function () {
    function EntityManagerFactory() {
    }
    /**
     * Creates a new entity manager depend on a given connection's driver.
     */
    EntityManagerFactory.prototype.create = function (connection, queryRunner) {
        if (connection.driver instanceof MongoDriver_1.MongoDriver)
            return new MongoEntityManager_1.MongoEntityManager(connection);
        return new EntityManager_1.EntityManager(connection, queryRunner);
    };
    return EntityManagerFactory;
}());
exports.EntityManagerFactory = EntityManagerFactory;

//# sourceMappingURL=EntityManagerFactory.js.map
