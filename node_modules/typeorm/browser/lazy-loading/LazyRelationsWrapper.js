import { RelationLoader } from "../query-builder/RelationLoader";
/**
 * Wraps entities and creates getters/setters for their relations
 * to be able to lazily load relations when accessing these relations.
 */
var LazyRelationsWrapper = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function LazyRelationsWrapper(connection) {
        this.connection = connection;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Wraps given entity and creates getters/setters for its given relation
     * to be able to lazily load data when accessing these relation.
     */
    LazyRelationsWrapper.prototype.wrap = function (object, relation) {
        var relationLoader = new RelationLoader(this.connection);
        var dataIndex = "__" + relation.propertyName + "__"; // in what property of the entity loaded data will be stored
        var promiseIndex = "__promise_" + relation.propertyName + "__"; // in what property of the entity loading promise will be stored
        var resolveIndex = "__has_" + relation.propertyName + "__"; // indicates if relation data already was loaded or not
        Object.defineProperty(object, relation.propertyName, {
            get: function () {
                var _this = this;
                if (this[resolveIndex] === true)
                    return Promise.resolve(this[dataIndex]);
                if (this[promiseIndex])
                    return this[promiseIndex];
                // nothing is loaded yet, load relation data and save it in the model once they are loaded
                this[promiseIndex] = relationLoader.load(relation, this).then(function (result) {
                    _this[dataIndex] = result;
                    _this[resolveIndex] = true;
                    delete _this[promiseIndex];
                    return _this[dataIndex];
                }); // .catch((err: any) => { throw err; });
                return this[promiseIndex];
            },
            set: function (promise) {
                var _this = this;
                if (promise instanceof Promise) {
                    promise.then(function (result) {
                        _this[dataIndex] = result;
                        _this[resolveIndex] = true;
                    });
                }
                else {
                    this[dataIndex] = promise;
                    this[resolveIndex] = true;
                }
            },
            configurable: true
        });
    };
    return LazyRelationsWrapper;
}());
export { LazyRelationsWrapper };

//# sourceMappingURL=LazyRelationsWrapper.js.map
