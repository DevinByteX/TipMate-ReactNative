import React, { createContext, Dispatch, useContext, ReactNode } from 'react';
import { ConfigState, ConfigAction } from './types';
import { tipReducer, splitReducer } from './reducers';
import { Constants } from '@configs';
import { usePersistedReducer } from '@hooks';

const initialState: ConfigState = {
  tips: Constants.defaultTipOptionsArray,
  splits: Constants.defaultSplitOptionsArray,
  tipSliderConfig: Constants.defaultTipSliderConfigValues,
  splitSliderConfig: Constants.defaultSplitSliderConfigValues,
};

const configReducer = (state: ConfigState, action: ConfigAction): ConfigState => {
  switch (action.type) {
    case 'LOAD_PERSISTED_STATE':
      return {
        ...state,
        tips: action.payload.tips ?? state.tips,
        splits: action.payload.splits ?? state.splits,
        tipSliderConfig: action.payload.tipSliderConfig ?? state.tipSliderConfig,
        splitSliderConfig: action.payload.splitSliderConfig ?? state.splitSliderConfig,
      };
    case 'UPDATE_TIP_OPTIONS':
    case 'RESET_TIP_OPTIONS_TO_DEFAULT':
      return { ...state, tips: tipReducer(state.tips, action) };
    case 'UPDATE_SPLIT_OPTIONS':
    case 'RESET_SPLIT_OPTIONS_TO_DEFAULT':
      return { ...state, splits: splitReducer(state.splits, action) };
    default:
      return state;
  }
};

const ConfigContext = createContext<{
  state: ConfigState;
  dispatch: Dispatch<ConfigAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = usePersistedReducer(
    configReducer,
    initialState,
    Constants.CONFIG_ASYNCSTORAGE_KEY,
  );

  return <ConfigContext.Provider value={{ state, dispatch }}>{children}</ConfigContext.Provider>;
};

export const useConfig = (): {
  state: ConfigState;
  dispatch: Dispatch<ConfigAction>;
} => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
};
