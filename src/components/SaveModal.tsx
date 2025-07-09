import React, { useState, useEffect } from 'react';
import { SaveModalProps } from '@/types';
import { X, Save } from 'lucide-react';

export const SaveModal: React.FC<SaveModalProps> = ({
  isOpen,
  onSave,
  onClose,
}) => {
  const [configName, setConfigName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfigName('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = configName.trim();
    if (!trimmedName) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(trimmedName);
      onClose();
    } catch (error) {
      console.error('Error saving configuration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Save Configuration</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="configName" className="block text-sm font-medium text-gray-700 mb-2">
              Configuration Name
            </label>
            <input
              id="configName"
              type="text"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a name for your configuration"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={50}
              autoFocus
              disabled={isSubmitting}
            />
            <p className="mt-1 text-sm text-gray-500">
              {configName.length}/50 characters
            </p>
          </div>

          <div className="flex justify-end gap-3">
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
              disabled={!configName.trim() || isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
