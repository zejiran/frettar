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
}

export interface FretboardProps {
  fretboardState: FretboardState;
  currentColor: string;
  onCellClick: (string: number, fret: number) => void;
  onCellRightClick: (string: number, fret: number) => void;
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
  getNote: (stringIndex: number, fretNumber: number, useFlats?: boolean) => string;
  getNoteWithBothVariants: (stringIndex: number, fretNumber: number) => string;
  getNoteSequence: () => string[];
  getNoteSequenceFlats: () => string[];
  getStringNotes: () => string[];
  getStringStartingNotes: () => number[];
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
