import { ColumnMetadata } from "./ColumnMetadata";
import { RelationMetadata } from "./RelationMetadata";
import { EntityMetadata } from "./EntityMetadata";
import { EmbeddedMetadataArgs } from "../metadata-args/EmbeddedMetadataArgs";
import { RelationIdMetadata } from "./RelationIdMetadata";
import { RelationCountMetadata } from "./RelationCountMetadata";
import { Connection } from "../connection/Connection";
/**
 * Contains all information about entity's embedded property.
 */
export declare class EmbeddedMetadata {
    /**
     * Entity metadata where this embedded is.
     */
    entityMetadata: EntityMetadata;
    /**
     * Parent embedded in the case if this embedded inside other embedded.
     */
    parentEmbeddedMetadata?: EmbeddedMetadata;
    /**
     * Embedded target type.
     */
    type: Function;
    /**
     * Property name on which this embedded is attached.
     */
    propertyName: string;
    /**
     * Columns inside this embed.
     */
    columns: ColumnMetadata[];
    /**
     * Relations inside this embed.
     */
    relations: RelationMetadata[];
    /**
     * Nested embeddable in this embeddable (which has current embedded as parent embedded).
     */
    embeddeds: EmbeddedMetadata[];
    /**
     * Indicates if this embedded is in array mode.
     *
     * This option works only in monogodb.
     */
    isArray: boolean;
    /**
     * Prefix of the embedded, used instead of propertyName.
     * If set to empty string, then prefix is not set at all.
     */
    customPrefix: string | boolean | undefined;
    /**
     * Gets the prefix of the columns.
     * By default its a property name of the class where this prefix is.
     * But if custom prefix is set then it takes its value as a prefix.
     * However if custom prefix is set to empty string prefix to column is not applied at all.
     */
    prefix: string;
    /**
     * Returns array of property names of current embed and all its parent embeds.
     *
     * example: post[data][information][counters].id where "data", "information" and "counters" are embeds
     * we need to get value of "id" column from the post real entity object.
     * this method will return ["data", "information", "counters"]
     */
    parentPropertyNames: string[];
    /**
     * Returns array of prefixes of current embed and all its parent embeds.
     */
    parentPrefixes: string[];
    /**
     * Returns embed metadatas from all levels of the parent tree.
     *
     * example: post[data][information][counters].id where "data", "information" and "counters" are embeds
     * this method will return [embed metadata of data, embed metadata of information, embed metadata of counters]
     */
    embeddedMetadataTree: EmbeddedMetadata[];
    /**
     * Embed metadatas from all levels of the parent tree.
     *
     * example: post[data][information][counters].id where "data", "information" and "counters" are embeds
     * this method will return [embed metadata of data, embed metadata of information, embed metadata of counters]
     */
    columnsFromTree: ColumnMetadata[];
    /**
     * Relations of this embed and all relations from its child embeds.
     */
    relationsFromTree: RelationMetadata[];
    /**
     * Relation ids of this embed and all relation ids from its child embeds.
     */
    relationIdsFromTree: RelationIdMetadata[];
    /**
     * Relation counts of this embed and all relation counts from its child embeds.
     */
    relationCountsFromTree: RelationCountMetadata[];
    constructor(options: {
        entityMetadata: EntityMetadata;
        args: EmbeddedMetadataArgs;
    });
    /**
     * Creates a new embedded object.
     */
    create(): any;
    build(connection: Connection): this;
    protected buildPrefix(connection: Connection): string;
    protected buildParentPropertyNames(): string[];
    protected buildParentPrefixes(): string[];
    protected buildEmbeddedMetadataTree(): EmbeddedMetadata[];
    protected buildColumnsFromTree(): ColumnMetadata[];
    protected buildRelationsFromTree(): RelationMetadata[];
}
