import React, { createContext, useReducer, Dispatch, ReactNode } from 'react';
import { AppState, AppAction } from './types';
import { rootReducer } from './rootReducer';
import { Constants } from '@configs';
import { usePersistedReducer } from '@hooks';

const initialState: AppState = {
  tips: Constants.defaultTipOptionsArray,
  splits: Constants.defaultSplitOptionsArray,
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
  const [state, dispatch] = usePersistedReducer(rootReducer, initialState, 'appState');

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
