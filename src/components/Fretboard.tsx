import React from 'react';
import { FretboardProps } from '@/types';
import { FretCell } from './FretCell';
import { musicTheoryService } from '@/utils/musicTheory';
import { CircleDot, Shell } from 'lucide-react';

export const Fretboard: React.FC<FretboardProps> = ({
  fretboardState,
  currentColor,
  onCellClick,
  onCellRightClick,
  tuningStrings,
}) => {
  const stringNotes = tuningStrings;
  const numberOfFrets = 24;

  const getCellKey = (string: number, fret: number): string => {
    return `${string}-${fret}`;
  };

  const renderFretNumbers = () => {
    const fretNumbers = [];
    for (let fret = 0; fret <= numberOfFrets; fret++) {
      fretNumbers.push(
        <div
          key={fret}
          className={`w-11 h-10 flex items-center justify-center bg-gradient-to-b from-gray-700 to-gray-800 text-white text-sm font-bold shadow-sm ${
            fret < numberOfFrets ? 'border-r border-gray-900' : ''
          }`}
        >
          {fret}
        </div>
      );
    }
    return fretNumbers;
  };

  const renderStringRow = (stringIndex: number) => {
    const cells = [];

    cells.push(
      <div
        key={`string-${stringIndex}`}
        className="w-15 h-15 flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold text-lg border-r-2 border-gray-900 shadow-lg"
      >
        <Shell className="w-2.5 text-white" />
      </div>
    );

    for (let fret = 0; fret <= numberOfFrets; fret++) {
      const note = musicTheoryService.getNote(stringIndex, fret, false, stringNotes);
      const cellKey = getCellKey(stringIndex, fret);
      const cellState = fretboardState[cellKey];
      const isSelected = !!cellState;
      const color = cellState?.color || currentColor;
      const annotation = cellState?.annotation || '';

      cells.push(
        <FretCell
          key={cellKey}
          string={stringIndex}
          fret={fret}
          note={note}
          isSelected={isSelected}
          color={color}
          annotation={annotation}
          currentColor={currentColor}
          onCellClick={onCellClick}
          onCellRightClick={onCellRightClick}
          isLastFret={fret === numberOfFrets}
          tuningStrings={stringNotes}
        />
      );
    }

    return cells;
  };

  return (
    <div className="flex justify-center overflow-x-auto p-6 pt-8 pb-20">
      <div className="border-3 border-gray-900 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl overflow-hidden inline-block mt-4 min-w-[900px]">
        {/* Fret numbers header */}
        <div className="flex border-b-3 border-gray-900 bg-gradient-to-r from-gray-700 to-gray-800">
          <div className="w-15 h-10 flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold border-r-2 border-gray-900 shadow-lg">
            FRET
          </div>
          {renderFretNumbers()}
        </div>

        {/* String rows */}
        {stringNotes.map((_, stringIndex) => (
          <div
            key={stringIndex}
            className={`flex relative ${
              stringIndex < stringNotes.length - 1 ? 'border-b-2 border-gray-900' : ''
            }`}
            style={{ zIndex: 1 }}
          >
            {renderStringRow(stringNotes.length - 1 - stringIndex)}
          </div>
        ))}
      </div>
    </div>
  );
};
