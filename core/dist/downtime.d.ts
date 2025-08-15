export type DowntimePhase = 'Hyperspace' | 'Camp' | 'Base';
export type DowntimeAction = {
    id: string;
    label: string;
    phase: DowntimePhase;
    tags: string[];
};
export declare const DOWNTIME_ACTIONS: DowntimeAction[];
export declare function getActionsForPhase(phase: DowntimePhase): DowntimeAction[];
