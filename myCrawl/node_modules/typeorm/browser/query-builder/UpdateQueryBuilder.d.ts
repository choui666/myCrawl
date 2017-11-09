import { QueryBuilder } from "./QueryBuilder";
import { ObjectLiteral } from "../common/ObjectLiteral";
import { Connection } from "../connection/Connection";
import { QueryRunner } from "../query-runner/QueryRunner";
import { WhereExpression } from "./WhereExpression";
import { Brackets } from "./Brackets";
/**
 * Allows to build complex sql queries in a fashion way and execute those queries.
 */
export declare class UpdateQueryBuilder<Entity> extends QueryBuilder<Entity> implements WhereExpression {
    constructor(connectionOrQueryBuilder: Connection | QueryBuilder<any>, queryRunner?: QueryRunner);
    /**
     * Gets generated sql query without parameters being replaced.
     */
    getQuery(): string;
    /**
     * Optional returning/output clause.
     */
    output(output: string): this;
    /**
     * Values needs to be updated.
     */
    set(values: ObjectLiteral): this;
    /**
     * Sets WHERE condition in the query builder.
     * If you had previously WHERE expression defined,
     * calling this function will override previously set WHERE conditions.
     * Additionally you can add parameters used in where expression.
     */
    where(where: string | ((qb: this) => string) | Brackets | ObjectLiteral, parameters?: ObjectLiteral): this;
    /**
     * Adds new AND WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    andWhere(where: string | ((qb: this) => string) | Brackets, parameters?: ObjectLiteral): this;
    /**
     * Adds new OR WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    orWhere(where: string | ((qb: this) => string) | Brackets, parameters?: ObjectLiteral): this;
    /**
     * Adds new AND WHERE with conditions for the given ids.
     */
    whereInIds(ids: any | any[]): this;
    /**
     * Adds new AND WHERE with conditions for the given ids.
     */
    andWhereInIds(ids: any | any[]): this;
    /**
     * Adds new OR WHERE with conditions for the given ids.
     */
    orWhereInIds(ids: any | any[]): this;
    /**
     * Optional returning/output clause.
     */
    returning(returning: string): this;
    /**
     * Creates UPDATE express used to perform insert query.
     */
    protected createUpdateExpression(): string;
    /**
     * Gets array of values need to be inserted into the target table.
     */
    protected getValueSet(): ObjectLiteral;
}
