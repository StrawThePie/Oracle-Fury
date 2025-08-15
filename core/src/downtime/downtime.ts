export type DowntimePhase = 'Hyperspace' | 'Camp' | 'Base';

export type DowntimeAction = {
  id: string;
  label: string;
  phase: DowntimePhase;
  description?: string;
};

export type DowntimeOutcome = {
  actionId: string;
  summary: string;
  tags?: string[];
  modifiers?: Array<{ label: string; weight: number }>; // feeds resolution
};

export function getDefaultActions(phase: DowntimePhase): DowntimeAction[] {
  switch (phase) {
    case 'Hyperspace':
      return [
        { id: 'contemplate', label: 'Contemplate the Void', phase },
        { id: 'maintain', label: 'Ship Maintenance', phase }
      ];
    case 'Camp':
      return [
        { id: 'forage', label: 'Forage for Supplies', phase },
        { id: 'bond', label: 'Build Camaraderie', phase }
      ];
    case 'Base':
      return [
        { id: 'trade', label: 'Trade Goods', phase },
        { id: 'upgrade', label: 'Upgrade Gear', phase }
      ];
  }
}