import React from 'react';
import { ControlsProps } from '@/types';
import { Palette, Save, Trash2, Download, History, Sparkles } from 'lucide-react';
import { AudioControls } from './AudioControls';

interface ExtendedControlsProps extends ControlsProps {
  title?: string;
  onTitleChange?: (title: string) => void;
}

export const Controls: React.FC<ExtendedControlsProps> = ({
  currentColor,
  onColorChange,
  onSave,
  onClear,
  onExport,
  onToggleHistory,
  title = '',
  onTitleChange,
  isAudioEnabled,
  audioVolume,
  onToggleAudio,
  onVolumeChange,
  onStopAudio,
  onPlayAll,
  hasSelectedNotes,
  selectedNotesCount,
  noteDuration,
  onDurationChange,
}) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value);
  };

  const predefinedColors = [
    { color: '#ffeb3b', name: 'Yellow' },
    { color: '#f44336', name: 'Red' },
    { color: '#4caf50', name: 'Green' },
    { color: '#2196f3', name: 'Blue' },
    { color: '#ff9800', name: 'Orange' },
    { color: '#9c27b0', name: 'Purple' },
    { color: '#00bcd4', name: 'Cyan' },
    { color: '#795548', name: 'Brown' },
    { color: '#607d8b', name: 'Blue Grey' },
    { color: '#e91e63', name: 'Pink' },
    { color: '#8bc34a', name: 'Light Green' },
    { color: '#ff5722', name: 'Deep Orange' },
  ];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-6 mb-4 border border-gray-200">
      <div className="max-w-6xl mx-auto">
        {/* Title Input */}
        <div className="flex flex-col items-center gap-3 mb-4 md:mb-6">
          <label className="text-sm font-bold text-gray-700">Configuration Title</label>
          <input
            type="text"
            value={title}
            onChange={e => onTitleChange?.(e.target.value)}
            placeholder="Enter a title for your fretboard"
            className="w-full max-w-96 px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-medium text-gray-700"
            maxLength={50}
          />
        </div>

        {/* Main Controls */}
        <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-4 md:gap-8 mb-4 md:mb-6">
          {/* Color Selection */}
          <div className="flex flex-col items-center gap-3 w-full md:w-auto">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-600" />
              Color Palette
            </label>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={currentColor}
                  onChange={handleColorChange}
                  className="w-12 h-12 md:w-14 md:h-14 border-3 border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-6 md:grid-cols-6 gap-1.5">
                {predefinedColors.map(({ color, name }) => (
                  <button
                    key={color}
                    onClick={() => onColorChange(color)}
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-lg border-2 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md ${
                      currentColor === color
                        ? 'border-gray-800 ring-2 ring-blue-500'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-3 w-full md:w-auto">
            <label className="text-sm font-bold text-gray-700">Main Actions</label>
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3 w-full md:w-auto">
              <button
                onClick={onClear}
                disabled={!hasSelectedNotes}
                className={`flex items-center justify-center gap-1 md:gap-2 px-3 md:px-5 py-2 md:py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg text-sm md:text-base ${
                  hasSelectedNotes
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title={
                  hasSelectedNotes
                    ? 'Clear all fret selections and annotations'
                    : 'No notes selected to clear'
                }
              >
                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                Clear
              </button>

              <button
                onClick={onToggleHistory}
                className="flex items-center justify-center gap-1 md:gap-2 px-3 md:px-5 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base"
                title="View and load previously saved configurations"
              >
                <History className="w-4 h-4 md:w-5 md:h-5" />
                History
              </button>

              <button
                onClick={onSave}
                className="flex items-center justify-center gap-1 md:gap-2 px-3 md:px-5 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base"
                title="Save current fretboard configuration for future usage"
              >
                <Save className="w-4 h-4 md:w-5 md:h-5" />
                Save
              </button>

              <button
                onClick={onExport}
                className="flex items-center justify-center gap-1 md:gap-2 px-3 md:px-5 py-2 md:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base"
                title="Download fretboard as PNG image"
              >
                <Download className="w-4 h-4 md:w-5 md:h-5" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="mb-4 md:mb-6">
          <AudioControls
            isAudioEnabled={isAudioEnabled}
            volume={audioVolume}
            onToggleAudio={onToggleAudio}
            onVolumeChange={onVolumeChange}
            onStopAll={onStopAudio}
            onPlayAll={onPlayAll}
            hasSelectedNotes={hasSelectedNotes}
            selectedNotesCount={selectedNotesCount}
            noteDuration={noteDuration}
            onDurationChange={onDurationChange}
          />
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-3 py-2 md:p-4 text-center">
          <div className="text-gray-700 font-medium text-sm md:text-base">
            <div className="py-1 md:py-0 md:inline">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs md:text-sm font-semibold mx-1 md:mx-2">
                Click
              </span>
              to select/deselect frets
              <span className="mx-1 md:mx-2 hidden md:inline">•</span>
            </div>
            <div className="py-1 md:py-0 md:inline">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs md:text-sm font-semibold mx-1 md:mx-2">
                Right-click
              </span>
              to add annotations
              <span className="mx-1 md:mx-2 hidden md:inline">•</span>
            </div>
            <div className="py-1 md:py-0 md:inline">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs md:text-sm font-semibold mx-1 md:mx-2">
                Colors
              </span>
              to categorize your markings
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
