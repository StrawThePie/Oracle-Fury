export const DOWNTIME_ACTIONS = [
    { id: 'rest', label: 'Rest and Recover', phase: 'Camp', tags: ['heal', 'recover'] },
    { id: 'repair', label: 'Repair Gear', phase: 'Base', tags: ['repair'] },
    { id: 'study', label: 'Study Maps', phase: 'Hyperspace', tags: ['intel'] }
];
export function getActionsForPhase(phase) {
    return DOWNTIME_ACTIONS.filter((a) => a.phase === phase);
}
//# sourceMappingURL=downtime.js.map