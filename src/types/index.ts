export interface FretPosition {
  string: number;
  fret: number;
}

export interface FretState {
  color: string;
  annotation: string;
}

export interface FretboardState {
  [key: string]: FretState;
}

export interface SavedConfiguration {
  id: number;
  name: string;
  state: FretboardState;
  date: string;
}

export interface Note {
  name: string;
  sharp?: boolean;
}

export interface StringInfo {
  note: string;
  startingNoteIndex: number;
}

export interface FretCellProps {
  string: number;
  fret: number;
  note: string;
  isSelected: boolean;
  color: string;
  annotation: string;
  currentColor: string;
  onCellClick: (string: number, fret: number) => void;
  onCellRightClick: (string: number, fret: number) => void;
  isLastFret?: boolean;
  tuningStrings: string[];
}

export interface FretboardProps {
  fretboardState: FretboardState;
  currentColor: string;
  onCellClick: (string: number, fret: number) => void;
  onCellRightClick: (string: number, fret: number) => void;
  tuningStrings: string[];
}

export interface ControlsProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  onSave: () => void;
  onClear: () => void;
  onExport: () => void;
  onToggleHistory: () => void;
  title?: string;
  onTitleChange?: (title: string) => void;
  isAudioEnabled: boolean;
  audioVolume: number;
  onToggleAudio: () => void;
  onVolumeChange: (volume: number) => void;
  onStopAudio: () => void;
  onPlayAll: () => void;
  hasSelectedNotes: boolean;
  selectedNotesCount: number;
  noteDuration: number;
  onDurationChange: (duration: number) => void;
}

export interface SaveModalProps {
  isOpen: boolean;
  onSave: (name: string) => void;
  onClose: () => void;
}

export interface AnnotationModalProps {
  isOpen: boolean;
  currentAnnotation: string;
  onSave: (annotation: string) => void;
  onClose: () => void;
}

export interface HistoryPanelProps {
  isOpen: boolean;
  configurations: SavedConfiguration[];
  onLoad: (id: number) => void;
  onDelete: (id: number) => void;
  onImport: (configurations: SavedConfiguration[]) => void;
}

export interface ExportOptions {
  format: 'png' | 'jpg';
  quality: number;
  scale: number;
}

export interface LocalStorageService {
  getConfigurations: () => SavedConfiguration[];
  saveConfiguration: (config: SavedConfiguration) => void;
  deleteConfiguration: (id: number) => void;
  clearAll: () => void;
}

export interface MusicTheoryService {
  getNote: (
    stringIndex: number,
    fretNumber: number,
    useFlats?: boolean,
    customStrings?: string[]
  ) => string;
  getNoteWithBothVariants: (
    stringIndex: number,
    fretNumber: number,
    customStrings?: string[]
  ) => string;
  getNoteSequence: () => string[];
  getNoteSequenceFlats: () => string[];
  getStringNotes: () => string[];
  getStringStartingNotes: () => number[];
  setCustomTuning: (strings: string[]) => void;
  getCurrentTuning: () => string[];
}

export interface ExportService {
  exportToImage: (
    fretboardRef: React.RefObject<HTMLDivElement>,
    options?: Partial<ExportOptions>,
    title?: string
  ) => Promise<void>;
}

export type Theme = 'light' | 'dark';

export interface AppState {
  fretboardState: FretboardState;
  currentColor: string;
  savedConfigurations: SavedConfiguration[];
  isHistoryOpen: boolean;
  isSaveModalOpen: boolean;
  isAnnotationModalOpen: boolean;
  currentAnnotationCell: FretPosition | null;
  theme: Theme;
  title: string;
}

export interface AudioSettings {
  volume: number;
  sustainTime: number;
  attackTime: number;
  releaseTime: number;
  waveType: OscillatorType;
  enableReverb: boolean;
  reverbAmount: number;
}

export interface AudioServiceInterface {
  playNote: (stringIndex: number, fretNumber: number, duration?: number) => Promise<void>;
  playFrequency: (frequency: number, duration?: number) => Promise<void>;
  playChord: (notes: Array<{ string: number; fret: number }>, duration?: number) => Promise<void>;
  setVolume: (volume: number) => void;
  updateSettings: (settings: Partial<AudioSettings>) => void;
  getSettings: () => AudioSettings;
  isSupported: () => boolean;
  stop: () => void;
}

export interface AudioControlsProps {
  isAudioEnabled: boolean;
  volume: number;
  onToggleAudio: () => void;
  onVolumeChange: (volume: number) => void;
  onStopAll: () => void;
  onPlayAll: () => void;
  hasSelectedNotes: boolean;
  selectedNotesCount: number;
  noteDuration: number;
  onDurationChange: (duration: number) => void;
}

export interface TuningConfig {
  strings: string[]; // Array of note names for each string (from lowest to highest)
  name: string; // Display name (e.g., "E Standard", "Drop D")
}

export interface TuningControlsProps {
  currentTuning: TuningConfig;
  onTuningChange: (tuning: TuningConfig) => void;
  onStringCountChange: (count: number) => void;
  onIndividualStringChange: (stringIndex: number, note: string) => void;
}

export interface AppContextType extends AppState {
  setFretboardState: React.Dispatch<React.SetStateAction<FretboardState>>;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
  setSavedConfigurations: React.Dispatch<React.SetStateAction<SavedConfiguration[]>>;
  setIsHistoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSaveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAnnotationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentAnnotationCell: React.Dispatch<React.SetStateAction<FretPosition | null>>;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}
