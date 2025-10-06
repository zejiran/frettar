import React from 'react';
import { AudioControlsProps } from '@/types';
import { Volume2, VolumeX, Square, Music, Clock } from 'lucide-react';

export const AudioControls: React.FC<AudioControlsProps> = ({
  isAudioEnabled,
  volume,
  onToggleAudio,
  onVolumeChange,
  onStopAll,
  onPlayAll,
  hasSelectedNotes,
  noteDuration,
  onDurationChange,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Audio Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Audio:</span>
        <button
          onClick={onToggleAudio}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isAudioEnabled
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          title={isAudioEnabled ? 'Disable audio' : 'Enable audio'}
        >
          {isAudioEnabled ? (
            <>
              <Volume2 className="w-4 h-4" />
              <span>On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Off</span>
            </>
          )}
        </button>
      </div>

      {/* Audio Controls */}
      {isAudioEnabled && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Volume:</span>
            <div className="flex items-center gap-2">
              <VolumeX className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={e => onVolumeChange(parseFloat(e.target.value))}
                className="w-24 h-2 bg-gray-200 rounded-lg cursor-pointer volume-slider"
                title={`Volume: ${Math.round(volume * 100)}%`}
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`,
                }}
              />
              <Volume2 className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-500 min-w-[3ch]">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          {/* Duration Control */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Duration:</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={noteDuration}
                onChange={e => onDurationChange(parseFloat(e.target.value))}
                className="w-24 h-2 bg-gray-200 rounded-lg cursor-pointer duration-slider"
                title={`Note duration: ${noteDuration}s`}
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${((noteDuration - 0.5) / 4.5) * 100}%, #e5e7eb ${((noteDuration - 0.5) / 4.5) * 100}%, #e5e7eb 100%)`,
                }}
              />
              <span className="text-xs text-gray-600 font-medium min-w-[3.5ch]">
                {noteDuration}s
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPlayAll}
              disabled={!hasSelectedNotes}
              className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Play all selected notes together"
            >
              <Music className="w-4 h-4" />
              <span>Play All</span>
            </button>

            <button
              onClick={onStopAll}
              className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-all duration-200"
              title="Stop all playing notes"
            >
              <Square className="w-4 h-4" />
              <span>Stop</span>
            </button>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="text-xs text-gray-500 border-t lg:border-t-0 lg:border-l border-gray-300 pt-4 lg:pt-0 lg:pl-4 w-full lg:w-auto">
        {isAudioEnabled ? (
          <div>
            <div className="font-medium">🎵 Click frets to play notes</div>
          </div>
        ) : (
          <div className="font-medium">🔇 Enable audio to hear sounds</div>
        )}
      </div>
    </div>
  );
};
