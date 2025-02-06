import { useReaderSettings } from '../contexts/ReaderSettingsContext';

// ... existing imports and code ...

const Settings = () => {
  const { settings, updateSettings } = useReaderSettings();

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* ... existing settings sections ... */}

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Reader Settings</h2>
        <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">Font Size</label>
            <select
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="16px">Small</option>
              <option value="18px">Medium</option>
              <option value="20px">Large</option>
              <option value="24px">Extra Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">Font Family</label>
            <select
              value={settings.fontFamily}
              onChange={(e) => updateSettings({ fontFamily: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Inter">Inter</option>
              <option value="Georgia">Georgia</option>
              <option value="system-ui">System Default</option>
              <option value="serif">Serif</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">Line Height</label>
            <select
              value={settings.lineHeight}
              onChange={(e) => updateSettings({ lineHeight: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="1.4">Compact</option>
              <option value="1.6">Comfortable</option>
              <option value="2">Spacious</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">Text Alignment</label>
            <select
              value={settings.textAlign}
              onChange={(e) => updateSettings({ textAlign: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="left">Left</option>
              <option value="justify">Justified</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' | 'sepia' })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="sepia">Sepia</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
};