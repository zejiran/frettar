import { AnnotationModal } from '@/components/AnnotationModal';
import { Controls } from '@/components/Controls';
import { Fretboard } from '@/components/Fretboard';
import { HistoryPanel } from '@/components/HistoryPanel';
import { SaveModal } from '@/components/SaveModal';
import { TuningControls } from '@/components/TuningControls';
import { FretboardState, FretPosition, SavedConfiguration, TuningConfig } from '@/types';
import { audioService } from '@/utils/audioService';
import { exportService } from '@/utils/export';
import { localStorageService } from '@/utils/localStorage';
import { musicTheoryService } from '@/utils/musicTheory';
import { DEFAULT_TUNING } from '@/utils/tuningPresets';
import { Guitar } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export const App: React.FC = () => {
  const [fretboardState, setFretboardState] = useState<FretboardState>({});
  const [currentColor, setCurrentColor] = useState('#ffeb3b');
  const [savedConfigurations, setSavedConfigurations] = useState<SavedConfiguration[]>(
    localStorageService.getConfigurations()
  );
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isAnnotationModalOpen, setIsAnnotationModalOpen] = useState(false);
  const [currentAnnotationCell, setCurrentAnnotationCell] = useState<FretPosition | null>(null);
  const [title, setTitle] = useState<string>('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.3);
  const [noteDuration, setNoteDuration] = useState(1.5);
  const [currentTuning, setCurrentTuning] = useState<TuningConfig>(DEFAULT_TUNING);

  const fretboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    musicTheoryService.setCustomTuning(currentTuning.strings);
  }, [currentTuning]);

  const getCellKey = (string: number, fret: number): string => {
    return `${string}-${fret}`;
  };

  const handleCellClick = useCallback(async (string: number, fret: number) => {
    const key = getCellKey(string, fret);

    const isCurrentlySelected = !!fretboardState[key];
    const isSelecting = !isCurrentlySelected;

    setFretboardState(prev => {
      const newState = { ...prev };

      if (newState[key]) {
        delete newState[key];
      } else {
        newState[key] = {
          color: currentColor,
          annotation: ''
        };
      }

      return newState;
    });

    if (isAudioEnabled && isSelecting) {
      try {
        await audioService.playNote(string, fret, noteDuration);
      } catch (error) {
        console.warn('Failed to play note:', error);
      }
    }
  }, [currentColor, isAudioEnabled, noteDuration, fretboardState]);

  const handleCellRightClick = useCallback((string: number, fret: number) => {
    const key = getCellKey(string, fret);

    if (fretboardState[key]) {
      setCurrentAnnotationCell({ string, fret });
      setIsAnnotationModalOpen(true);
    }
  }, [fretboardState]);

  const handleColorChange = useCallback((color: string) => {
    setCurrentColor(color);
  }, []);

  const handleSave = useCallback(() => {
    setIsSaveModalOpen(true);
  }, []);

  const handleSaveConfiguration = useCallback((name: string) => {
    const config: SavedConfiguration = {
      id: Date.now(),
      name,
      state: JSON.parse(JSON.stringify(fretboardState)),
      date: new Date().toISOString()
    };

    try {
      localStorageService.saveConfiguration(config);
      setSavedConfigurations(localStorageService.getConfigurations());
      setIsSaveModalOpen(false);
    } catch (error) {
      console.error('Failed to save configuration:', error);
      alert('Failed to save configuration. Please try again.');
    }
  }, [fretboardState]);

  const handleClear = useCallback(() => {
    if (Object.keys(fretboardState).length > 0) {
      if (window.confirm('Are you sure you want to clear all selections?')) {
        setFretboardState({});
      }
    }
  }, [fretboardState]);

  const handleExport = useCallback(async () => {
    try {
      await exportService.exportToImage(fretboardRef, {}, title);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export image. Please try again.');
    }
  }, [title]);

  const handleToggleHistory = useCallback(() => {
    setIsHistoryOpen(prev => !prev);
  }, []);

  const handleLoadConfiguration = useCallback((id: number) => {
    const config = savedConfigurations.find(c => c.id === id);
    if (config) {
      setFretboardState(JSON.parse(JSON.stringify(config.state)));
      setIsHistoryOpen(false);
    }
  }, [savedConfigurations]);

  const handleDeleteConfiguration = useCallback((id: number) => {
    try {
      localStorageService.deleteConfiguration(id);
      setSavedConfigurations(localStorageService.getConfigurations());
    } catch (error) {
      console.error('Failed to delete configuration:', error);
      alert('Failed to delete configuration. Please try again.');
    }
  }, []);

  const handleImportConfigurations = useCallback((importedConfigs: SavedConfiguration[]) => {
    try {
      importedConfigs.forEach(config => {
        localStorageService.saveConfiguration(config);
      });

      setSavedConfigurations(localStorageService.getConfigurations());
    } catch (error) {
      console.error('Failed to import configurations:', error);
      alert('Failed to import configurations. Please try again.');
    }
  }, []);

  const handleSaveAnnotation = useCallback((annotation: string) => {
    if (currentAnnotationCell) {
      const key = getCellKey(currentAnnotationCell.string, currentAnnotationCell.fret);

      setFretboardState(prev => {
        const newState = { ...prev };
        if (newState[key]) {
          newState[key] = {
            ...newState[key],
            annotation
          };
        }
        return newState;
      });

      setCurrentAnnotationCell(null);
      setIsAnnotationModalOpen(false);
    }
  }, [currentAnnotationCell]);

  const getCurrentAnnotation = (): string => {
    if (currentAnnotationCell) {
      const key = getCellKey(currentAnnotationCell.string, currentAnnotationCell.fret);
      return fretboardState[key]?.annotation || '';
    }
    return '';
  };

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
  }, []);

  const handleToggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => !prev);
  }, []);

  const handleVolumeChange = useCallback((volume: number) => {
    setAudioVolume(volume);
    audioService.setVolume(volume);
  }, []);

  const handleStopAudio = useCallback(() => {
    audioService.stop();
  }, []);

  const handleDurationChange = useCallback((duration: number) => {
    setNoteDuration(duration);
  }, []);

  const handlePlayAllNotes = useCallback(async () => {
    if (!isAudioEnabled || Object.keys(fretboardState).length === 0) return;

    try {
      const notes = Object.keys(fretboardState).map(key => {
        const [string, fret] = key.split('-').map(Number);
        return { string, fret };
      });

      await audioService.playChord(notes, noteDuration + 1);
    } catch (error) {
      console.error('Failed to play all notes:', error);
    }
  }, [isAudioEnabled, fretboardState, noteDuration]);

  const handleTuningChange = useCallback((tuning: TuningConfig) => {
    setCurrentTuning(tuning);
    // Clear fretboard when tuning changes to avoid confusion
    setFretboardState({});
  }, []);

  const handleStringCountChange = useCallback((count: number) => {
    const newStrings = [...currentTuning.strings];

    if (count > newStrings.length) {
      // Add strings (use E for new strings)
      while (newStrings.length < count) {
        newStrings.push('E');
      }
    } else if (count < newStrings.length) {
      // Remove strings from the end
      newStrings.splice(count);
    }

    setCurrentTuning({
      name: 'Custom',
      strings: newStrings
    });
    // Clear fretboard when string count changes
    setFretboardState({});
  }, [currentTuning]);

  const handleIndividualStringChange = useCallback((stringIndex: number, note: string) => {
    const newStrings = [...currentTuning.strings];
    newStrings[stringIndex] = note;

    setCurrentTuning({
      name: 'Custom',
      strings: newStrings
    });
  }, [currentTuning]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto">
        {/* Header */}
        <header className="bg-gradient-to-r from-white to-gray-50 shadow-2xl rounded-b-2xl mb-8 border-b-4 border-blue-600">
          <div className="px-6 py-12 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Guitar className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Frettar
              </h1>
            </div>
            <p className="text-xl text-gray-600 font-medium">
              Interactive Guitar Fretboard Marker for Music Classes
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                Educational
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                Interactive
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                Free
              </span>
            </div>
          </div>
        </header>

        {/* Controls */}
        <Controls
          currentColor={currentColor}
          onColorChange={handleColorChange}
          onSave={handleSave}
          onClear={handleClear}
          onExport={handleExport}
          onToggleHistory={handleToggleHistory}
          title={title}
          onTitleChange={handleTitleChange}
          isAudioEnabled={isAudioEnabled}
          audioVolume={audioVolume}
          onToggleAudio={handleToggleAudio}
          onVolumeChange={handleVolumeChange}
          onStopAudio={handleStopAudio}
          onPlayAll={handlePlayAllNotes}
          hasSelectedNotes={Object.keys(fretboardState).length > 0}
          selectedNotesCount={Object.keys(fretboardState).length}
          noteDuration={noteDuration}
          onDurationChange={handleDurationChange}
        />

        {/* Tuning Controls */}
        <TuningControls
          currentTuning={currentTuning}
          onTuningChange={handleTuningChange}
          onStringCountChange={handleStringCountChange}
          onIndividualStringChange={handleIndividualStringChange}
        />

        {/* Fretboard */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 mb-8 border border-gray-200">
          <div ref={fretboardRef} className="w-full">
            <Fretboard
              fretboardState={fretboardState}
              currentColor={currentColor}
              onCellClick={handleCellClick}
              onCellRightClick={handleCellRightClick}
              tuningStrings={currentTuning.strings}
            />
          </div>
        </div>

        {/* History Panel */}
        <HistoryPanel
          isOpen={isHistoryOpen}
          configurations={savedConfigurations}
          onLoad={handleLoadConfiguration}
          onDelete={handleDeleteConfiguration}
          onImport={handleImportConfigurations}
        />

        {/* Modals */}
        <SaveModal
          isOpen={isSaveModalOpen}
          onSave={handleSaveConfiguration}
          onClose={() => setIsSaveModalOpen(false)}
        />

        <AnnotationModal
          isOpen={isAnnotationModalOpen}
          currentAnnotation={getCurrentAnnotation()}
          onSave={handleSaveAnnotation}
          onClose={() => {
            setIsAnnotationModalOpen(false);
            setCurrentAnnotationCell(null);
          }}
        />

        {/* Footer */}
        <footer className="text-center py-12 text-gray-500">
          <div className="bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px mb-8"></div>
          <p className="text-lg font-medium mb-4">© {new Date().getFullYear()} Frettar - Built for Guitar Education</p>
          <div className="flex justify-center mb-4">
            <img
              src="https://user-images.githubusercontent.com/30379522/193643568-4aac8ba2-4b08-4943-a043-963baa30df93.png"
              alt="Frettar Logo"
              className="w-24 h-24"
            />
          </div>
          <p className="text-sm mt-2">Made with ❤️ for musicians and educators</p>
          <p className="text-sm mt-2">
            <a
              href="https://github.com/zejiran/frettar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"></path>
              </svg>
              GitHub Repository
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};
