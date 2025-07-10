import { MusicTheoryService } from '@/types';

// Standard guitar tuning (low to high)
const STRING_NOTES = ['E', 'A', 'D', 'G', 'B', 'E'];

// Chromatic scale
const NOTE_SEQUENCE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_SEQUENCE_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Starting fret positions for each string in standard tuning (0-based index in NOTE_SEQUENCE)
const STRING_STARTING_NOTES = [4, 9, 2, 7, 11, 4]; // E, A, D, G, B, E

export const musicTheoryService: MusicTheoryService = {
  getNote: (stringIndex: number, fretNumber: number, useFlats: boolean = false): string => {
    if (stringIndex < 0 || stringIndex >= STRING_STARTING_NOTES.length) {
      throw new Error(`Invalid string index: ${stringIndex}`);
    }

    if (fretNumber < 0 || fretNumber > 24) {
      throw new Error(`Invalid fret number: ${fretNumber}`);
    }

    const noteIndex = (STRING_STARTING_NOTES[stringIndex] + fretNumber) % 12;
    return useFlats ? NOTE_SEQUENCE_FLATS[noteIndex] : NOTE_SEQUENCE[noteIndex];
  },

  getNoteWithBothVariants: (stringIndex: number, fretNumber: number): string => {
    if (stringIndex < 0 || stringIndex >= STRING_STARTING_NOTES.length) {
      throw new Error(`Invalid string index: ${stringIndex}`);
    }

    if (fretNumber < 0 || fretNumber > 24) {
      throw new Error(`Invalid fret number: ${fretNumber}`);
    }

    const noteIndex = (STRING_STARTING_NOTES[stringIndex] + fretNumber) % 12;
    const sharpNote = NOTE_SEQUENCE[noteIndex];
    const flatNote = NOTE_SEQUENCE_FLATS[noteIndex];

    if (sharpNote !== flatNote) {
      return `${sharpNote}/${flatNote}`;
    }

    return sharpNote;
  },

  getNoteSequence: (): string[] => {
    return [...NOTE_SEQUENCE];
  },

  getNoteSequenceFlats: (): string[] => {
    return [...NOTE_SEQUENCE_FLATS];
  },

  getStringNotes: (): string[] => {
    return [...STRING_NOTES];
  },

  getStringStartingNotes: (): number[] => {
    return [...STRING_STARTING_NOTES];
  }
};

export const getNoteColor = (note: string): string => {
  const colorMap: Record<string, string> = {
    'C': '#FF6B6B',
    'C#': '#FF8E53',
    'D': '#FF9F40',
    'D#': '#FFB347',
    'E': '#FFC93C',
    'F': '#BADD62',
    'F#': '#95D8A3',
    'G': '#6BCF7F',
    'G#': '#4ECDC4',
    'A': '#45B7D1',
    'A#': '#6C5CE7',
    'B': '#A29BFE'
  };

  return colorMap[note] || '#E0E0E0';
};

export const getFrequency = (stringIndex: number, fretNumber: number): number => {

  const baseFequencies = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63]; // E, A, D, G, B, E

  if (stringIndex < 0 || stringIndex >= baseFequencies.length) {
    throw new Error(`Invalid string index: ${stringIndex}`);
  }


  const frequency = baseFequencies[stringIndex] * Math.pow(2, fretNumber / 12);
  return Math.round(frequency * 100) / 100;
};

export const getInterval = (fromNote: string, toNote: string): string => {
  const fromIndex = NOTE_SEQUENCE.indexOf(fromNote);
  const toIndex = NOTE_SEQUENCE.indexOf(toNote);

  if (fromIndex === -1 || toIndex === -1) {
    throw new Error('Invalid note name');
  }

  const semitones = (toIndex - fromIndex + 12) % 12;

  const intervals = [
    'Unison',
    'Minor 2nd',
    'Major 2nd',
    'Minor 3rd',
    'Major 3rd',
    'Perfect 4th',
    'Tritone',
    'Perfect 5th',
    'Minor 6th',
    'Major 6th',
    'Minor 7th',
    'Major 7th'
  ];

  return intervals[semitones];
};

export const isNatural = (note: string): boolean => {
  return !note.includes('#');
};

export const getEnharmonicEquivalent = (note: string): string => {
  const enharmonics: Record<string, string> = {
    'C#': 'Db',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb',
    'Db': 'C#',
    'Eb': 'D#',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#'
  };

  return enharmonics[note] || note;
};

export const getScaleNotes = (rootNote: string, scaleType: 'major' | 'minor' | 'pentatonic'): string[] => {
  const rootIndex = NOTE_SEQUENCE.indexOf(rootNote);
  if (rootIndex === -1) {
    throw new Error('Invalid root note');
  }

  const scalePatterns = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    pentatonic: [0, 2, 4, 7, 9]
  };

  const pattern = scalePatterns[scaleType];
  return pattern.map(interval => NOTE_SEQUENCE[(rootIndex + interval) % 12]);
};

export const getChordNotes = (rootNote: string, chordType: 'major' | 'minor' | 'dominant7'): string[] => {
  const rootIndex = NOTE_SEQUENCE.indexOf(rootNote);
  if (rootIndex === -1) {
    throw new Error('Invalid root note');
  }

  const chordPatterns = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    dominant7: [0, 4, 7, 10]
  };

  const pattern = chordPatterns[chordType];
  return pattern.map(interval => NOTE_SEQUENCE[(rootIndex + interval) % 12]);
};

export const getFretboardPositions = (targetNote: string): Array<{ string: number; fret: number }> => {
  const positions: Array<{ string: number; fret: number }> = [];

  for (let stringIndex = 0; stringIndex < STRING_STARTING_NOTES.length; stringIndex++) {
    for (let fret = 0; fret <= 24; fret++) {
      const note = musicTheoryService.getNote(stringIndex, fret);
      if (note === targetNote) {
        positions.push({ string: stringIndex, fret });
      }
    }
  }

  return positions;
};
