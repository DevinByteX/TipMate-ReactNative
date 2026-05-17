import React, { ReactNode } from 'react';
import { UserSettingsProvider, useUserSettings } from './UserSettingsContext';
import { ConfigProvider, useConfig } from './ConfigContext';
import { HistoryProvider, useHistory } from './HistoryContext';
import { SplitSessionProvider, useSplitSession } from './SplitSessionContext';

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <UserSettingsProvider>
      <ConfigProvider>
        <HistoryProvider>
          <SplitSessionProvider>{children}</SplitSessionProvider>
        </HistoryProvider>
      </ConfigProvider>
    </UserSettingsProvider>
  );
};

export default AppProvider;

export { useUserSettings, useConfig, useHistory, useSplitSession };
