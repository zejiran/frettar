import React from 'react';
import { FretboardProps } from '@/types';
import { FretCell } from './FretCell';
import { musicTheoryService } from '@/utils/musicTheory';

export const Fretboard: React.FC<FretboardProps> = ({
  fretboardState,
  currentColor,
  onCellClick,
  onCellRightClick,
}) => {
  const stringNotes = musicTheoryService.getStringNotes();
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
        {stringNotes[stringIndex]}
      </div>
    );

    for (let fret = 0; fret <= numberOfFrets; fret++) {
      const note = musicTheoryService.getNote(stringIndex, fret);
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
        />
      );
    }

    return cells;
  };

  return (
    <>
      {/* Desktop/Tablet Layout (Horizontal) */}
      <div className="hidden md:flex justify-center overflow-x-auto p-4">
        <div className="border-3 border-gray-900 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl overflow-hidden inline-block">
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
              className={`flex ${
                stringIndex < stringNotes.length - 1 ? 'border-b-2 border-gray-900' : ''
              }`}
            >
              {renderStringRow(stringNotes.length - 1 - stringIndex)}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout (Vertical) */}
      <div className="md:hidden p-4">
        <div className="border-3 border-gray-900 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl overflow-hidden">
          {/* Strings header for mobile */}
          <div className="flex border-b-3 border-gray-900 bg-gradient-to-r from-gray-700 to-gray-800">
            <div className="w-12 h-10 flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold border-r-2 border-gray-900 shadow-lg text-xs">
              STR
            </div>
            {stringNotes.slice().reverse().map((note, index) => (
              <div
                key={index}
                className={`flex-1 h-10 flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold text-sm shadow-lg ${
                  index < stringNotes.length - 1 ? 'border-r border-gray-900' : ''
                }`}
              >
                {note}
              </div>
            ))}
          </div>

          {/* Fret rows for mobile */}
          {Array.from({ length: numberOfFrets + 1 }, (_, fret) => (
            <div
              key={fret}
              className={`flex ${
                fret < numberOfFrets ? 'border-b border-gray-900' : ''
              }`}
            >
              {/* Fret number */}
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-b from-gray-700 to-gray-800 text-white text-xs font-bold border-r border-gray-900 shadow-sm">
                {fret}
              </div>

              {/* Fret cells for each string */}
              {stringNotes.map((_, index) => {
                const stringIndex = stringNotes.length - 1 - index;
                const note = musicTheoryService.getNote(stringIndex, fret);
                const cellKey = getCellKey(stringIndex, fret);
                const cellState = fretboardState[cellKey];
                const isSelected = !!cellState;
                const color = cellState?.color || currentColor;
                const annotation = cellState?.annotation || '';

                return (
                  <div
                    key={`${stringIndex}-${fret}`}
                    className={`flex-1 h-12 mobile-fret-cell ${
                      index < stringNotes.length - 1 ? 'border-r border-gray-400' : ''
                    }`}
                  >
                    <FretCell
                      string={stringIndex}
                      fret={fret}
                      note={note}
                      isSelected={isSelected}
                      color={color}
                      annotation={annotation}
                      currentColor={currentColor}
                      onCellClick={onCellClick}
                      onCellRightClick={onCellRightClick}
                      isLastFret={false}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
