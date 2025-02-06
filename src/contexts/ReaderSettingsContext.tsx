import React, { createContext, useContext, useState, useEffect } from 'react';

interface ReaderSettings {
  fontSize: string;
  fontFamily: string;
  lineHeight: string;
  textAlign: string;
  theme: 'light' | 'dark' | 'sepia';
}

interface ReaderSettingsContextType {
  settings: ReaderSettings;
  updateSettings: (newSettings: Partial<ReaderSettings>) => void;
}

const defaultSettings: ReaderSettings = {
  fontSize: '18px',
  fontFamily: 'Inter',
  lineHeight: '1.6',
  textAlign: 'left',
  theme: 'light',
};

const ReaderSettingsContext = createContext<ReaderSettingsContextType | undefined>(undefined);

export const ReaderSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    const saved = localStorage.getItem('readerSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('readerSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <ReaderSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ReaderSettingsContext.Provider>
  );
};

export const useReaderSettings = () => {
  const context = useContext(ReaderSettingsContext);
  if (!context) {
    throw new Error('useReaderSettings must be used within a ReaderSettingsProvider');
  }
  return context;
};