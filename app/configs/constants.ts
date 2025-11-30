import {
  SplitOptionState,
  SplitSliderConfigValues,
  TipOptionState,
  TipSliderConfigValues,
} from '@/context/types';

export type CurrencyType = {
  currencyId: string;
  currencyName: string;
  currencySign: string;
};

export type DuplicatePreventionTimeOption = {
  value: number;
  label: string;
};

export const Constants = {
  defaultSplitOptionsArray: [
    { place: 1, value: 1 },
    { place: 2, value: 3 },
    { place: 3, value: 5 },
    { place: 4, value: 7 },
  ] as SplitOptionState[],
  defaultTipOptionsArray: [
    { place: 1, value: 0 },
    { place: 2, value: 5 },
    { place: 3, value: 10 },
    { place: 4, value: 15 },
  ] as TipOptionState[],
  APP_STATE_ASYNCSTORAGE_KEY: 'APPSTATE' as string,
  defaultSplitSliderConfigValues: {
    min: 1,
    max: 15,
    step: 1,
  } as SplitSliderConfigValues,
  defaultTipSliderConfigValues: {
    min: 0,
    max: 80,
    step: 1,
  } as TipSliderConfigValues,
  defaultDuplicatePreventionWindow: 15 as number, // default 15 minutes
  duplicatePreventionTimeOptions: [
    { value: 0, label: 'No prevention' },
    { value: 2, label: '2 minutes' },
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '60 minutes' },
  ] as DuplicatePreventionTimeOption[],
  currencies: [
    // Main and Famous Currencies
    { currencyId: 'USD', currencyName: 'US Dollar', currencySign: '$' },
    { currencyId: 'EUR', currencyName: 'Euro', currencySign: '€' },
    { currencyId: 'GBP', currencyName: 'British Pound Sterling', currencySign: '£' },
    { currencyId: 'JPY', currencyName: 'Japanese Yen', currencySign: '¥' },
    { currencyId: 'AUD', currencyName: 'Australian Dollar', currencySign: '$' },
    { currencyId: 'CAD', currencyName: 'Canadian Dollar', currencySign: '$' },
    { currencyId: 'CHF', currencyName: 'Swiss Franc', currencySign: 'CHF' },
    { currencyId: 'CNY', currencyName: 'Chinese Yuan', currencySign: '¥' },
    { currencyId: 'INR', currencyName: 'Indian Rupee', currencySign: '₹' },

    // Other Currencies in Ascending Order
    { currencyId: 'AED', currencyName: 'UAE Dirham', currencySign: 'AED' },
    { currencyId: 'ARS', currencyName: 'Argentine Peso', currencySign: 'ARS' },
    { currencyId: 'BDT', currencyName: 'Bangladeshi Taka', currencySign: '৳' },
    { currencyId: 'BHD', currencyName: 'Bahraini Dinar', currencySign: 'BHD' },
    { currencyId: 'BRL', currencyName: 'Brazilian Real', currencySign: 'R$' },
    { currencyId: 'CLP', currencyName: 'Chilean Peso', currencySign: 'CLP' },
    { currencyId: 'EGP', currencyName: 'Egyptian Pound', currencySign: '£' },
    { currencyId: 'GHS', currencyName: 'Ghanaian Cedi', currencySign: 'GHS' },
    { currencyId: 'IDR', currencyName: 'Indonesian Rupiah', currencySign: 'Rp' },
    { currencyId: 'ILS', currencyName: 'Israeli New Shekel', currencySign: '₪' },
    { currencyId: 'JOD', currencyName: 'Jordanian Dinar', currencySign: 'JOD' },
    { currencyId: 'KES', currencyName: 'Kenyan Shilling', currencySign: 'KES' },
    { currencyId: 'KRW', currencyName: 'South Korean Won', currencySign: '₩' },
    { currencyId: 'KWD', currencyName: 'Kuwaiti Dinar', currencySign: 'KWD' },
    { currencyId: 'LKR', currencyName: 'Sri Lankan Rupee', currencySign: 'LKR' },
    { currencyId: 'MXN', currencyName: 'Mexican Peso', currencySign: '$' },
    { currencyId: 'MYR', currencyName: 'Malaysian Ringgit', currencySign: 'RM' },
    { currencyId: 'NGN', currencyName: 'Nigerian Naira', currencySign: '₦' },
    { currencyId: 'NZD', currencyName: 'New Zealand Dollar', currencySign: '$' },
    { currencyId: 'OMR', currencyName: 'Omani Rial', currencySign: 'OMR' },
    { currencyId: 'PHP', currencyName: 'Philippine Peso', currencySign: '₱' },
    { currencyId: 'PKR', currencyName: 'Pakistani Rupee', currencySign: '₨' },
    { currencyId: 'QAR', currencyName: 'Qatari Riyal', currencySign: 'QAR' },
    { currencyId: 'RUB', currencyName: 'Russian Ruble', currencySign: '₽' },
    { currencyId: 'SAR', currencyName: 'Saudi Riyal', currencySign: 'SAR' },
    { currencyId: 'SGD', currencyName: 'Singapore Dollar', currencySign: '$' },
    { currencyId: 'THB', currencyName: 'Thai Baht', currencySign: '฿' },
    { currencyId: 'TRY', currencyName: 'Turkish Lira', currencySign: '₺' },
    { currencyId: 'TZS', currencyName: 'Tanzanian Shilling', currencySign: 'TZS' },
    { currencyId: 'UGX', currencyName: 'Ugandan Shilling', currencySign: 'UGX' },
    { currencyId: 'VND', currencyName: 'Vietnamese Dong', currencySign: '₫' },
    { currencyId: 'ZAR', currencyName: 'South African Rand', currencySign: 'R' },
  ] as CurrencyType[],
  defaultCurrencyObject: {
    currencyId: 'USD',
    currencyName: 'US Dollar',
    currencySign: '$',
  } as CurrencyType,
};

export const APP_LINKS = {
  playStore: 'https://play.google.com/store/apps/dev?id=7058400265435813852',
  appStore: 'https://play.google.com/store/apps/dev?id=7058400265435813852',
  privacyPolicy: 'https://www.freeprivacypolicy.com/live/7f96b8fd-6f24-4098-a929-443d12cb5f54',
};

export const EMAILS = {
  support: 'devinforge.appsconsole@gmail.com',
};

export const APP_INFO = {
  version: '1.3.0',
};
