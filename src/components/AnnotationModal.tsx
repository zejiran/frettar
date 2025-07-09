import React, { useState, useEffect } from 'react';
import { AnnotationModalProps } from '@/types';
import { X, MessageSquare } from 'lucide-react';

export const AnnotationModal: React.FC<AnnotationModalProps> = ({
  isOpen,
  currentAnnotation,
  onSave,
  onClose,
}) => {
  const [annotationText, setAnnotationText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnnotationText(currentAnnotation);
      setIsSubmitting(false);
    }
  }, [isOpen, currentAnnotation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await onSave(annotationText.trim());
      onClose();
    } catch (error) {
      console.error('Error saving annotation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleClear = () => {
    setAnnotationText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Add Annotation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="annotationText" className="block text-sm font-medium text-gray-700 mb-2">
              Annotation Text
            </label>
            <input
              id="annotationText"
              type="text"
              value={annotationText}
              onChange={(e) => setAnnotationText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter annotation text (e.g., 'Root', 'V', '1st')"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={10}
              autoFocus
              disabled={isSubmitting}
            />
            <p className="mt-1 text-sm text-gray-500">
              {annotationText.length}/10 characters
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <strong>Tips:</strong> Use short labels like "R" for root, "5" for fifth, or "F1" for finger 1.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Clear
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <MessageSquare className="w-4 h-4" />
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
