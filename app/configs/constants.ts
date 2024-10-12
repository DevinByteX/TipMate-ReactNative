import { SplitOptionState, SplitSliderConfigValues, TipOptionState, TipSliderConfigValues } from "@/context/types";

export type CurrencyType = {
    currencyId: string;
    currencyName: string;
    currencySign: string;
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
        step: 1
    } as SplitSliderConfigValues,
    defaultTipSliderConfigValues: {
        min: 0,
        max: 80,
        step: 1
    } as TipSliderConfigValues,
    currencies: [
        { currencyId: 'AED', currencyName: 'UAE Dirham', currencySign: 'AED' },
        { currencyId: 'ARS', currencyName: 'Argentine Peso', currencySign: 'ARS' },
        { currencyId: 'AUD', currencyName: 'Australian Dollar', currencySign: '$' },
        { currencyId: 'BDT', currencyName: 'Bangladeshi Taka', currencySign: '৳' },
        { currencyId: 'BHD', currencyName: 'Bahraini Dinar', currencySign: 'BHD' },
        { currencyId: 'BRL', currencyName: 'Brazilian Real', currencySign: 'R$' },
        { currencyId: 'CAD', currencyName: 'Canadian Dollar', currencySign: '$' },
        { currencyId: 'CHF', currencyName: 'Swiss Franc', currencySign: 'CHF' },
        { currencyId: 'CLP', currencyName: 'Chilean Peso', currencySign: 'CLP' },
        { currencyId: 'CNY', currencyName: 'Chinese Yuan', currencySign: '¥' },
        { currencyId: 'EGP', currencyName: 'Egyptian Pound', currencySign: '£' },
        { currencyId: 'EUR', currencyName: 'Euro', currencySign: '€' },
        { currencyId: 'GHS', currencyName: 'Ghanaian Cedi', currencySign: 'GHS' },
        { currencyId: 'GBP', currencyName: 'British Pound Sterling', currencySign: '£' },
        { currencyId: 'IDR', currencyName: 'Indonesian Rupiah', currencySign: 'Rp' },
        { currencyId: 'ILS', currencyName: 'Israeli New Shekel', currencySign: '₪' },
        { currencyId: 'INR', currencyName: 'Indian Rupee', currencySign: '₹' },
        { currencyId: 'JOD', currencyName: 'Jordanian Dinar', currencySign: 'JOD' },
        { currencyId: 'JPY', currencyName: 'Japanese Yen', currencySign: '¥' },
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
        { currencyId: 'USD', currencyName: 'US Dollar', currencySign: '$' },
        { currencyId: 'VND', currencyName: 'Vietnamese Dong', currencySign: '₫' },
        { currencyId: 'ZAR', currencyName: 'South African Rand', currencySign: 'R' },
    ] as CurrencyType[],
    defaultCurrencyObject:
        { currencyId: 'USD', currencyName: 'US Dollar', currencySign: '$' } as CurrencyType,
};