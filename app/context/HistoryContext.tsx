import React, { createContext, Dispatch, useContext, ReactNode } from 'react';
import { HistoryState, HistoryAction } from './types';
import { savedTipsReducer, savedSplitPresetsReducer } from './reducers';
import { Constants } from '@configs';
import { usePersistedReducer } from '@hooks';

const initialState: HistoryState = {
  savedTips: [],
  savedSplitPresets: [],
};

const historyReducer = (state: HistoryState, action: HistoryAction): HistoryState => {
  switch (action.type) {
    case 'LOAD_PERSISTED_STATE':
      return {
        ...state,
        savedTips: action.payload.savedTips ?? state.savedTips,
        savedSplitPresets: action.payload.savedSplitPresets ?? state.savedSplitPresets,
      };
    case 'SAVE_TIP':
    case 'DELETE_TIP':
    case 'CLEAR_ALL_TIPS':
      return { ...state, savedTips: savedTipsReducer(state.savedTips, action) };
    case 'SAVE_SPLIT_PRESET':
    case 'UPDATE_SPLIT_PRESET':
    case 'DELETE_SPLIT_PRESET':
      return {
        ...state,
        savedSplitPresets: savedSplitPresetsReducer(state.savedSplitPresets, action),
      };
    default:
      return state;
  }
};

const HistoryContext = createContext<{
  state: HistoryState;
  dispatch: Dispatch<HistoryAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = usePersistedReducer(
    historyReducer,
    initialState,
    Constants.HISTORY_ASYNCSTORAGE_KEY,
  );

  return <HistoryContext.Provider value={{ state, dispatch }}>{children}</HistoryContext.Provider>;
};

export const useHistory = (): {
  state: HistoryState;
  dispatch: Dispatch<HistoryAction>;
} => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within HistoryProvider');
  }
  return context;
};
