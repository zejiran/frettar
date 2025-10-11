import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChange: (value: string) => void;
  maxHeight?: number;
  searchable?: boolean;
  label?: string;
  error?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder = 'Select an option...',
  disabled = false,
  className = '',
  onChange,
  maxHeight = 200,
  searchable = false,
  label,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected option
  const selectedOption = options.find(option => option.value === value);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>}

      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-left bg-white border-2 rounded-xl
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200 font-medium shadow-sm
          ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
              : 'hover:border-blue-300 cursor-pointer border-gray-300'
          }
          ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            } ${disabled ? 'text-gray-400' : 'text-gray-600'}`}
          />
        </div>
      </button>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl">
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div className="py-1 overflow-y-auto" style={{ maxHeight: `${maxHeight}px` }}>
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                {searchTerm ? 'No matching options' : 'No options available'}
              </div>
            ) : (
              filteredOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  disabled={option.disabled}
                  className={`
                    w-full px-4 py-3 text-left text-sm transition-colors duration-150
                    flex items-center justify-between
                    ${
                      option.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-900 hover:bg-blue-50 hover:text-blue-900 cursor-pointer'
                    }
                    ${option.value === value ? 'bg-blue-100 text-blue-900 font-medium' : ''}
                  `}
                >
                  <span>{option.label}</span>
                  {option.value === value && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
