/**
 * Shows typeorm version.
 */
export declare class VersionCommand {
    command: string;
    describe: string;
    handler(argv: any): Promise<void>;
    protected executeCommand(command: string): Promise<string>;
}
