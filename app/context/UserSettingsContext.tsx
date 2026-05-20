import React, { createContext, Dispatch, useContext, useEffect, ReactNode } from 'react';
import { UserSettingsState, UserSettingsAction } from './types';
import { currencyConfigReducer, duplicatePreventionReducer, languageReducer } from './reducers';
import { ActionTypes } from './actionTypes';
import { Constants } from '@configs';
import { usePersistedReducer } from '../hooks/usePersistedReducer';
import { changeLanguage, applyRTLSync, getCurrentLanguage } from '../localization';

const initialState: UserSettingsState = {
  currencyConfig: undefined,
  language: undefined,
  isRTL: false,
  duplicatePreventionWindow: Constants.defaultDuplicatePreventionWindow,
};

const userSettingsReducer = (
  state: UserSettingsState,
  action: UserSettingsAction,
): UserSettingsState => {
  switch (action.type) {
    case ActionTypes.LOAD_PERSISTED_STATE:
      return {
        ...state,
        currencyConfig: action.payload.currencyConfig ?? state.currencyConfig,
        language: action.payload.language ?? state.language,
        isRTL: action.payload.isRTL ?? state.isRTL,
        duplicatePreventionWindow:
          action.payload.duplicatePreventionWindow ?? state.duplicatePreventionWindow,
      };
    case ActionTypes.UPDATE_CURRENCY_SIGN:
    case ActionTypes.RESET_CURRENCY_TO_SYSTEM:
      return { ...state, currencyConfig: currencyConfigReducer(state.currencyConfig, action) };
    case ActionTypes.UPDATE_DUPLICATE_PREVENTION_WINDOW:
      return {
        ...state,
        duplicatePreventionWindow: duplicatePreventionReducer(
          state.duplicatePreventionWindow,
          action,
        ),
      };
    case ActionTypes.SET_LANGUAGE:
    case ActionTypes.RESET_LANGUAGE_TO_SYSTEM: {
      const langState = languageReducer({ language: state.language, isRTL: state.isRTL }, action);
      return { ...state, ...langState };
    }
    default:
      return state;
  }
};

const UserSettingsContext = createContext<
  | {
      state: UserSettingsState;
      dispatch: Dispatch<UserSettingsAction>;
    }
  | undefined
>(undefined);

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = usePersistedReducer(
    userSettingsReducer,
    initialState,
    Constants.USER_SETTINGS_ASYNCSTORAGE_KEY,
  );

  // Sync i18n with persisted language state
  useEffect(() => {
    const syncLanguage = async () => {
      if (state.language && state.language !== getCurrentLanguage()) {
        await changeLanguage(state.language);
        applyRTLSync(state.language);
      }
    };
    syncLanguage();
  }, [state.language]);

  return (
    <UserSettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = (): {
  state: UserSettingsState;
  dispatch: Dispatch<UserSettingsAction>;
} => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettings must be used within UserSettingsProvider');
  }
  return context;
};
