import { EventListenerType } from "./types/EventListenerTypes";
import { EntityListenerMetadataArgs } from "../metadata-args/EntityListenerMetadataArgs";
import { ObjectLiteral } from "../common/ObjectLiteral";
/**
 * This metadata contains all information about entity's listeners.
 */
export declare class EntityListenerMetadata {
    /**
     * Target class to which metadata is applied.
     */
    target: Function | string;
    /**
     * Target's property name to which this metadata is applied.
     */
    propertyName: string;
    /**
     * The type of the listener.
     */
    type: EventListenerType;
    constructor(args: EntityListenerMetadataArgs);
    /**
     * Checks if entity listener is allowed to be executed on the given entity.
     */
    isAllowed(entity: ObjectLiteral): boolean;
}
