import { MusicTheoryService } from '@/types';

// Standard guitar tuning (low to high)
const STRING_NOTES = ['E', 'A', 'D', 'G', 'B', 'E'];

// Chromatic scale
const NOTE_SEQUENCE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_SEQUENCE_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Starting fret positions for each string in standard tuning (0-based index in NOTE_SEQUENCE)
const STRING_STARTING_NOTES = [4, 9, 2, 7, 11, 4]; // E, A, D, G, B, E

// Current custom tuning (can be modified at runtime)
let currentTuning: string[] = [...STRING_NOTES];

// Helper function to convert note name to index
const getNoteIndex = (noteName: string): number => {
  let index = NOTE_SEQUENCE.indexOf(noteName);
  if (index === -1) {
    index = NOTE_SEQUENCE_FLATS.indexOf(noteName);
  }
  if (index === -1) {
    throw new Error(`Invalid note name: ${noteName}`);
  }
  return index;
};

// Helper function to get starting note indices from string array
const getStartingNotesFromStrings = (strings: string[]): number[] => {
  return strings.map(note => getNoteIndex(note));
};

export const musicTheoryService: MusicTheoryService = {
  getNote: (stringIndex: number, fretNumber: number, useFlats: boolean = false, customStrings?: string[]): string => {
    const strings = customStrings || currentTuning;
    const startingNotes = getStartingNotesFromStrings(strings);

    if (stringIndex < 0 || stringIndex >= strings.length) {
      throw new Error(`Invalid string index: ${stringIndex}`);
    }

    if (fretNumber < 0 || fretNumber > 24) {
      throw new Error(`Invalid fret number: ${fretNumber}`);
    }

    const noteIndex = (startingNotes[stringIndex]! + fretNumber) % 12;
    return useFlats ? NOTE_SEQUENCE_FLATS[noteIndex]! : NOTE_SEQUENCE[noteIndex]!;
  },

  getNoteWithBothVariants: (stringIndex: number, fretNumber: number, customStrings?: string[]): string => {
    const strings = customStrings || currentTuning;
    const startingNotes = getStartingNotesFromStrings(strings);

    if (stringIndex < 0 || stringIndex >= strings.length) {
      throw new Error(`Invalid string index: ${stringIndex}`);
    }

    if (fretNumber < 0 || fretNumber > 24) {
      throw new Error(`Invalid fret number: ${fretNumber}`);
    }

    const noteIndex = (startingNotes[stringIndex]! + fretNumber) % 12;
    const sharpNote = NOTE_SEQUENCE[noteIndex];
    const flatNote = NOTE_SEQUENCE_FLATS[noteIndex];

    if (sharpNote !== flatNote) {
      return `${sharpNote}\n${flatNote}`;
    }

    return sharpNote!;
  },

  getNoteSequence: (): string[] => {
    return [...NOTE_SEQUENCE];
  },

  getNoteSequenceFlats: (): string[] => {
    return [...NOTE_SEQUENCE_FLATS];
  },

  getStringNotes: (): string[] => {
    return [...currentTuning];
  },

  getStringStartingNotes: (): number[] => {
    return getStartingNotesFromStrings(currentTuning);
  },

  setCustomTuning: (strings: string[]): void => {
    currentTuning = [...strings];
  },

  getCurrentTuning: (): string[] => {
    return [...currentTuning];
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

export const getFrequency = (stringIndex: number, fretNumber: number, customStrings?: string[]): number => {
  const strings = customStrings || currentTuning;

  if (stringIndex < 0 || stringIndex >= strings.length) {
    throw new Error(`Invalid string index: ${stringIndex}`);
  }

  // Reference: E Standard 6-string tuning (E2, A2, D3, G3, B3, E4)
  const referenceNotes = ['E', 'A', 'D', 'G', 'B', 'E'];
  const referenceOctaves = [2, 2, 3, 3, 3, 4];

  // Determine reference based on string count
  let referenceOctave: number;
  let referenceNote: string;
  let adjustedStringIndex: number;

  if (strings.length === 6) {
    // Standard 6-string mapping
    adjustedStringIndex = stringIndex;
    referenceOctave = referenceOctaves[stringIndex] ?? 2;
    referenceNote = referenceNotes[stringIndex] ?? 'E';
  } else if (strings.length === 7) {
    // 7-string: string 0 is one octave below, strings 1-6 map to standard 0-5
    if (stringIndex === 0) {
      // First string (7th string, lowest): use E2 reference but will be lower
      referenceOctave = 1; // One octave lower
      referenceNote = 'E';
      adjustedStringIndex = 0;
    } else {
      adjustedStringIndex = stringIndex - 1;
      referenceOctave = referenceOctaves[adjustedStringIndex] ?? 2;
      referenceNote = referenceNotes[adjustedStringIndex] ?? 'E';
    }
  } else if (strings.length === 8) {
    // 8-string: strings 0-1 are below standard, strings 2-7 map to standard 0-5
    if (stringIndex === 0) {
      // First string (8th string, lowest)
      referenceOctave = 1;
      referenceNote = 'F#';
      adjustedStringIndex = 0;
    } else if (stringIndex === 1) {
      // Second string (7th string)
      referenceOctave = 1;
      referenceNote = 'B';
      adjustedStringIndex = 1;
    } else {
      adjustedStringIndex = stringIndex - 2;
      referenceOctave = referenceOctaves[adjustedStringIndex] ?? 2;
      referenceNote = referenceNotes[adjustedStringIndex] ?? 'E';
    }
  } else if (strings.length === 4 || strings.length === 5) {
    // Bass guitars: map to the first N strings of standard tuning
    adjustedStringIndex = stringIndex;
    referenceOctave = stringIndex < referenceOctaves.length ? (referenceOctaves[stringIndex] ?? 2) : 2;
    referenceNote = stringIndex < referenceNotes.length ? (referenceNotes[stringIndex] ?? 'E') : 'E';
  } else {
    // Fallback for other string counts
    adjustedStringIndex = stringIndex;
    referenceOctave = 2;
    referenceNote = 'E';
  }

  // Get note indices
  const referenceNoteIndex = getNoteIndex(referenceNote);
  const currentNoteIndex = getNoteIndex(strings[stringIndex]!);

  // Calculate semitone difference (accounting for wraparound)
  const semitoneDiff = currentNoteIndex - referenceNoteIndex;

  // Adjust octave based on semitone difference
  // If we go down more than 6 semitones, we're likely in the previous octave
  // If we go up more than 6 semitones, we're likely in the next octave
  let octave = referenceOctave;
  if (semitoneDiff > 6) {
    // Going up but wrapping around (e.g., from B to C)
    octave -= 1;
  } else if (semitoneDiff < -6) {
    // Going down but wrapping around (e.g., from C to B)
    octave += 1;
  }

  // Now calculate the actual frequency for the note at fret 0
  // Using A4 = 440Hz as reference (A is note index 9, octave 4)
  const A4_FREQUENCY = 440.0;
  const A4_NOTE_INDEX = 9; // A in NOTE_SEQUENCE
  const A4_OCTAVE = 4;

  // Calculate semitones from A4
  const semitonesFromA4 = (octave - A4_OCTAVE) * 12 + (currentNoteIndex - A4_NOTE_INDEX);

  // Calculate base frequency for this string
  const baseFrequency = A4_FREQUENCY * Math.pow(2, semitonesFromA4 / 12);

  // Apply fret offset
  const frequency = baseFrequency * Math.pow(2, fretNumber / 12);

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

  return intervals[semitones]!;
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
  return pattern.map(interval => NOTE_SEQUENCE[(rootIndex + interval) % 12] ?? 'C');
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
  return pattern.map(interval => NOTE_SEQUENCE[(rootIndex + interval) % 12] ?? 'C');
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
