import { AnnotationModal } from '@/components/AnnotationModal';
import { Controls } from '@/components/Controls';
import { EphemeralUndoDialog } from '@/components/EphemeralUndoDialog';
import { Fretboard as FretboardComponent } from '@/components/Fretboard';
import { HistoryPanel } from '@/components/HistoryPanel';
import { SaveModal } from '@/components/SaveModal';
import { TuningControls } from '@/components/TuningControls';
import { FretboardState, FretPosition, SavedConfiguration, TuningConfig } from '@/types';
import { audioService } from '@/utils/audioService';
import { exportService } from '@/utils/export';
import { localStorageService } from '@/utils/localStorage';
import { musicTheoryService } from '@/utils/musicTheory';
import { DEFAULT_TUNING } from '@/utils/tuningPresets';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export const Fretboard: React.FC = () => {
  const [fretboardState, setFretboardState] = useState<FretboardState>({});
  const [currentColor, setCurrentColor] = useState('#ffeb3b');
  const [savedConfigurations, setSavedConfigurations] = useState<SavedConfiguration[]>(
    localStorageService.getConfigurations()
  );

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isAnnotationModalOpen, setIsAnnotationModalOpen] = useState(false);
  const [currentAnnotationCell, setCurrentAnnotationCell] = useState<FretPosition | null>(null);
  const [title, setTitle] = useState<string>('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.3);
  const [noteDuration, setNoteDuration] = useState(1.5);
  const [currentTuning, setCurrentTuning] = useState<TuningConfig>(DEFAULT_TUNING);
  const [isUndoDialogVisible, setIsUndoDialogVisible] = useState(false);
  const [previousFretboardState, setPreviousFretboardState] = useState<FretboardState>({});

  const fretboardRef = useRef<HTMLDivElement>(null);
  const historyPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    musicTheoryService.setCustomTuning(currentTuning.strings);
  }, [currentTuning]);

  const getCellKey = (string: number, fret: number): string => {
    return `${string}-${fret}`;
  };

  const handleCellClick = useCallback(
    async (string: number, fret: number) => {
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
            annotation: '',
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
    },
    [currentColor, isAudioEnabled, noteDuration, fretboardState]
  );

  const handleCellRightClick = useCallback(
    (string: number, fret: number) => {
      const key = getCellKey(string, fret);

      if (fretboardState[key]) {
        setCurrentAnnotationCell({ string, fret });
        setIsAnnotationModalOpen(true);
      }
    },
    [fretboardState]
  );

  const handleColorChange = useCallback((color: string) => {
    setCurrentColor(color);
  }, []);

  const handleSave = useCallback(() => {
    setIsSaveModalOpen(true);
  }, []);

  const handleSaveConfiguration = useCallback(
    (name: string) => {
      const config: SavedConfiguration = {
        id: Date.now(),
        name,
        state: JSON.parse(JSON.stringify(fretboardState)),
        date: new Date().toISOString(),
      };

      try {
        localStorageService.saveConfiguration(config);
        setSavedConfigurations(localStorageService.getConfigurations());
        setIsSaveModalOpen(false);
      } catch (error) {
        console.error('Failed to save configuration:', error);
        alert('Failed to save configuration. Please try again.');
      }
    },
    [fretboardState]
  );

  const handleClear = useCallback(() => {
    if (Object.keys(fretboardState).length > 0) {
      // Store current state for undo functionality
      setPreviousFretboardState(JSON.parse(JSON.stringify(fretboardState)));
      // Clear the fretboard
      setFretboardState({});
      // Show the ephemeral undo dialog
      setIsUndoDialogVisible(true);
    }
  }, [fretboardState]);

  const handleUndoClear = useCallback(() => {
    setFretboardState(previousFretboardState);
    setIsUndoDialogVisible(false);
    setPreviousFretboardState({});
  }, [previousFretboardState]);

  const handleCloseUndoDialog = useCallback(() => {
    setIsUndoDialogVisible(false);
    setPreviousFretboardState({});
  }, []);

  const handleExport = useCallback(async () => {
    try {
      await exportService.exportToImage(fretboardRef, {}, title);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export image. Please try again.');
    }
  }, [title]);

  const handleScrollToHistory = useCallback(() => {
    historyPanelRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const handleLoadConfiguration = useCallback(
    (id: number) => {
      const config = savedConfigurations.find(c => c.id === id);
      if (config) {
        setFretboardState(JSON.parse(JSON.stringify(config.state)));
      }
    },
    [savedConfigurations]
  );

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

  const handleSaveAnnotation = useCallback(
    (annotation: string) => {
      if (currentAnnotationCell) {
        const key = getCellKey(currentAnnotationCell.string, currentAnnotationCell.fret);

        setFretboardState(prev => {
          const newState = { ...prev };
          if (newState[key]) {
            newState[key] = {
              ...newState[key],
              annotation,
            };
          }
          return newState;
        });

        setCurrentAnnotationCell(null);
        setIsAnnotationModalOpen(false);
      }
    },
    [currentAnnotationCell]
  );

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
        const [stringStr, fretStr] = key.split('-');
        const string = Number(stringStr);
        const fret = Number(fretStr);
        return { string: string || 0, fret: fret || 0 };
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

  const handleStringCountChange = useCallback(
    (count: number) => {
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
        strings: newStrings,
      });
      // Clear fretboard when string count changes
      setFretboardState({});
    },
    [currentTuning]
  );

  const handleIndividualStringChange = useCallback(
    (stringIndex: number, note: string) => {
      const newStrings = [...currentTuning.strings];
      newStrings[stringIndex] = note;

      setCurrentTuning({
        name: 'Custom',
        strings: newStrings,
      });
    },
    [currentTuning]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-6 py-8">
        {/* Tuning Controls */}
        <TuningControls
          currentTuning={currentTuning}
          onTuningChange={handleTuningChange}
          onStringCountChange={handleStringCountChange}
          onIndividualStringChange={handleIndividualStringChange}
        />

        {/* Controls */}
        <Controls
          currentColor={currentColor}
          onColorChange={handleColorChange}
          onSave={handleSave}
          onClear={handleClear}
          onExport={handleExport}
          onToggleHistory={handleScrollToHistory}
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

        {/* Fretboard */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 mb-8 border border-gray-200">
          <div ref={fretboardRef} className="w-full">
            <FretboardComponent
              fretboardState={fretboardState}
              currentColor={currentColor}
              onCellClick={handleCellClick}
              onCellRightClick={handleCellRightClick}
              tuningStrings={currentTuning.strings}
            />
          </div>
        </div>

        {/* History Panel */}
        <div ref={historyPanelRef}>
          <HistoryPanel
            isOpen={true}
            configurations={savedConfigurations}
            onLoad={handleLoadConfiguration}
            onDelete={handleDeleteConfiguration}
            onImport={handleImportConfigurations}
          />
        </div>

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

        <EphemeralUndoDialog
          isVisible={isUndoDialogVisible}
          message="All fret selections and annotations have been cleared."
          onUndo={handleUndoClear}
          onClose={handleCloseUndoDialog}
          duration={5000}
        />
      </div>
    </div>
  );
};
