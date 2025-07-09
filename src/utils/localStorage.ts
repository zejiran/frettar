import { LocalStorageService, SavedConfiguration } from '@/types';

const STORAGE_KEY = 'frettar-configurations';

export const localStorageService: LocalStorageService = {
  getConfigurations: (): SavedConfiguration[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);

      // Validate the structure
      if (!Array.isArray(parsed)) return [];

      return parsed.filter((config: unknown): config is SavedConfiguration => {
        return (
          typeof config === 'object' &&
          config !== null &&
          'id' in config &&
          'name' in config &&
          'state' in config &&
          'date' in config &&
          typeof (config as SavedConfiguration).id === 'number' &&
          typeof (config as SavedConfiguration).name === 'string' &&
          typeof (config as SavedConfiguration).state === 'object' &&
          typeof (config as SavedConfiguration).date === 'string'
        );
      });
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveConfiguration: (config: SavedConfiguration): void => {
    try {
      const existing = localStorageService.getConfigurations();
      const updated = [...existing, config];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save configuration');
    }
  },

  deleteConfiguration: (id: number): void => {
    try {
      const existing = localStorageService.getConfigurations();
      const filtered = existing.filter(config => config.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
      throw new Error('Failed to delete configuration');
    }
  },

  clearAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      throw new Error('Failed to clear configurations');
    }
  }
};

// Helper functions for other localStorage operations
export const getStorageSize = (): number => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Blob([stored]).size : 0;
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
};

export const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

export const exportConfigurationsToFile = (configurations: SavedConfiguration[]): void => {
  try {
    const dataStr = JSON.stringify(configurations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `frettar-configurations-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Error exporting configurations:', error);
    throw new Error('Failed to export configurations');
  }
};

export const importConfigurationsFromFile = (file: File): Promise<SavedConfiguration[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') {
          reject(new Error('Invalid file content'));
          return;
        }

        const parsed = JSON.parse(result);

        if (!Array.isArray(parsed)) {
          reject(new Error('Invalid file format: expected array'));
          return;
        }

        const validConfigurations = parsed.filter((config: unknown): config is SavedConfiguration => {
          return (
            typeof config === 'object' &&
            config !== null &&
            'id' in config &&
            'name' in config &&
            'state' in config &&
            'date' in config &&
            typeof (config as SavedConfiguration).id === 'number' &&
            typeof (config as SavedConfiguration).name === 'string' &&
            typeof (config as SavedConfiguration).state === 'object' &&
            typeof (config as SavedConfiguration).date === 'string'
          );
        });

        resolve(validConfigurations);
      } catch (error) {
        reject(new Error('Invalid JSON format'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

export const getStorageQuota = (): Promise<{ used: number; total: number }> => {
  return new Promise((resolve, reject) => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        resolve({
          used: estimate.usage || 0,
          total: estimate.quota || 0
        });
      }).catch(reject);
    } else {
      // Fallback for browsers without storage API
      const used = getStorageSize();
      resolve({
        used,
        total: 5 * 1024 * 1024 // Assume 5MB limit
      });
    }
  });
};
