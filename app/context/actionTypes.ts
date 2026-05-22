/**
 * Action type string constants for all app reducers.
 * Use these instead of inline string literals in switch cases and dispatch calls
 * so that renaming an action only requires a single change here.
 */
export const ActionTypes = {
  // Tip options
  UPDATE_TIP_OPTIONS: 'UPDATE_TIP_OPTIONS',
  RESET_TIP_OPTIONS_TO_DEFAULT: 'RESET_TIP_OPTIONS_TO_DEFAULT',

  // Split options
  UPDATE_SPLIT_OPTIONS: 'UPDATE_SPLIT_OPTIONS',
  RESET_SPLIT_OPTIONS_TO_DEFAULT: 'RESET_SPLIT_OPTIONS_TO_DEFAULT',

  // Currency
  UPDATE_CURRENCY_SIGN: 'UPDATE_CURRENCY_SIGN',
  RESET_CURRENCY_TO_SYSTEM: 'RESET_CURRENCY_TO_SYSTEM',

  // Saved tips
  SAVE_TIP: 'SAVE_TIP',
  DELETE_TIP: 'DELETE_TIP',
  CLEAR_ALL_TIPS: 'CLEAR_ALL_TIPS',

  // Duplicate prevention
  UPDATE_DUPLICATE_PREVENTION_WINDOW: 'UPDATE_DUPLICATE_PREVENTION_WINDOW',

  // Language
  SET_LANGUAGE: 'SET_LANGUAGE',
  RESET_LANGUAGE_TO_SYSTEM: 'RESET_LANGUAGE_TO_SYSTEM',

  // Tax input
  SET_SHOW_TAX_INPUT: 'SET_SHOW_TAX_INPUT',

  // Split configuration (session-only)
  SET_ACTIVE_SPLIT_CONFIG: 'SET_ACTIVE_SPLIT_CONFIG',
  CLEAR_ACTIVE_SPLIT_CONFIG: 'CLEAR_ACTIVE_SPLIT_CONFIG',

  // Saved split presets
  SAVE_SPLIT_PRESET: 'SAVE_SPLIT_PRESET',
  UPDATE_SPLIT_PRESET: 'UPDATE_SPLIT_PRESET',
  DELETE_SPLIT_PRESET: 'DELETE_SPLIT_PRESET',

  // Persistence
  LOAD_PERSISTED_STATE: 'LOAD_PERSISTED_STATE',
} as const;
