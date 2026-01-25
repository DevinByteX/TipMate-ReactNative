import React, { createContext, Dispatch, ReactNode, useContext, useEffect } from 'react';
import { AppState, AppAction } from './types';
import { rootReducer } from './rootReducer';
import { Constants } from '@configs';
import { usePersistedReducer } from '@hooks';
import { changeLanguage, applyRTLSync, getCurrentLanguage } from '../localization';

const initialState: AppState = {
  tips: Constants.defaultTipOptionsArray,
  splits: Constants.defaultSplitOptionsArray,
  tipSliderConfig: Constants.defaultTipSliderConfigValues,
  splitSliderConfig: Constants.defaultSplitSliderConfigValues,
  currencyConfig: undefined, // undefined = use device currency, persisted only when user explicitly selects
  savedTips: [],
  duplicatePreventionWindow: Constants.defaultDuplicatePreventionWindow,
  language: undefined,
  isRTL: false,
};

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = usePersistedReducer(
    rootReducer,
    initialState,
    Constants.APP_STATE_ASYNCSTORAGE_KEY,
  );

  // Sync i18n with persisted language state
  useEffect(() => {
    const syncLanguage = async () => {
      // If user has a saved language preference, apply it
      if (state.language && state.language !== getCurrentLanguage()) {
        await changeLanguage(state.language);
        applyRTLSync(state.language);
      }
    };

    syncLanguage();
  }, [state.language]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppProvider;

export { useAppContext };
