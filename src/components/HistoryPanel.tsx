import React, { useState, useRef } from 'react';
import { HistoryPanelProps, SavedConfiguration } from '@/types';
import { History, Play, Trash2, Calendar, Search, Download, Upload } from 'lucide-react';
import { importConfigurationsFromFile } from '@/utils/localStorage';

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  configurations,
  onLoad,
  onDelete,
  onImport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredConfigurations = configurations
    .filter(config => config.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comparison = a.name.localeCompare(b.name);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      onDelete(id);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getConfigurationStats = (config: SavedConfiguration) => {
    const selectedFrets = Object.keys(config.state).length;
    const annotatedFrets = Object.values(config.state).filter(
      state => state.annotation && state.annotation.trim() !== ''
    ).length;

    return { selectedFrets, annotatedFrets };
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedConfigurations = await importConfigurationsFromFile(file);

      if (importedConfigurations.length === 0) {
        alert('No valid configurations found in the file.');
        return;
      }

      const newConfigs = importedConfigurations.map(config => ({
        ...config,
        id: Date.now() + Math.random(),
      }));

      onImport(newConfigs);
      alert(`Successfully imported ${newConfigs.length} configuration(s).`);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import configurations. Please check the file format.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-6 mb-4 border border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <History className="w-5 h-5" />
            Saved Configurations
          </h3>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search configurations..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sort controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'date' | 'name')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{configurations.length}</div>
            <div className="text-sm text-gray-600">Total Configurations</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {configurations.reduce((sum, config) => sum + Object.keys(config.state).length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Marked Frets</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {configurations.reduce(
                (sum, config) =>
                  sum +
                  Object.values(config.state).filter(
                    state => state.annotation && state.annotation.trim() !== ''
                  ).length,
                0
              )}
            </div>
            <div className="text-sm text-gray-600">Total Annotations</div>
          </div>
        </div>

        {/* Configuration List */}
        {filteredConfigurations.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-500 mb-2">
              {searchTerm ? 'No matching configurations found' : 'No saved configurations'}
            </h4>
            <p className="text-gray-400">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Start creating fretboard configurations and save them to see them here'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConfigurations.map(config => {
              const { selectedFrets, annotatedFrets } = getConfigurationStats(config);

              return (
                <div
                  key={config.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-800 truncate flex-1 mr-2">
                      {config.name}
                    </h4>
                    <div className="flex gap-1">
                      <button
                        onClick={() => onLoad(config.id)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Load Configuration"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(config.id, config.name)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Configuration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    {formatDate(config.date)}
                  </div>

                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">{selectedFrets} frets</span>
                    </div>
                    {annotatedFrets > 0 && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">{annotatedFrets} notes</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => onLoad(config.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        Load
                      </button>

                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            const sanitizedTitle = config.name
                              .trim()
                              .replace(/[^a-zA-Z0-9\-_\s]/g, '')
                              .replace(/\s+/g, '-');
                            const dateStr = new Date().toISOString().split('T')[0];
                            const filename = `fretboard-config-${sanitizedTitle}-${dateStr}.json`;

                            const dataStr = JSON.stringify(config, null, 2);
                            const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
                            const linkElement = document.createElement('a');
                            linkElement.setAttribute('href', dataUri);
                            linkElement.setAttribute('download', filename);
                            linkElement.click();
                          }}
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                          title="Export Configuration"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                const dateStr = new Date().toISOString().split('T')[0];
                const filename = `frettar-all-configurations-${dateStr}.json`;
                const dataStr = JSON.stringify(configurations, null, 2);
                const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', filename);
                linkElement.click();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export All
            </button>
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
