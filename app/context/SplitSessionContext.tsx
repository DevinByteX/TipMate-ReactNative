import React, { createContext, Dispatch, useContext, useReducer, ReactNode } from 'react';
import { SplitSessionState, SplitConfigAction } from './types';
import { splitConfigReducer } from './reducers';
import { ActionTypes } from './actionTypes';

const initialState: SplitSessionState = {
  activeSplitConfig: undefined,
};

const splitSessionReducer = (
  state: SplitSessionState,
  action: SplitConfigAction,
): SplitSessionState => {
  switch (action.type) {
    case ActionTypes.SET_ACTIVE_SPLIT_CONFIG:
    case ActionTypes.CLEAR_ACTIVE_SPLIT_CONFIG:
      return { ...state, activeSplitConfig: splitConfigReducer(state.activeSplitConfig, action) };
    default:
      return state;
  }
};

const SplitSessionContext = createContext<{
  state: SplitSessionState;
  dispatch: Dispatch<SplitConfigAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export const SplitSessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Intentionally uses useReducer (not usePersistedReducer) — activeSplitConfig is
  // session-only state and should reset to undefined on every app restart.
  // savedSplitPresets (the persisted list) lives in HistoryContext instead.
  const [state, dispatch] = useReducer(splitSessionReducer, initialState);

  return (
    <SplitSessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SplitSessionContext.Provider>
  );
};

export const useSplitSession = (): {
  state: SplitSessionState;
  dispatch: Dispatch<SplitConfigAction>;
} => {
  const context = useContext(SplitSessionContext);
  if (!context) {
    throw new Error('useSplitSession must be used within SplitSessionProvider');
  }
  return context;
};
