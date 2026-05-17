/**
 * Currency detection and display utilities
 * Uses device locale to determine default currency (similar to language detection)
 */

import { getLocales, getCurrencies } from 'react-native-localize';
import { Constants, CurrencyType } from '@configs';

// Cache for device currency to avoid repeated detection
let cachedDeviceCurrency: CurrencyType | null = null;

/**
 * Country code to currency code mapping
 * Used as fallback when getCurrencies() is unavailable
 */
const COUNTRY_TO_CURRENCY: Record<string, string> = {
    // Main currencies
    US: 'USD',
    GB: 'GBP',
    AU: 'AUD',
    CA: 'CAD',
    JP: 'JPY',
    CH: 'CHF',
    CN: 'CNY',
    IN: 'INR',

    // Eurozone countries
    AT: 'EUR',
    BE: 'EUR',
    CY: 'EUR',
    EE: 'EUR',
    FI: 'EUR',
    FR: 'EUR',
    DE: 'EUR',
    GR: 'EUR',
    IE: 'EUR',
    IT: 'EUR',
    LV: 'EUR',
    LT: 'EUR',
    LU: 'EUR',
    MT: 'EUR',
    NL: 'EUR',
    PT: 'EUR',
    SK: 'EUR',
    SI: 'EUR',
    ES: 'EUR',

    // Other supported currencies
    AE: 'AED',
    AR: 'ARS',
    BD: 'BDT',
    BH: 'BHD',
    BR: 'BRL',
    CL: 'CLP',
    EG: 'EGP',
    GH: 'GHS',
    ID: 'IDR',
    IL: 'ILS',
    JO: 'JOD',
    KE: 'KES',
    KR: 'KRW',
    KW: 'KWD',
    LK: 'LKR',
    MX: 'MXN',
    MY: 'MYR',
    NG: 'NGN',
    NZ: 'NZD',
    OM: 'OMR',
    PH: 'PHP',
    PK: 'PKR',
    QA: 'QAR',
    RU: 'RUB',
    SA: 'SAR',
    SG: 'SGD',
    TH: 'THB',
    TR: 'TRY',
    TZ: 'TZS',
    UG: 'UGX',
    VN: 'VND',
    ZA: 'ZAR',
};

/**
 * Find currency object by currency code
 */
const findCurrencyByCode = (currencyCode: string): CurrencyType | undefined => {
    return Constants.currencies.find(
        currency => currency.currencyId.toUpperCase() === currencyCode.toUpperCase(),
    );
};

/**
 * Get the device's preferred currency
 * Priority: 1. Device preferred currencies 2. Locale-mapped currency 3. USD fallback
 */
export const getDeviceCurrency = (): CurrencyType => {
    // Return cached value if available
    if (cachedDeviceCurrency) {
        return cachedDeviceCurrency;
    }

    try {
        // 1. Try device preferred currencies first
        const deviceCurrencies = getCurrencies();
        if (deviceCurrencies && deviceCurrencies.length > 0) {
            const preferredCurrency = findCurrencyByCode(deviceCurrencies[0]);
            if (preferredCurrency) {
                cachedDeviceCurrency = preferredCurrency;
                return preferredCurrency;
            }
        }

        // 2. Fallback to locale-mapped currency
        const locales = getLocales();
        if (locales && locales.length > 0) {
            const countryCode = locales[0].countryCode;
            if (countryCode) {
                const currencyCode = COUNTRY_TO_CURRENCY[countryCode.toUpperCase()];
                if (currencyCode) {
                    const mappedCurrency = findCurrencyByCode(currencyCode);
                    if (mappedCurrency) {
                        cachedDeviceCurrency = mappedCurrency;
                        return mappedCurrency;
                    }
                }
            }
        }
    } catch (error) {
        console.warn('Failed to get device currency:', error);
    }

    // 3. Fallback to USD
    cachedDeviceCurrency = Constants.defaultCurrencyObject;
    return Constants.defaultCurrencyObject;
};
