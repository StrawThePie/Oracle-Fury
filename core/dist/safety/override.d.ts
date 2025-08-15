export type OverrideEntry = {
    id: string;
    timestamp: number;
    actor: string;
    reason: string;
    scope: string;
    prevHash: string;
    hash: string;
};
export declare class OverrideLog {
    private entries;
    getAll(): OverrideEntry[];
    append(actor: string, reason: string, scope: string): OverrideEntry;
    verify(): boolean;
}
