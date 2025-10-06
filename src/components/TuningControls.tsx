import React, { useState } from 'react';
import { TuningControlsProps } from '@/types';
import { TUNING_PRESETS } from '@/utils/tuningPresets';
import { ChevronUp, ChevronDown, Guitar } from 'lucide-react';

export const TuningControls: React.FC<TuningControlsProps> = ({
  currentTuning,
  onTuningChange,
  onStringCountChange,
  onIndividualStringChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const NOTE_SEQUENCE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = e.target.value;
    const preset = TUNING_PRESETS.find(p => p.name === presetName);
    if (preset) {
      onTuningChange(preset);
    }
  };

  const handleStringCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value);
    onStringCountChange(count);
  };

  const adjustNote = (stringIndex: number, direction: 'up' | 'down') => {
    const currentNote = currentTuning.strings[stringIndex];
    if (!currentNote) return;

    const currentIndex = NOTE_SEQUENCE.indexOf(currentNote);

    if (currentIndex === -1) return;

    const newIndex = direction === 'up'
      ? (currentIndex + 1) % NOTE_SEQUENCE.length
      : (currentIndex - 1 + NOTE_SEQUENCE.length) % NOTE_SEQUENCE.length;

    const newNote = NOTE_SEQUENCE[newIndex];
    if (newNote) {
      onIndividualStringChange(stringIndex, newNote);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-6 mb-4 border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Guitar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Tuning Settings</h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Tuning Preset Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tuning Preset
            </label>
            <select
              value={currentTuning.name}
              onChange={handlePresetChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {currentTuning.name === 'Custom' && (
                <option value="Custom">Custom</option>
              )}
              {TUNING_PRESETS.map(preset => (
                <option key={preset.name} value={preset.name}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Strings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Strings
            </label>
            <select
              value={currentTuning.strings.length}
              onChange={handleStringCountChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {[4, 5, 6, 7, 8].map(count => (
                <option key={count} value={count}>
                  {count} strings
                </option>
              ))}
            </select>
          </div>

          {/* Individual String Tuning */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Individual String Tuning (High to Low)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...currentTuning.strings].reverse().map((note, reversedIndex) => {
                const index = currentTuning.strings.length - 1 - reversedIndex;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-200"
                  >
                    <span className="text-sm font-medium text-gray-600 w-16">
                      String {reversedIndex + 1}:
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => adjustNote(index, 'down')}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Lower note"
                      >
                        <ChevronDown className="w-4 h-4 text-gray-700" />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-800 text-lg">
                        {note}
                      </span>
                      <button
                        onClick={() => adjustNote(index, 'up')}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Raise note"
                      >
                        <ChevronUp className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Tuning Display */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 shadow-sm">
            <p className="text-sm font-medium text-blue-800">
              Current Tuning: <span className="font-bold">{currentTuning.name}</span>
            </p>
            <p className="text-sm text-blue-700 mt-1">
              {[...currentTuning.strings].reverse().join(' - ')} ({currentTuning.strings.length} strings) - High to Low
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
