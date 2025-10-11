import React, { useEffect, useState } from 'react';
import { Undo2, X, CheckCircle } from 'lucide-react';

interface EphemeralUndoDialogProps {
  isVisible: boolean;
  message: string;
  onUndo: () => void;
  onClose: () => void;
  duration?: number;
}

export const EphemeralUndoDialog: React.FC<EphemeralUndoDialogProps> = ({
  isVisible,
  message,
  onUndo,
  onClose,
  duration = 5000, // 5 seconds default
}) => {
  const [timeLeft, setTimeLeft] = useState(duration / 1000);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setTimeLeft(duration / 1000);
      setIsClosing(false);
      return;
    }

    const handleAutoClose = () => {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, 200);
    };

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAutoClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      handleAutoClose();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // Wait for close animation
  };

  const handleUndo = () => {
    onUndo();
    handleClose();
  };

  if (!isVisible) return null;

  const progressPercentage = (timeLeft / (duration / 1000)) * 100;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          bg-white border border-gray-200 rounded-xl shadow-2xl p-4 min-w-80 max-w-sm
          transform transition-all duration-200 ease-out
          ${isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        `}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 rounded-t-xl overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-3 pt-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-gray-900">Action Complete</span>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150 p-1 hover:bg-gray-100 rounded-md"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-700 text-sm mb-4 leading-relaxed">{message}</p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleUndo}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-150 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Undo2 className="w-4 h-4" />
            Undo
          </button>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Closes in</span>
            <span className="font-mono font-medium bg-gray-100 px-2 py-1 rounded">
              {Math.max(0, Math.ceil(timeLeft))}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
