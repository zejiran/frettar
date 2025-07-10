import React from 'react';
import { FretCellProps } from '@/types';
import { musicTheoryService } from '@/utils/musicTheory';

export const FretCell: React.FC<FretCellProps> = ({
  string,
  fret,
  isSelected,
  color,
  annotation,
  currentColor,
  onCellClick,
  onCellRightClick,
  isLastFret = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onCellClick(string, fret);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onCellRightClick(string, fret);
  };

  const noteWithVariants = musicTheoryService.getNoteWithBothVariants(string, fret);

  // Special background for octave positions (0, 12, 24)
  const isOctavePosition = fret === 0 || fret === 12 || fret === 24;
  const defaultBackgroundColor = isOctavePosition ? '#e9ecef' : 'white';

  return (
    <div
      className={`
        relative w-11 h-15 flex items-center justify-center
        cursor-pointer transition-all duration-300 hover:bg-gray-50
        hover:scale-110 group shadow-sm hover:shadow-md overflow-visible
        ${!isLastFret ? 'border-r border-gray-400' : ''}
        ${isSelected ? 'rounded-full border-3 border-gray-900 ring-2 ring-blue-500' : ''}
      `}
      style={{
        backgroundColor: isSelected ? color : defaultBackgroundColor,
        boxShadow: isSelected ? `0 0 0 2px ${color}30, 0 4px 8px rgba(0,0,0,0.1)` : undefined,
        transform: isSelected ? 'scale(0.95)' : undefined,
      }}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      data-string={string}
      data-fret={fret}
    >

      <div className={`font-bold select-none transition-colors duration-200 text-center ${
        isSelected ? 'text-gray-900' : 'text-gray-600'
      } ${noteWithVariants.includes('/') ? 'note-variants' : 'text-xs md:text-xs sm:text-2xs'}`}>
        {noteWithVariants}
      </div>


      {annotation && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs md:text-xs sm:text-2xs font-bold text-gray-900 bg-white bg-opacity-95 rounded px-2 py-1 shadow-lg z-30 border border-gray-200 whitespace-nowrap min-w-max">
          {annotation}
        </div>
      )}


      {!isSelected && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-all duration-300 transform group-hover:scale-95"
          style={{
            backgroundColor: currentColor,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.6)'
          }}
        />
      )}


      {!isSelected && (fret === 3 || fret === 5 || fret === 7 || fret === 9 || fret === 15 || fret === 17 || fret === 19 || fret === 21) && string === 2 && (
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full opacity-60 shadow-sm" />
      )}


      {!isSelected && fret === 12 && (string === 1 || string === 4) && (
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full opacity-60 shadow-sm" />
      )}


      {!isSelected && fret === 24 && (string === 1 || string === 4) && (
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full opacity-60 shadow-sm" />
      )}

    </div>
  );
};
