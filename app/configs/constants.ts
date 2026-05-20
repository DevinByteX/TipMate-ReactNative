/**
 * Thin assembler — composes domain-scoped constant files into the legacy
 * `Constants` shape so all existing call-sites continue to work unchanged.
 *
 * Edit the domain files directly for new additions:
 *   currencies.ts      — CurrencyType, currency list, defaultCurrencyObject
 *   defaultValues.ts   — default option arrays, slider configs, prevention window
 *   storageKeys.ts     — AsyncStorage key strings
 *   splitConstraints.ts — MIN/MAX_SPLIT_PEOPLE
 *   appInfo.ts         — APP_LINKS, EMAILS, APP_INFO
 */
import { currencies, defaultCurrencyObject, type CurrencyType } from './currencies';
import {
  defaultSplitOptionsArray,
  defaultTipOptionsArray,
  defaultSplitSliderConfigValues,
  defaultTipSliderConfigValues,
  defaultDuplicatePreventionWindow,
  duplicatePreventionTimeOptions,
  type DuplicatePreventionTimeOption,
} from './defaultValues';
import {
  APP_STATE_ASYNCSTORAGE_KEY,
  USER_SETTINGS_ASYNCSTORAGE_KEY,
  CONFIG_ASYNCSTORAGE_KEY,
  HISTORY_ASYNCSTORAGE_KEY,
} from './storageKeys';
import { MIN_SPLIT_PEOPLE, MAX_SPLIT_PEOPLE } from './splitConstraints';
import { APP_LINKS, EMAILS, APP_INFO } from './appInfo';

export const Constants = {
  defaultSplitOptionsArray,
  defaultTipOptionsArray,
  APP_STATE_ASYNCSTORAGE_KEY,
  USER_SETTINGS_ASYNCSTORAGE_KEY,
  CONFIG_ASYNCSTORAGE_KEY,
  HISTORY_ASYNCSTORAGE_KEY,
  defaultSplitSliderConfigValues,
  MIN_SPLIT_PEOPLE,
  MAX_SPLIT_PEOPLE,
  defaultTipSliderConfigValues,
  defaultDuplicatePreventionWindow,
  duplicatePreventionTimeOptions,
  currencies,
  defaultCurrencyObject,
  APP_LINKS,
  EMAILS,
  APP_INFO,
};

export type { CurrencyType, DuplicatePreventionTimeOption };

