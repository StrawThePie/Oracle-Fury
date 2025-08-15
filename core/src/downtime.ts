export type DowntimePhase = 'Hyperspace' | 'Camp' | 'Base';

export type DowntimeAction = {
  id: string;
  label: string;
  phase: DowntimePhase;
  tags: string[];
};

export const DOWNTIME_ACTIONS: DowntimeAction[] = [
  { id: 'rest', label: 'Rest and Recover', phase: 'Camp', tags: ['heal', 'recover'] },
  { id: 'repair', label: 'Repair Gear', phase: 'Base', tags: ['repair'] },
  { id: 'study', label: 'Study Maps', phase: 'Hyperspace', tags: ['intel'] }
];

export function getActionsForPhase(phase: DowntimePhase): DowntimeAction[] {
  return DOWNTIME_ACTIONS.filter((a) => a.phase === phase);
}