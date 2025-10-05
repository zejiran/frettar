import { TuningConfig } from '@/types';

// Common guitar tuning presets
export const TUNING_PRESETS: TuningConfig[] = [
  {
    name: 'E Standard (6)',
    strings: ['E', 'A', 'D', 'G', 'B', 'E']
  },
  {
    name: 'Drop D (6)',
    strings: ['D', 'A', 'D', 'G', 'B', 'E']
  },
  {
    name: 'D Standard (6)',
    strings: ['D', 'G', 'C', 'F', 'A', 'D']
  },
  {
    name: 'C# Standard (6)',
    strings: ['C#', 'F#', 'B', 'E', 'G#', 'C#']
  },
  {
    name: 'C Standard (6)',
    strings: ['C', 'F', 'A#', 'D#', 'G', 'C']
  },
  {
    name: 'Drop C (6)',
    strings: ['C', 'G', 'C', 'F', 'A', 'D']
  },
  {
    name: 'Open G (6)',
    strings: ['D', 'G', 'D', 'G', 'B', 'D']
  },
  {
    name: 'Open D (6)',
    strings: ['D', 'A', 'D', 'F#', 'A', 'D']
  },
  // 7-string tunings
  {
    name: 'E Standard (7)',
    strings: ['B', 'E', 'A', 'D', 'G', 'B', 'E']
  },
  {
    name: 'Drop A (7)',
    strings: ['A', 'E', 'A', 'D', 'G', 'B', 'E']
  },
  // 8-string tunings
  {
    name: 'E Standard (8)',
    strings: ['F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E']
  },
  {
    name: 'Drop E (8)',
    strings: ['E', 'B', 'E', 'A', 'D', 'G', 'B', 'E']
  },
  // Bass tunings (4 strings)
  {
    name: 'Bass Standard (4)',
    strings: ['E', 'A', 'D', 'G']
  },
  {
    name: 'Bass Drop D (4)',
    strings: ['D', 'A', 'D', 'G']
  },
  // 5-string bass
  {
    name: 'Bass Standard (5)',
    strings: ['B', 'E', 'A', 'D', 'G']
  }
];

// Default tuning
export const DEFAULT_TUNING: TuningConfig = TUNING_PRESETS[0]; // E Standard (6)
